"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleTopicProgress } from "@/features/roadmaps/actions";
import { cn } from "@/lib/utils";

interface ProgressToggleProps {
  roadmapId: string;
  topicId: string;
  initialCompleted: boolean;
}

export function ProgressToggle({ roadmapId, topicId, initialCompleted }: ProgressToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTopicProgress(roadmapId, topicId, !initialCompleted);
    });
  };

  return (
    <Button 
      onClick={handleToggle}
      disabled={isPending}
      variant="outline"
      className={cn(
        "gap-2 transition-all duration-300",
        initialCompleted 
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/20 hover:text-emerald-500" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : initialCompleted ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <Circle className="w-5 h-5" />
      )}
      {initialCompleted ? "Marked as Completed" : "Mark as Completed"}
    </Button>
  );
}
