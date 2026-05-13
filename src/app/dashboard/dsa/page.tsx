import { getProblems } from "@/features/dsa/actions";
import { AddProblemModal } from "@/features/dsa/components/add-problem-modal";
import { ProblemsTable } from "@/features/dsa/components/problems-table";
import { AnalyticsDashboard } from "@/features/dsa/components/analytics-dashboard";
import { AITopicAnalyzer } from "@/features/dsa/components/ai-topic-analyzer";
import { Terminal } from "lucide-react";
import { Suspense } from "react";

async function DSAContent() {
  const { data: problems, error } = await getProblems();

  if (error) {
    return (
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg text-sm">
        <p className="font-medium mb-1">Unable to load your DSA tracker</p>
        <p className="opacity-80">We couldn't fetch your problem history right now. Please verify your database setup and refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      <AITopicAnalyzer problems={problems || []} />
      <AnalyticsDashboard data={problems || []} />
      <ProblemsTable data={problems || []} />
    </>
  );
}

export default function DSAPage() {
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

      <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-xl border border-white/10" />}>
        <DSAContent />
      </Suspense>
    </div>
  );
}
