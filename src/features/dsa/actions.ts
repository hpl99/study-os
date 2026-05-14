"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UserProblem, ProblemFormData } from "./types";
import { analyzeWeakTopics } from "@/services/ai/gemini";

export async function getTopicAnalysis(topics: string[]) {
  return await analyzeWeakTopics(topics);
}

export async function getProblems(): Promise<{ data: UserProblem[] | null, error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("user_problems")
    .select("*")
    .eq("user_id", user.id)
    .order("solved_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as UserProblem[], error: null };
}

export async function addProblem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const rawTags = formData.get("topic_tags") as string;
  const tags = rawTags ? rawTags.split(",").map(t => t.trim()).filter(Boolean) : [];

  const payload = {
    user_id: user.id,
    platform: formData.get("platform") as string,
    title: formData.get("title") as string,
    url: formData.get("url") as string,
    difficulty: formData.get("difficulty") as string,
    topic_tags: tags,
    time_taken_mins: formData.get("time_taken_mins") ? parseInt(formData.get("time_taken_mins") as string) : null,
    status: "Solved",
    is_bookmarked: false,
    solved_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_problems").insert([payload]);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/dsa");
  return { success: true };
}

export async function toggleBookmark(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("user_problems")
    .update({ is_bookmarked: !currentStatus })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/dsa");
  return { success: true };
}

export async function deleteProblem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("user_problems")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/dsa");
  return { success: true };
}
