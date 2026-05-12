import Link from "next/link";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Topic } from "@/types/roadmap";
import { cn } from "@/lib/utils";

interface TimelineNodeProps {
  roadmapId: string;
  topic: Topic;
  isCompleted: boolean;
  isLocked: boolean;
  isLast: boolean;
}

export function TimelineNode({ roadmapId, topic, isCompleted, isLocked, isLast }: TimelineNodeProps) {
  const statusColor = isCompleted 
    ? "text-emerald-500 border-emerald-500" 
    : isLocked 
      ? "text-muted-foreground border-muted-foreground/30" 
      : "text-primary border-primary";

  const StatusIcon = isCompleted ? CheckCircle2 : isLocked ? Lock : PlayCircle;

  return (
    <div className="relative flex gap-6 pb-12 group">
      {!isLast && (
        <div 
          className={cn(
            "absolute left-6 top-10 bottom-0 w-px -translate-x-1/2",
            isCompleted ? "bg-emerald-500" : "bg-white/10"
          )} 
        />
      )}
      
      <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background shrink-0 shadow-sm transition-colors duration-300"
           style={{ borderColor: "currentColor", color: isCompleted ? "#10b981" : isLocked ? "#52525b" : "#a855f7" }}>
        <StatusIcon className="w-5 h-5" />
      </div>

      <div className={cn(
        "flex-1 pt-2 transition-opacity duration-300",
        isLocked && "opacity-60"
      )}>
        {isLocked ? (
          <div className="block p-6 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-xl font-bold">{topic.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
            <div className="mt-4 text-xs font-medium text-muted-foreground bg-black/20 inline-flex px-2 py-1 rounded-md">
              Complete prerequisites to unlock
            </div>
          </div>
        ) : (
          <Link href={`/dashboard/roadmaps/${roadmapId}/${topic.id}`}>
            <div className={cn(
              "block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 shadow-lg",
              isCompleted && "bg-emerald-500/5 border-emerald-500/20"
            )}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{topic.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p>
                </div>
                {isCompleted && (
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Completed
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-4 text-xs font-medium text-muted-foreground">
                <span>{topic.resources.length} Resources</span>
                <span>{topic.problems.length} Problems</span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
