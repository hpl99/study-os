import { getAllRoadmaps } from "@/data/roadmaps";
import { RoadmapCard } from "@/features/roadmaps/components/roadmap-card";
import { getUserRoadmapProgress } from "@/features/roadmaps/actions";
import { Suspense } from "react";

/**
 * Helper component to render roadmap cards with progress.
 * Separated from main component to properly handle async operations.
 */
async function RoadmapsGrid() {
  const roadmaps = getAllRoadmaps();
  
  // Fetch progress for all roadmaps in parallel
  const roadmapsWithProgress = await Promise.all(
    roadmaps.map(async (roadmap) => ({
      roadmap,
      progress: await getUserRoadmapProgress(roadmap.id),
    }))
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {roadmapsWithProgress.map(({ roadmap, progress }) => {
        const completedCount = progress.filter((p) => p.is_completed).length;
        return (
          <RoadmapCard 
            key={roadmap.id} 
            roadmap={roadmap} 
            completedTopics={completedCount} 
          />
        );
      })}
    </div>
  );
}

/**
 * Roadmaps Page - shows all available learning roadmaps
 */
export default async function RoadmapsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Roadmaps</h1>
        <p className="text-muted-foreground">
          Structured learning paths to master computer science and software engineering.
        </p>
      </div>

      <Suspense fallback={<RoadmapsSkeleton />}>
        <RoadmapsGrid />
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton for roadmaps grid
 */
function RoadmapsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-xl bg-white/5 border border-white/10 animate-pulse"
        />
      ))}
    </div>
  );
}
