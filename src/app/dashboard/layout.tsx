import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="h-full bg-background">
      {/* Static sidebar for desktop */}
      <Sidebar />

      <div className="lg:pl-64 flex flex-col h-full">
        <TopNavbar />
        
        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
