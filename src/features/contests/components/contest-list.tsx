"use client";

import { useState, useEffect } from "react";
import { Contest } from "@/services/contests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ExternalLink, Trophy } from "lucide-react";
import { format } from "date-fns";

const PLATFORM_COLORS: Record<string, string> = {
  LeetCode: "text-yellow-500 bg-yellow-500/10",
  Codeforces: "text-blue-500 bg-blue-500/10",
  CodeChef: "text-purple-500 bg-purple-500/10",
  AtCoder: "text-emerald-500 bg-emerald-500/10",
  Other: "text-gray-400 bg-gray-500/10"
};

function CountdownTimer({ targetSeconds }: { targetSeconds: number }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetSeconds - Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetSeconds]);

  if (timeLeft <= 0) return <span className="text-red-500 font-bold animate-pulse">Running!</span>;

  const d = Math.floor(timeLeft / 86400);
  const h = Math.floor((timeLeft % 86400) / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <span className="font-mono font-medium">
      {d > 0 && `${d}d `}{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </span>
  );
}

export function ContestList({ initialContests }: { initialContests: Contest[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" 
    ? initialContests 
    : initialContests.filter(c => c.platform === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 pb-4 overflow-x-auto">
        {["All", "Codeforces", "LeetCode", "AtCoder"].map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === p ? "bg-primary text-primary-foreground" : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(contest => (
          <Card key={contest.id} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${PLATFORM_COLORS[contest.platform] || PLATFORM_COLORS.Other}`}>
                  {contest.platform}
                </span>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <CardTitle className="text-lg mt-2 line-clamp-1 group-hover:text-primary transition-colors">{contest.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(contest.startTimeSeconds * 1000), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(contest.durationSeconds / 60)} mins</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold">Starts In</span>
                  <div className="text-foreground">
                    <CountdownTimer targetSeconds={contest.startTimeSeconds} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/5 border border-white/10 border-dashed rounded-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Contests Found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {filter === "All" 
              ? "There are no upcoming contests scheduled right now." 
              : `There are currently no upcoming contests scheduled for ${filter}.`}
          </p>
        </div>
      )}
    </div>
  );
}
