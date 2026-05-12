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
