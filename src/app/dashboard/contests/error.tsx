"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContestsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Contests page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full bg-red-500/10 border-red-500/20 backdrop-blur-xl">
        <CardContent className="flex flex-col items-center text-center pt-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Failed to Load Contests</h2>
            <p className="text-sm text-red-200/70">
              We encountered an error while fetching contest data from external providers. Please try again.
            </p>
          </div>
          <Button 
            onClick={() => reset()}
            variant="outline" 
            className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 mt-2 text-white"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
