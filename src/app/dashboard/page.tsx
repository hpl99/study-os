import {
  Flame,
  Map,
  Activity,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { getUserProfile } from "@/features/profile/actions";

import {
  ProfileStats,
  ProfileStatsSkeleton,
} from "@/features/profile/components/profile-stats";

import { Suspense } from "react";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Overview
        </h2>

        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your learning
          journey today.
        </p>
      </div>

      {/* REAL ANALYTICS */}
      <Suspense fallback={<ProfileStatsSkeleton />}>
        <ProfileStats profile={profile} />
      </Suspense>

      {/* SECONDARY WIDGETS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Streak Widget */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Consistency
            </CardTitle>

            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              Coming Soon
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Daily streak tracking will appear here once
              activity sync is enabled.
            </p>
          </CardContent>
        </Card>

        {/* Contest Widget */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Contest Tracking
            </CardTitle>

            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              Stay Ready
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Upcoming contests and reminders will appear
              here.
            </p>
          </CardContent>
        </Card>

        {/* Roadmap Widget */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Roadmap Progress
            </CardTitle>

            <Map className="h-4 w-4 text-blue-400" />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-bold">
              No Progress Yet
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Start a roadmap to track your learning
              journey.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Roadmaps */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Activity Heatmap */}
        <Card className="lg:col-span-4 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              Activity Map
            </CardTitle>

            <CardDescription>
              Your coding activity visualization will
              appear here once integrations are connected.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex h-[160px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20">
              <div className="text-center">
                <p className="text-sm font-medium">
                  No Activity Data
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  Connect GitHub, LeetCode, or Codeforces
                  to enable activity tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Progress */}
        <Card className="lg:col-span-3 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-400" />

              Learning Roadmaps
            </CardTitle>

            <CardDescription>
              Your enrolled roadmap progress will appear
              here.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Placeholder 1 */}
            <div className="space-y-2 opacity-60">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  Data Structures & Algorithms
                </span>

                <span className="text-sm text-muted-foreground">
                  --
                </span>
              </div>

              <Progress value={0} className="h-2" />
            </div>

            {/* Placeholder 2 */}
            <div className="space-y-2 opacity-60">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  System Design
                </span>

                <span className="text-sm text-muted-foreground">
                  --
                </span>
              </div>

              <Progress value={0} className="h-2" />
            </div>

            {/* CTA */}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Start tracking roadmap progress by enrolling
                in a roadmap.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}