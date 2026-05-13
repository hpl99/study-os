"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for dashboard routes.
 * Catches errors in protected dashboard pages.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Dashboard error:", error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Dashboard Error</h1>
        <p className="text-muted-foreground max-w-md">
          We encountered an error loading this page. Please try refreshing or go back to the dashboard.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="text-left text-sm">
            <summary className="cursor-pointer text-red-500 font-semibold">
              Error Details
            </summary>
            <pre className="mt-2 bg-black/50 p-3 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
