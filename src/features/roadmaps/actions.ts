"use server";

import { createClient } from "@/utils/supabase/server";
import { getRoadmapById } from "@/data/roadmaps";
import { revalidatePath } from "next/cache";

export async function enrollRoadmap(roadmapId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) return { error: "Invalid roadmap" };

  const { error } = await supabase
    .from("roadmap_progress")
    .insert([{
      user_id: user.id,
      roadmap_id: roadmapId,
      total_topics: roadmap.topics.length,
      completed_topics_count: 0,
      progress_percent: 0,
      updated_at: new Date().toISOString()
    }]);

  if (error) {
    console.error("Error enrolling in roadmap:", error);
    return { error: "Failed to enroll" };
  }

  revalidatePath("/dashboard/roadmaps");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleTopicProgress(roadmapId: string, topicId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Update topic progress
  const { error: topicError } = await supabase
    .from("user_topic_progress")
    .upsert({
      user_id: user.id,
      roadmap_id: roadmapId,
      topic_id: topicId,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id, roadmap_id, topic_id" });

  if (topicError) {
    console.error("Error updating topic:", topicError);
    return { error: "Failed to update progress" };
  }

  // Recalculate roadmap progress
  const roadmap = getRoadmapById(roadmapId);
  if (roadmap) {
    const { data: completedTopics } = await supabase
      .from("user_topic_progress")
      .select("topic_id")
      .eq("user_id", user.id)
      .eq("roadmap_id", roadmapId)
      .eq("is_completed", true);

    const completedCount = completedTopics?.length || 0;
    const totalCount = roadmap.topics.length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    await supabase
      .from("roadmap_progress")
      .update({
        completed_topics_count: completedCount,
        total_topics: totalCount,
        progress_percent: percent,
        last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)
      .eq("roadmap_id", roadmapId);
  }

  revalidatePath(`/dashboard/roadmaps/${roadmapId}`);
  revalidatePath("/dashboard/roadmaps");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getUserRoadmapProgress(roadmapId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("roadmap_id", roadmapId);

  return data || [];
}
