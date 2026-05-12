import { Flame, Target, Trophy, Map, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserProfile } from "@/features/profile/actions";
import { ProfileStats } from "@/features/profile/components/profile-stats";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your learning journey today.</p>
      </div>

      <ProfileStats profile={profile} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Streak Widget */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up! Personal best is 34 days.</p>
          </CardContent>
        </Card>

        {/* Problems Solved */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground mt-1">+12 from last week</p>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Rating</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">1452</div>
            <p className="text-xs text-muted-foreground mt-1">Codeforces Specialist</p>
          </CardContent>
        </Card>

        {/* Next Contest */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Contest</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Div. 2 Round</div>
            <p className="text-xs text-muted-foreground mt-1">Starts in 3 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Activity Heatmap Placeholder */}
        <Card className="lg:col-span-4 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Activity Map</CardTitle>
            <CardDescription>Your coding activity over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 h-[140px] w-full flex-wrap opacity-60">
              {/* Generate random mock heatmap squares */}
              {Array.from({ length: 140 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-sm bg-primary" 
                  style={{ opacity: Math.max(0.1, (i * 13 % 100) / 100) }} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Progress Widget */}
        <Card className="lg:col-span-3 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-400" /> Roadmap Progress
            </CardTitle>
            <CardDescription>You are currently enrolled in 2 roadmaps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Data Structures & Algorithms</span>
                <span className="text-sm text-muted-foreground">64%</span>
              </div>
              <Progress value={64} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">System Design</span>
                <span className="text-sm text-muted-foreground">22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
