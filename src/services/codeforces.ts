export async function fetchCodeforcesStats(handle: string) {
  if (!handle) return null;
  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch Codeforces");
    const data = await res.json();
    if (data.status !== "OK") return null;
    const user = data.result[0];
    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "Unrated",
      avatar: user.avatar
    };
  } catch (error) {
    console.error("Codeforces API Error:", error);
    return null;
  }
}
