import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Code2, Terminal, Users, BookOpen, Trophy } from "lucide-react";
import { fetchGitHubStats } from "@/services/github";
import { fetchLeetCodeStats } from "@/services/leetcode";
import { fetchCodeforcesStats } from "@/services/codeforces";

export async function ProfileStats({ profile }: { profile: any }) {
  if (!profile) return null;

  const [github, leetcode, codeforces] = await Promise.all([
    profile.github_handle ? fetchGitHubStats(profile.github_handle) : Promise.resolve(null),
    profile.leetcode_handle ? fetchLeetCodeStats(profile.leetcode_handle) : Promise.resolve(null),
    profile.codeforces_handle ? fetchCodeforcesStats(profile.codeforces_handle) : Promise.resolve(null),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {github && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <GitBranch className="w-5 h-5" /> GitHub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mt-2">
              <img src={github.avatar} alt="GitHub" className="w-12 h-12 rounded-full border border-white/10" />
              <div>
                <div className="text-2xl font-bold">{github.followers}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> Followers
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xl font-bold">{github.publicRepos}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <BookOpen className="w-3 h-3" /> Repos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {leetcode && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-yellow-500">
              <Code2 className="w-5 h-5" /> LeetCode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mt-2">
              <div>
                <div className="text-3xl font-bold">{leetcode.totalSolved}</div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
              <div className="text-right text-xs space-y-1">
                <div className="text-emerald-500 font-medium">Easy: {leetcode.easySolved}</div>
                <div className="text-yellow-500 font-medium">Med: {leetcode.mediumSolved}</div>
                <div className="text-red-500 font-medium">Hard: {leetcode.hardSolved}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {codeforces && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-blue-500">
              <Terminal className="w-5 h-5" /> Codeforces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mt-2">
              <img src={codeforces.avatar} alt="Codeforces" className="w-12 h-12 rounded-lg border border-white/10" />
              <div>
                <div className="text-2xl font-bold text-blue-400">{codeforces.rating}</div>
                <div className="text-xs text-muted-foreground capitalize">{codeforces.rank}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xl font-bold text-muted-foreground">{codeforces.maxRating}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Trophy className="w-3 h-3" /> Max
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
