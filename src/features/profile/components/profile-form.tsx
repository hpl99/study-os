"use client";

import { useState } from "react";
import { GitBranch, Code2, Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "../actions";
import { toast } from "sonner";

export function ProfileForm({ initialData }: { initialData: { github_handle?: string, leetcode_handle?: string, codeforces_handle?: string } | null }) {
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateUserProfile(formData);
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profiles linked successfully!");
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="github_handle" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> GitHub Username
          </Label>
          <Input 
            id="github_handle" 
            name="github_handle" 
            defaultValue={initialData?.github_handle || ""} 
            placeholder="torvalds" 
            className="bg-white/5 border-white/10" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leetcode_handle" className="flex items-center gap-2 text-yellow-500">
            <Code2 className="w-4 h-4" /> LeetCode Handle
          </Label>
          <Input 
            id="leetcode_handle" 
            name="leetcode_handle" 
            defaultValue={initialData?.leetcode_handle || ""} 
            placeholder="tourist" 
            className="bg-white/5 border-white/10" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codeforces_handle" className="flex items-center gap-2 text-blue-500">
            <Terminal className="w-4 h-4" /> Codeforces Handle
          </Label>
          <Input 
            id="codeforces_handle" 
            name="codeforces_handle" 
            defaultValue={initialData?.codeforces_handle || ""} 
            placeholder="tourist" 
            className="bg-white/5 border-white/10" 
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Profiles
        </Button>
      </div>
    </form>
  );
}
