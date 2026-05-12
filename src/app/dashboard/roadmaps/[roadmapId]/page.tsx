import { notFound } from "next/navigation";
import { getRoadmap } from "@/data/roadmaps";
import { getUserRoadmapProgress } from "@/features/roadmaps/actions";
import { TimelineNode } from "@/features/roadmaps/components/timeline-node";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default async function RoadmapDetailPage(
  props: {
    params: Promise<{ roadmapId: string }>;
  }
) {
  const params = await props.params;
  const roadmap = getRoadmap(params.roadmapId);

  if (!roadmap) {
    notFound();
  }

  const progressRecords = await getUserRoadmapProgress(roadmap.id);
  const completedTopicIds = new Set(
    progressRecords.filter((p) => p.is_completed).map((p) => p.topic_id)
  );

  const totalTopics = roadmap.topics.length;
  const completedCount = completedTopicIds.size;
  const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/roadmaps" />} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{roadmap.title}</h1>
          <p className="text-muted-foreground mt-1">{roadmap.description}</p>
        </div>
      </div>

      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex-1 w-full space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Overall Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="flex gap-8 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl">{completedCount}/{totalTopics}</div>
            <div className="text-muted-foreground">Topics</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl">~{roadmap.estimatedHours}h</div>
            <div className="text-muted-foreground">Duration</div>
          </div>
        </div>
      </div>

      <div className="mt-12 pl-4 md:pl-8">
        {roadmap.topics.map((topic, index) => {
          const isCompleted = completedTopicIds.has(topic.id);
          
          // A topic is locked if it has prerequisites and not ALL of them are completed
          const isLocked = topic.prerequisites.length > 0 && 
            !topic.prerequisites.every(id => completedTopicIds.has(id));

          return (
            <TimelineNode
              key={topic.id}
              roadmapId={roadmap.id}
              topic={topic}
              isCompleted={isCompleted}
              isLocked={isLocked}
              isLast={index === roadmap.topics.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
