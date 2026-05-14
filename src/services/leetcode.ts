import { createClient } from "@/utils/supabase/server";

export async function fetchLeetCodeStats(username: string, userId?: string) {
  if (!username) return null;

  let supabase: any = null;
  let cachedData: any = null;
  
  // 1. Check Database Cache First
  if (userId) {
    supabase = await createClient();
    const { data } = await supabase
      .from("cached_analytics")
      .select("*")
      .eq("user_id", userId)
      .eq("platform", "LeetCode")
      .single();
      
    if (data) {
      cachedData = data.data;
      const ageHours = (new Date().getTime() - new Date(data.updated_at).getTime()) / 3600000;
      // If data is less than 1 hour old, return immediately
      if (ageHours < 1) return cachedData;
    }
  }

  // 2. Fetch Live Data
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    let res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });

    let liveData: any = null;

    if (!res.ok || res.status === 429) {
      console.warn("Primary LeetCode API failed, trying fallback...");
      res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`, {
        next: { revalidate: 3600 },
        signal: controller.signal
      });
      
      if (!res.ok) throw new Error("Fallback API also failed");
      
      const fallbackData = await res.json();
      clearTimeout(timeoutId);
      
      liveData = {
        totalSolved: fallbackData.solvedProblem || 0,
        easySolved: fallbackData.easySolved || 0,
        mediumSolved: fallbackData.mediumSolved || 0,
        hardSolved: fallbackData.hardSolved || 0,
        ranking: 0 // Not available in fallback
      };
    } else {
      const data = await res.json();
      clearTimeout(timeoutId);

      if (data.status !== "success") {
         throw new Error(data.message || "Invalid LeetCode username");
      }

      liveData = {
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved,
        ranking: data.ranking
      };
    }

    // 3. Upsert Cache
    if (userId && supabase && liveData) {
      if (cachedData) {
        await supabase.from("cached_analytics").update({ data: liveData, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("platform", "LeetCode");
      } else {
        await supabase.from("cached_analytics").insert([{ user_id: userId, platform: "LeetCode", data: liveData }]);
      }
    }

    return liveData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("LeetCode API Error:", error);
    
    // If live fetch fails but we have stale cache, return the cache to prevent the widget from disappearing!
    if (cachedData) {
      console.warn("Falling back to stale database cache for LeetCode");
      return cachedData;
    }
    
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to load LeetCode stats",
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      ranking: 0
    };
  }
}
