import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Note: actual reset logic needs to be implemented in actions.ts
export default async function ForgotPasswordPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  const message = searchParams.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] -z-10 pointer-events-none" />
        
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight mb-6">
            <Zap className="w-8 h-8 text-primary" fill="currentColor" />
            <span>StudyOS</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Reset password</h2>
          <p className="text-muted-foreground mt-2">Include the email address associated with your account and we’ll send you an email with instructions to reset your password.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <form className="space-y-6" action="/auth/reset-password">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-background/50 border-white/10"
                placeholder="you@example.com"
              />
            </div>

            {message && (
              <div className="p-3 text-sm text-center text-primary bg-primary/10 border border-primary/20 rounded-md">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]">
              Send reset instructions
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground flex justify-center">
          <Link href="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
