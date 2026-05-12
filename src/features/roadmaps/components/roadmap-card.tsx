import Link from "next/link";
import { Clock, BookOpen, Terminal, Trophy, Server, Globe, Database } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Roadmap } from "@/types/roadmap";
import { cn } from "@/lib/utils";

const Icons = {
  Terminal,
  Trophy,
  Server,
  Globe,
  Database
} as Record<string, React.ElementType>;

interface RoadmapCardProps {
  roadmap: Roadmap;
  completedTopics: number;
}

export function RoadmapCard({ roadmap, completedTopics }: RoadmapCardProps) {
  const Icon = Icons[roadmap.icon] || BookOpen;
  const totalTopics = roadmap.topics.length;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <Link href={`/dashboard/roadmaps/${roadmap.id}`}>
      <Card className="group h-full bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5" />
            </div>
            <div className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              roadmap.difficulty === "Beginner" && "bg-emerald-500/10 text-emerald-500",
              roadmap.difficulty === "Intermediate" && "bg-yellow-500/10 text-yellow-500",
              roadmap.difficulty === "Advanced" && "bg-orange-500/10 text-orange-500",
              roadmap.difficulty === "Expert" && "bg-red-500/10 text-red-500",
            )}>
              {roadmap.difficulty}
            </div>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{roadmap.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">
            {roadmap.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{totalTopics} Topics</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>~{roadmap.estimatedHours}h</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
