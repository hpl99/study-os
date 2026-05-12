import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <form action={logout}>
            <Button variant="outline">Sign out</Button>
          </form>
        </header>

        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-muted-foreground">
            Welcome back, {user.email}! This is your authenticated dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
