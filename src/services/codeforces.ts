import { createClient } from "@/utils/supabase/server";

export async function fetchCodeforcesStats(handle: string, userId?: string) {
  if (!handle) return null;

  let supabase: any = null;
  let cachedData: any = null;

  if (userId) {
    supabase = await createClient();
    const { data } = await supabase
      .from("cached_analytics")
      .select("*")
      .eq("user_id", userId)
      .eq("platform", "Codeforces")
      .single();
      
    if (data) {
      cachedData = data.data;
      const ageHours = (new Date().getTime() - new Date(data.updated_at).getTime()) / 3600000;
      if (ageHours < 1) return cachedData;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    if (!res.ok) throw new Error(`Codeforces API returned status ${res.status}`);
    
    const data = await res.json();
    clearTimeout(timeoutId);

    if (data.status !== "OK") {
      throw new Error(data.comment || "Invalid Codeforces handle");
    }

    const user = data.result[0];
    const liveData = {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "Unrated",
      avatar: user.avatar
    };

    if (userId && supabase && liveData) {
      if (cachedData) {
        await supabase.from("cached_analytics").update({ data: liveData, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("platform", "Codeforces");
      } else {
        await supabase.from("cached_analytics").insert([{ user_id: userId, platform: "Codeforces", data: liveData }]);
      }
    }

    return liveData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Codeforces API Error:", error);
    
    if (cachedData) {
      console.warn("Falling back to stale database cache for Codeforces");
      return cachedData;
    }

    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to load Codeforces stats",
      rating: 0,
      maxRating: 0,
      rank: "Error",
      avatar: ""
    };
  }
}
