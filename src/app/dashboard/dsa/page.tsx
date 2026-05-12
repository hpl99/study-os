import { getProblems } from "@/features/dsa/actions";
import { AddProblemModal } from "@/features/dsa/components/add-problem-modal";
import { ProblemsTable } from "@/features/dsa/components/problems-table";
import { AnalyticsDashboard } from "@/features/dsa/components/analytics-dashboard";
import { Terminal } from "lucide-react";

export default async function DSAPage() {
  const { data: problems, error } = await getProblems();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="w-8 h-8 text-primary" />
            DSA Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your solved problems, review patterns, and prepare for interviews.
          </p>
        </div>
        <AddProblemModal />
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
          Failed to load problems: {error}
        </div>
      ) : (
        <>
          <AnalyticsDashboard data={problems || []} />
          <ProblemsTable data={problems || []} />
        </>
      )}
    </div>
  );
}
