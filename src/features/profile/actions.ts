"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const payload = {
    leetcode_handle: formData.get("leetcode_handle") as string || null,
    codeforces_handle: formData.get("codeforces_handle") as string || null,
    github_handle: formData.get("github_handle") as string || null,
    updated_at: new Date().toISOString()
  };

  const { data: existing } = await supabase.from("user_profiles").select("user_id").eq("user_id", user.id).single();

  let error;
  if (existing) {
    const res = await supabase.from("user_profiles").update(payload).eq("user_id", user.id);
    error = res.error;
  } else {
    const res = await supabase.from("user_profiles").insert([{ user_id: user.id, ...payload }]);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

// ============================================================================
// LINKED PROFILES ACTIONS
// ============================================================================

export async function getLinkedProfiles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("linked_profiles")
    .select("*")
    .eq("user_id", user.id);

  return data || [];
}

export async function linkProfile(platform: "GitHub" | "LeetCode" | "Codeforces", handle: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Note: For now we just insert/upsert the handle.
  // We can add actual verification logic (like checking the API) if needed later.
  const { error } = await supabase
    .from("linked_profiles")
    .upsert({
      user_id: user.id,
      platform,
      handle,
      is_verified: true, // Auto-verified for now
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id, platform" });

  if (error) {
    console.error(`Error linking ${platform} profile:`, error);
    return { error: `Failed to link ${platform} profile.` };
  }

  revalidatePath("/dashboard/settings/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function unlinkProfile(platform: "GitHub" | "LeetCode" | "Codeforces") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("linked_profiles")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", platform);

  if (error) {
    console.error(`Error unlinking ${platform} profile:`, error);
    return { error: `Failed to unlink ${platform} profile.` };
  }

  // Also remove cached analytics for this platform
  await supabase
    .from("cached_analytics")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", platform);

  revalidatePath("/dashboard/settings/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
