import { createClient } from "@/utils/supabase/server";
import { LandingPageClient } from "./landing-client";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <LandingPageClient user={user} />;
}
