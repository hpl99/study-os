import { notFound } from "next/navigation";
import { getRoadmap } from "@/data/roadmaps";
import { getUserRoadmapProgress } from "@/features/roadmaps/actions";
import { ProgressToggle } from "@/features/roadmaps/components/progress-toggle";
import { ResourceCard } from "@/features/roadmaps/components/resource-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function TopicDetailPage(
  props: {
    params: Promise<{ roadmapId: string; topicId: string }>;
  }
) {
  const params = await props.params;
  const roadmap = getRoadmap(params.roadmapId);

  if (!roadmap) {
    notFound();
  }

  const topic = roadmap.topics.find((t) => t.id === params.topicId);

  if (!topic) {
    notFound();
  }

  const progressRecords = await getUserRoadmapProgress(roadmap.id);
  const isCompleted = progressRecords.some((p) => p.topic_id === topic.id && p.is_completed);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" render={<Link href={`/dashboard/roadmaps/${roadmap.id}`} />} className="shrink-0 mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
            <p className="text-muted-foreground mt-2 text-lg leading-relaxed">{topic.description}</p>
          </div>
        </div>
        <div className="shrink-0">
          <ProgressToggle 
            roadmapId={roadmap.id} 
            topicId={topic.id} 
            initialCompleted={isCompleted} 
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Curated Resources
            </h2>
            {topic.resources.length > 0 ? (
              <div className="flex flex-col gap-3">
                {topic.resources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">No specific resources curated yet.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Practice Problems
            </h2>
            {topic.problems.length > 0 ? (
              <div className="grid gap-3">
                {topic.problems.map(problem => (
                  <a 
                    key={problem.id}
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{problem.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{problem.platform}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" :
                        problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {problem.difficulty}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">No practice problems added yet.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Notes & Revision
              </CardTitle>
              <CardDescription>Jot down key concepts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-sm text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer">
                + Add Note (Coming soon)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
