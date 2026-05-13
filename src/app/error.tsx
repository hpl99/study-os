"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Global error boundary for the entire application.
 * Handles unexpected runtime errors gracefully.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-lg">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        {/* Development error details */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <summary className="cursor-pointer font-mono text-sm text-red-500 font-semibold hover:text-red-400">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-3 text-xs overflow-auto max-h-48 bg-black/50 p-3 rounded border border-red-500/10">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center pt-4">
          <Button 
            onClick={() => reset()}
            className="gap-2"
          >
            Try again
          </Button>
          <Link href="/dashboard" className="inline-flex">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
