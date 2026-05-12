import { fetchContests } from "@/services/contests";
import { ContestList } from "@/features/contests/components/contest-list";
import { Trophy } from "lucide-react";

export const revalidate = 3600; // Cache for 1 hour

export default async function ContestsPage() {
  const contests = await fetchContests();

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

      <ContestList initialContests={contests} />
    </div>
  );
}
