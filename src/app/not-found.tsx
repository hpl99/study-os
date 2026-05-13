import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Global 404 Not Found page.
 * Shown when user navigates to a route that doesn't exist.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-3">
          <div className="text-6xl font-bold tracking-tight text-primary">
            404
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center pt-4">
          <Link href="/dashboard" className="inline-flex">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/" className="inline-flex">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
