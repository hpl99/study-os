"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProblem } from "../actions";
import { toast } from "sonner";

export function AddProblemModal() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isPendingTrans, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    startTransition(async () => {
      const result = await addProblem(formData);
      setIsPending(false);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Problem added successfully!");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]" />}>
        <Plus className="w-4 h-4" /> Add Problem
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black/95 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Track New Problem</DialogTitle>
          <DialogDescription>
            Add a newly solved DSA problem to your tracker.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Two Sum" className="bg-white/5 border-white/10" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Problem URL</Label>
            <Input id="url" name="url" type="url" required placeholder="https://leetcode.com/..." className="bg-white/5 border-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select name="platform" defaultValue="LeetCode">
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10">
                  <SelectItem value="LeetCode">LeetCode</SelectItem>
                  <SelectItem value="Codeforces">Codeforces</SelectItem>
                  <SelectItem value="CodeChef">CodeChef</SelectItem>
                  <SelectItem value="AtCoder">AtCoder</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select name="difficulty" defaultValue="Easy">
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10">
                  <SelectItem value="Easy" className="text-emerald-500">Easy</SelectItem>
                  <SelectItem value="Medium" className="text-yellow-500">Medium</SelectItem>
                  <SelectItem value="Hard" className="text-red-500">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic_tags">Topic Tags (comma separated)</Label>
            <Input id="topic_tags" name="topic_tags" placeholder="Arrays, Hash Table" className="bg-white/5 border-white/10" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time_taken_mins">Time Taken (minutes)</Label>
            <Input id="time_taken_mins" name="time_taken_mins" type="number" placeholder="25" className="bg-white/5 border-white/10" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Problem
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
