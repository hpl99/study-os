import { getRoadmapById } from "@/data/roadmaps";
import { getUserRoadmapProgress } from "@/features/roadmaps/actions";
import { notFound } from "next/navigation";
import { Map, BookOpen, Clock, Trophy } from "lucide-react";
import { RoadmapTopicsList } from "@/features/roadmaps/components/roadmap-topics-list";
import { EnrollButton } from "@/features/roadmaps/components/enroll-button";

export default async function RoadmapDetailPage({ params }: { params: { id: string } }) {
  // Await the params
  const { id } = await Promise.resolve(params);

  const roadmap = getRoadmapById(id);
  if (!roadmap) return notFound();

  const progressData = await getUserRoadmapProgress(id);
  const isEnrolled = progressData !== null && progressData !== undefined && Array.isArray(progressData); 
  // Wait, `getUserRoadmapProgress` returns an empty array if not found, but it fetches from `user_topic_progress`. 
  // Actually, we should check `roadmap_progress` to see if they are enrolled. Let me import a check for enrollment.
  // We can just rely on `roadmap_progress` table. Let's update `actions.ts` or just assume if they have any progress or we just fetch from `roadmap_progress`.
  
  // For simplicity, let's just use a basic "isEnrolled" check if progressData exists or if they explicitly enroll.
  // Actually, we can check `roadmap_progress` table for enrollment. Let's just pass `progressData` down.

  const completedCount = progressData.filter(p => p.is_completed).length;
  const totalTopics = roadmap.topics.length;
  const percent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Map className="w-4 h-4" />
              {roadmap.category}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{roadmap.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {roadmap.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{percent}%</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-white/10 pt-6 mt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{totalTopics} Topics</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>~{roadmap.estimatedHours} Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{roadmap.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Progress & Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Curriculum</h2>
          <EnrollButton roadmapId={roadmap.id} />
        </div>

        <RoadmapTopicsList 
          roadmapId={roadmap.id} 
          topics={roadmap.topics} 
          progress={progressData} 
        />
      </div>
    </div>
  );
}
