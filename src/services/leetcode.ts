export async function fetchLeetCodeStats(username: string) {
  if (!username) return null;
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch LeetCode");
    const data = await res.json();
    if (data.status !== "success") return null;
    return {
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      ranking: data.ranking
    };
  } catch (error) {
    console.error("LeetCode API Error:", error);
    return null;
  }
}
