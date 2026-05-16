"use server";

import { createClient } from "@/utils/supabase/server";
import { fetchGitHubStats } from "@/services/github";
import { fetchLeetCodeStats } from "@/services/leetcode";
import { fetchCodeforcesStats } from "@/services/codeforces";

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch user profile (for basic info if needed)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 2. Fetch linked profiles
  const { data: linkedProfiles } = await supabase
    .from("linked_profiles")
    .select("*")
    .eq("user_id", user.id);

  // 3. Extract handles
  const githubHandle = linkedProfiles?.find(p => p.platform === "GitHub")?.handle;
  const leetcodeHandle = linkedProfiles?.find(p => p.platform === "LeetCode")?.handle;
  const codeforcesHandle = linkedProfiles?.find(p => p.platform === "Codeforces")?.handle;

  // 4. Fetch analytics concurrently
  const [githubStats, leetcodeStats, codeforcesStats] = await Promise.all([
    githubHandle ? fetchGitHubStats(githubHandle, user.id).catch(() => null) : Promise.resolve(null),
    leetcodeHandle ? fetchLeetCodeStats(leetcodeHandle, user.id).catch(() => null) : Promise.resolve(null),
    codeforcesHandle ? fetchCodeforcesStats(codeforcesHandle, user.id).catch(() => null) : Promise.resolve(null),
  ]);

  // 5. Fetch enrolled roadmaps / activity map data (We will build these fully in Task 4, 
  // but stubbing them here so dashboard is ready)
  const { data: roadmapProgress } = await supabase
    .from("roadmap_progress")
    .select("*")
    .eq("user_id", user.id);

  return {
    user: profile,
    linkedProfiles: linkedProfiles || [],
    stats: {
      github: githubStats,
      leetcode: leetcodeStats,
      codeforces: codeforcesStats,
    },
    roadmaps: roadmapProgress || []
  };
}
