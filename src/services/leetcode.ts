export async function fetchLeetCodeStats(username: string) {
  if (!username) return null;

  // Add timeout handling using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    let res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });

    if (!res.ok || res.status === 429) {
      console.warn("Primary LeetCode API failed, trying fallback...");
      res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`, {
        next: { revalidate: 3600 },
        signal: controller.signal
      });
      
      if (!res.ok) throw new Error("Fallback API also failed");
      
      const fallbackData = await res.json();
      clearTimeout(timeoutId);
      
      return {
        totalSolved: fallbackData.solvedProblem || 0,
        easySolved: fallbackData.easySolved || 0,
        mediumSolved: fallbackData.mediumSolved || 0,
        hardSolved: fallbackData.hardSolved || 0,
        ranking: 0 // Not available in fallback
      };
    }

    const data = await res.json();
    clearTimeout(timeoutId);

    if (data.status !== "success") {
       throw new Error(data.message || "Invalid LeetCode username");
    }

    return {
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      ranking: data.ranking
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("LeetCode API Error:", error);
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
