export async function fetchGitHubStats(username: string) {
  if (!username) return null;
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch GitHub");
    const data = await res.json();
    return {
      followers: data.followers,
      publicRepos: data.public_repos,
      avatar: data.avatar_url,
      profileUrl: data.html_url
    };
  } catch (error) {
    console.error("GitHub API Error:", error);
    return null;
  }
}
