"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Code2, 
  Terminal, 
  Trophy, 
  Zap,
  BookOpen,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export function LandingPageClient({ user }: { user: User | null }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Zap className="w-6 h-6 text-primary" fill="currentColor" />
            <span>StudyOS</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className={buttonVariants({ variant: "default", size: "default", className: "rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" })}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </Link>
                <Link href="/signup" className={buttonVariants({ variant: "default", size: "default", className: "rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" })}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section 
          className="text-center flex flex-col items-center justify-center pt-20 pb-32 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            StudyOS v1.0 is now live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
            The Operating System for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Ambitious Developers
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            One platform to track your DSA progress, follow structured roadmaps, maintain streaks, and connect your entire coding identity.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            {user ? (
              <Link href="/dashboard" className={buttonVariants({ variant: "default", size: "lg", className: "rounded-full h-12 px-8 text-base shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]" })}>
                Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link href="/signup" className={buttonVariants({ variant: "default", size: "lg", className: "rounded-full h-12 px-8 text-base shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]" })}>
                  Start Building Your Profile <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full h-12 px-8 text-base bg-white/5 border-white/10 hover:bg-white/10" })}>
                  <svg viewBox="0 0 24 24" className="mr-2 w-4 h-4" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  Continue with GitHub
                </Link>
              </>
            )}
          </motion.div>
        </motion.section>

        {/* Animated Stats / Features Preview */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-white/5 to-transparent border-white/10 backdrop-blur-sm hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Roadmaps</h3>
              <p className="text-muted-foreground">Follow curated learning paths for DSA, System Design, and Full Stack Development.</p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-white/5 to-transparent border-white/10 backdrop-blur-sm hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">DSA Tracker</h3>
              <p className="text-muted-foreground">Track problems across LeetCode and Codeforces. Keep notes and revision schedules.</p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-white/5 to-transparent border-white/10 backdrop-blur-sm hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Streaks</h3>
              <p className="text-muted-foreground">Visualize your progress, maintain daily streaks, and achieve your coding goals.</p>
            </Card>
          </motion.div>
        </motion.section>

        {/* Dashboard Preview Section */}
        <motion.section 
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl aspect-video flex items-center justify-center mb-32 group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="absolute w-full h-full p-8 grid grid-cols-4 grid-rows-3 gap-4 opacity-50 group-hover:opacity-80 transition-opacity duration-500">
            {/* Mock Dashboard UI elements */}
            <div className="col-span-1 row-span-3 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
              <div className="h-8 w-full bg-white/10 rounded-md" />
              <div className="h-4 w-3/4 bg-white/5 rounded-md" />
              <div className="h-4 w-1/2 bg-white/5 rounded-md" />
              <div className="h-4 w-2/3 bg-white/5 rounded-md mt-auto" />
            </div>
            <div className="col-span-2 row-span-2 rounded-xl border border-white/10 bg-white/5 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              <div className="h-full w-full flex items-end gap-2">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="col-span-1 row-span-1 rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-center">
               <Trophy className="w-8 h-8 text-yellow-500/50" />
            </div>
            <div className="col-span-1 row-span-1 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2 justify-center">
              <div className="h-3 w-full bg-white/10 rounded-full" />
              <div className="h-3 w-4/5 bg-white/10 rounded-full" />
            </div>
            <div className="col-span-3 row-span-1 rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="h-4 w-1/4 bg-white/10 rounded-md mb-2" />
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary/50" />
                </div>
              </div>
            </div>
          </div>
          <div className="z-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Your Dev Hub</h2>
            <p className="text-muted-foreground">Everything you need in one beautiful interface.</p>
          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">StudyOS</span>
          </div>
          <p>© {new Date().getFullYear()} StudyOS. Built for developers.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
