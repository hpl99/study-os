export async function fetchCodeforcesStats(handle: string) {
  if (!handle) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    if (!res.ok) throw new Error(`Codeforces API returned status ${res.status}`);
    
    const data = await res.json();
    clearTimeout(timeoutId);

    if (data.status !== "OK") {
      throw new Error(data.comment || "Invalid Codeforces handle");
    }

    const user = data.result[0];
    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "Unrated",
      avatar: user.avatar
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Codeforces API Error:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Failed to load Codeforces stats",
      rating: 0,
      maxRating: 0,
      rank: "Error",
      avatar: ""
    };
  }
}
