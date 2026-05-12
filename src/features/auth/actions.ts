"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type ActionState = { error: string | null; message: string | null };

export async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required", message: null };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, message: null };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required", message: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message, message: null };
  }

  if (data.session === null) {
    return { error: null, message: "Success! Please check your email for a confirmation link." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
