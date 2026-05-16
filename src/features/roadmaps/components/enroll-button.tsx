"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { enrollRoadmap } from "../actions";
import { toast } from "sonner";

export function EnrollButton({ roadmapId }: { roadmapId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await enrollRoadmap(roadmapId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Enrolled successfully!");
      }
    });
  };

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={isPending}
      className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
      Enroll Now
    </Button>
  );
}
