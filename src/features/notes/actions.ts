"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UserNote } from "./types";

export async function getNotes(): Promise<{ data: UserNote[] | null, error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("user_notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as UserNote[], error: null };
}

export async function saveNote(note: Partial<UserNote> & { title: string, content: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Calculate next revision date based on confidence
  let nextRevision = new Date();
  if (note.confidence_level === "High") nextRevision.setDate(nextRevision.getDate() + 14);
  else if (note.confidence_level === "Medium") nextRevision.setDate(nextRevision.getDate() + 3);
  else nextRevision.setDate(nextRevision.getDate() + 1);

  const payload = {
    ...note,
    user_id: user.id,
    next_revision_date: nextRevision.toISOString(),
    updated_at: new Date().toISOString()
  };

  let result;
  if (note.id) {
    result = await supabase.from("user_notes").update(payload).eq("id", note.id).eq("user_id", user.id).select().single();
  } else {
    result = await supabase.from("user_notes").insert([payload]).select().single();
  }

  if (result.error) return { error: result.error.message };

  revalidatePath("/dashboard/notes");
  return { data: result.data as UserNote, success: true };
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("user_notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/notes");
  return { success: true };
}
