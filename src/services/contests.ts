export interface Contest {
  id: string;
  name: string;
  platform: "Codeforces" | "LeetCode" | "CodeChef" | "AtCoder";
  startTimeSeconds: number;
  durationSeconds: number;
  url: string;
}

export async function fetchContests(): Promise<Contest[]> {
  const contests: Contest[] = [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const cfRes = await fetch("https://codeforces.com/api/contest.list", { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    if (cfRes.ok) {
      const cfData = await cfRes.json();
      clearTimeout(timeoutId);
      if (cfData.status === "OK") {
        const upcoming = cfData.result.filter((c: { phase: string }) => c.phase === "BEFORE");
        upcoming.forEach((c: { id: number; name: string; startTimeSeconds: number; durationSeconds: number }) => {
          contests.push({
            id: `cf-${c.id}`,
            name: c.name,
            platform: "Codeforces",
            startTimeSeconds: c.startTimeSeconds,
            durationSeconds: c.durationSeconds,
            url: `https://codeforces.com/contests/${c.id}`
          });
        });
      }
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Failed to fetch Codeforces contests:", error);
  }

  // Fallback mocks
  const now = Math.floor(Date.now() / 1000);
  contests.push({
    id: "lc-1",
    name: "Weekly Contest 400",
    platform: "LeetCode",
    startTimeSeconds: now + 86400 * 2, // 2 days from now
    durationSeconds: 5400, // 1.5 hours
    url: "https://leetcode.com/contest/"
  });
  
  contests.push({
    id: "at-1",
    name: "AtCoder Beginner Contest 350",
    platform: "AtCoder",
    startTimeSeconds: now + 86400 * 4,
    durationSeconds: 7200,
    url: "https://atcoder.jp/"
  });

  return contests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
}
