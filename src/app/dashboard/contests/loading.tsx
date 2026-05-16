import { Trophy } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ContestsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          Contest Tracker
        </h1>
        <p className="text-muted-foreground">
          Track upcoming competitive programming contests across multiple platforms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-3/4 bg-white/10 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                <div className="h-10 w-full bg-white/10 rounded mt-4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
