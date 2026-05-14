import { createClient } from "@/utils/supabase/server";

export async function fetchGitHubStats(username: string, userId?: string) {
  if (!username) return null;

  let supabase: any = null;
  let cachedData: any = null;

  if (userId) {
    supabase = await createClient();
    const { data } = await supabase
      .from("cached_analytics")
      .select("*")
      .eq("user_id", userId)
      .eq("platform", "GitHub")
      .single();
      
    if (data) {
      cachedData = data.data;
      const ageHours = (new Date().getTime() - new Date(data.updated_at).getTime()) / 3600000;
      if (ageHours < 1) return cachedData;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    if (!res.ok) throw new Error(`GitHub API returned status ${res.status}`);
    
    const data = await res.json();
    clearTimeout(timeoutId);

    const liveData = {
      followers: data.followers,
      publicRepos: data.public_repos,
      avatar: data.avatar_url,
      profileUrl: data.html_url
    };

    if (userId && supabase && liveData) {
      if (cachedData) {
        await supabase.from("cached_analytics").update({ data: liveData, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("platform", "GitHub");
      } else {
        await supabase.from("cached_analytics").insert([{ user_id: userId, platform: "GitHub", data: liveData }]);
      }
    }

    return liveData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("GitHub API Error:", error);
    
    if (cachedData) {
      console.warn("Falling back to stale database cache for GitHub");
      return cachedData;
    }

    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to load GitHub stats",
      followers: 0,
      publicRepos: 0,
      avatar: "",
      profileUrl: ""
    };
  }
}
