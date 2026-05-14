"use client";

import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNavbar({
  user,
  profile,
}: {
  user: any;
  profile: any;
}) {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials =
    profile?.github_handle
      ?.substring(0, 2)
      .toUpperCase() ||
    user?.email
      ?.substring(0, 2)
      .toUpperCase() ||
    "US";

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-black/40 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger>
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 transition"
          >
            <Menu className="h-6 w-6" />

            <span className="sr-only">
              Open sidebar
            </span>
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="p-0 w-64 border-r-white/10 bg-background"
        >
          <Sidebar
            user={user}
            profile={profile}
          />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form
          className="relative flex flex-1 items-center"
          action="#"
          method="GET"
        >
          <label
            htmlFor="search-field"
            className="sr-only"
          >
            Search
          </label>

          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />

          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white placeholder:text-muted-foreground focus:ring-0 focus:outline-none sm:text-sm"
            placeholder="Search (Press ⌘K to open command palette)"
            type="search"
            name="search"
          />
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10"
            aria-hidden="true"
          />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-white/5 transition">
                <span className="sr-only">
                  Open user menu
                </span>

                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {initials}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-black/90 backdrop-blur-xl border-white/10"
            >
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                className="focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() =>
                  router.push("/dashboard/profile")
                }
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() =>
                  router.push("/dashboard/settings")
                }
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                className="text-destructive focus:bg-red-500/10 cursor-pointer"
                onClick={handleLogout}
                disabled={isSigningOut}
              >
                {isSigningOut
                  ? "Signing out..."
                  : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}