import { getAllRoadmaps } from "@/data/roadmaps";
import { RoadmapCard } from "@/features/roadmaps/components/roadmap-card";
import { getUserRoadmapProgress } from "@/features/roadmaps/actions";

export default async function RoadmapsPage() {
  const roadmaps = getAllRoadmaps();
  
  // In a real app we'd fetch progress for all roadmaps efficiently,
  // but for the demo we'll just map it directly.
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Roadmaps</h1>
        <p className="text-muted-foreground">
          Structured learning paths to master computer science and software engineering.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map(async (roadmap) => {
          // Fetch progress for this specific roadmap
          const progress = await getUserRoadmapProgress(roadmap.id);
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
    </div>
  );
}
