import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
