"use client";

import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { logout } from "@/features/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-black/40 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r-white/10 bg-background">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 items-center" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
            placeholder="Search (Press ⌘K to open command palette)"
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-white/5" />}>
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={() => {
                  const form = document.createElement('form');
                  form.action = '/api/auth/logout'; // To avoid using client actions directly, we'll create a dedicated logout route or call action
                  // Actually since this is a client component, we can use transition
                }}
              >
                <form action={logout} className="w-full">
                  <button type="submit" className="w-full text-left">Sign out</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
