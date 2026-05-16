"use client";

import { Topic, UserTopicProgress } from "@/types/roadmap";
import { CheckCircle2, Circle, Book, PlayCircle, Code, FileText } from "lucide-react";
import { toggleTopicProgress } from "../actions";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface Props {
  roadmapId: string;
  topics: Topic[];
  progress: UserTopicProgress[];
}

export function RoadmapTopicsList({ roadmapId, topics, progress }: Props) {
  const [isPending, startTransition] = useTransition();

  if (topics.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl text-muted-foreground">
        Curriculum for this roadmap is being prepared. Check back later!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => {
        const isCompleted = progress.find(p => p.topic_id === topic.id)?.is_completed || false;

        const handleToggle = () => {
          startTransition(() => {
            toggleTopicProgress(roadmapId, topic.id, !isCompleted);
          });
        };

        return (
          <div 
            key={topic.id} 
            className={cn(
              "p-5 rounded-xl border transition-all duration-300",
              isCompleted ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            <div className="flex gap-4">
              <button 
                onClick={handleToggle}
                disabled={isPending}
                className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className={cn(
                    "text-lg font-medium",
                    isCompleted && "text-muted-foreground line-through decoration-primary/50"
                  )}>
                    {index + 1}. {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                </div>

                {topic.resources && topic.resources.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Resources</h4>
                    <ul className="space-y-2">
                      {topic.resources.map((res, i) => (
                        <li key={i}>
                          <a 
                            href={res.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            {res.type === "video" || res.type === "playlist" ? <PlayCircle className="w-4 h-4" /> :
                             res.type === "practice" ? <Code className="w-4 h-4" /> :
                             res.type === "article" || res.type === "official-docs" ? <FileText className="w-4 h-4" /> :
                             <Book className="w-4 h-4" />}
                            {res.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
