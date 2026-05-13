"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string)?.trim();

    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Unable to send reset instructions.");
        setMessage(null);
      } else {
        toast.success(result.message || "Reset instructions sent.");
        setMessage(result.message || "Check your email for the password reset link.");
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast.error("Unable to send reset instructions right now.");
      setMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-muted-foreground mt-2">Include the email address associated with your account and we’ll send you instructions to reset your password.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-base shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]">
              {isSubmitting ? "Sending..." : "Send reset instructions"}
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
