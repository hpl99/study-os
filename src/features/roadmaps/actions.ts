"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleTopicProgress(roadmapId: string, topicId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to track progress." };
  }

  // Check if a record already exists
  const { data: existingRecord } = await supabase
    .from("user_topic_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("roadmap_id", roadmapId)
    .eq("topic_id", topicId)
    .single();

  let error;

  if (existingRecord) {
    // Update existing
    const { error: updateError } = await supabase
      .from("user_topic_progress")
      .update({ 
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingRecord.id);
      
    error = updateError;
  } else {
    // Insert new
    const { error: insertError } = await supabase
      .from("user_topic_progress")
      .insert({
        user_id: user.id,
        roadmap_id: roadmapId,
        topic_id: topicId,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      });
      
    error = insertError;
  }

  if (error) {
    console.error("Error updating progress:", error);
    return { error: "Failed to update progress." };
  }

  revalidatePath(`/dashboard/roadmaps/${roadmapId}`);
  revalidatePath(`/dashboard/roadmaps/${roadmapId}/${topicId}`);
  
  return { success: true };
}

export async function getUserRoadmapProgress(roadmapId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("roadmap_id", roadmapId);

  if (error) {
    console.error("Error fetching progress:", error);
    return [];
  }

  return data;
}
