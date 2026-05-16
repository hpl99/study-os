export interface Contest {
  id: string;
  name: string;
  platform: "Codeforces" | "LeetCode" | "CodeChef" | "AtCoder" | "Other";
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

  // Future API integrations for LeetCode and AtCoder can be added here
  // We strictly avoid injecting fake/mock data to preserve system integrity.

  return contests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
}
