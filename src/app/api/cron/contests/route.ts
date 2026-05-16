import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchContests } from "@/services/contests";
import { sendContestNotificationEmail } from "@/services/email/resend";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Simple auth for the cron endpoint
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Initialize Supabase Admin client to bypass RLS for cron job
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Admin key needed!
    
    // If service role key is missing, this cron job cannot query users globally
    if (!supabaseServiceRoleKey) {
      console.warn("Missing SUPABASE_SERVICE_ROLE_KEY for cron job.");
      return new NextResponse('Server configuration error', { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 2. Fetch all upcoming contests
    const allContests = await fetchContests();
    
    // 3. Filter contests starting in the next 24 hours
    const nowSecs = Math.floor(Date.now() / 1000);
    const next24hSecs = nowSecs + (24 * 60 * 60);
    const upcoming24h = allContests.filter(c => 
      c.startTimeSeconds > nowSecs && c.startTimeSeconds <= next24hSecs
    );

    if (upcoming24h.length === 0) {
      return NextResponse.json({ message: 'No contests in the next 24 hours. Skipping.' });
    }

    // 4. Fetch users who have opted into email notifications
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('notification_preferences')
      .select('user_id, email_notifications_enabled, notify_codeforces, notify_leetcode, notify_atcoder')
      .eq('email_notifications_enabled', true);

    if (prefError || !preferences || preferences.length === 0) {
      return NextResponse.json({ message: 'No users opted in for notifications.' });
    }

    // 5. Fetch emails for these users
    // (Requires querying auth.users which is only possible with Service Role Key)
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError || !users) {
      console.error("Failed to list users:", authError);
      return new NextResponse('Failed to retrieve users', { status: 500 });
    }

    const emailPromises = preferences.map(async (pref) => {
      const user = users.find(u => u.id === pref.user_id);
      if (!user?.email) return null;

      // Filter contests based on user preferences
      const userContests = upcoming24h.filter(c => {
        if (c.platform === 'Codeforces' && !pref.notify_codeforces) return false;
        if (c.platform === 'LeetCode' && !pref.notify_leetcode) return false;
        if (c.platform === 'AtCoder' && !pref.notify_atcoder) return false;
        return true;
      });

      if (userContests.length === 0) return null;

      // Send email
      return sendContestNotificationEmail(user.email, userContests);
    });

    const results = await Promise.all(emailPromises);
    const sentCount = results.filter(r => r && r.success).length;

    return NextResponse.json({ 
      success: true, 
      message: `Sent ${sentCount} notifications out of ${preferences.length} opted-in users.` 
    });

  } catch (error) {
    console.error("Cron Job Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
