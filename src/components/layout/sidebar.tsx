"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AIChatModal } from "./ai-chat-modal";
import { 
  Zap, 
  LayoutDashboard, 
  Map, 
  Terminal, 
  Flame, 
  BookOpen, 
  Settings,
  Bell,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Roadmaps", href: "/dashboard/roadmaps", icon: Map },
  { name: "DSA Tracker", href: "/dashboard/dsa", icon: Terminal },
  { name: "Notes & Revision", href: "/dashboard/notes", icon: BookOpen },
  { name: "Contests", href: "/dashboard/contests", icon: Flame },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 z-50 bg-black/40 border-r border-white/10 backdrop-blur-xl">
      <Link href="/" className="flex h-16 shrink-0 items-center gap-2 px-6 border-b border-white/10 hover:bg-white/5 transition-colors">
        <Zap className="w-6 h-6 text-primary" fill="currentColor" />
        <span className="font-bold text-lg tracking-tight">StudyOS</span>
      </Link>
      
      <nav className="flex flex-1 flex-col p-4 gap-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          Menu
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                )}
              />
              {item.name}
            </Link>
          );
        })}

        <div className="mt-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          General
        </div>
        <Link
          href="/dashboard/notifications"
          className="group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
        >
          <Bell className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-white" />
          Notifications
        </Link>
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="group flex w-full gap-x-3 rounded-lg p-2.5 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors text-left"
        >
          <Bot className="h-5 w-5 shrink-0" />
          AI Coach
        </button>
        <Link
          href="/dashboard/settings"
          className="group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-white" />
          Settings
        </Link>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">US</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">Developer</p>
          </div>
        </div>
      </div>
      </div>
      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
}
