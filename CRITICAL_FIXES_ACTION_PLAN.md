# StudyOS - CRITICAL FIXES ACTION PLAN

**Priority Level:** BLOCKING - Must complete before MVP launch  
**Estimated Time:** 8-12 hours  
**Last Updated:** May 12, 2026

---

## ✅ STEP-BY-STEP FIX CHECKLIST

### PHASE 1: DATABASE SETUP (1 hour)

- [ ] Go to Supabase dashboard: https://supabase.com
- [ ] Navigate to SQL editor
- [ ] Copy contents of `SUPABASE_MIGRATIONS.sql`
- [ ] Paste into SQL editor
- [ ] Execute the entire script
- [ ] Verify all tables created:
  - [ ] `user_profiles` table exists
  - [ ] `user_problems` table exists
  - [ ] `user_notes` table exists
  - [ ] `user_topic_progress` table exists
- [ ] Verify RLS policies enabled on all tables

**Verification Query:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'user_%'
ORDER BY table_name;
```

---

### PHASE 2: CREATE MISSING FILES (2-3 hours)

#### FILE 1: Create Middleware at Root

**File Path:** `middleware.ts` (at project root, same level as package.json)  
**Status:** ⚠️ NEW FILE

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**After creating:** Delete or rename `src/proxy.ts` to `src/proxy.ts.bak`

---

#### FILE 2: OAuth Callback Route

**File Path:** `src/app/api/auth/callback/route.ts`  
**Status:** ⚠️ NEW FILE

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Return error page or redirect to login with error message
  return NextResponse.redirect(
    new URL("/login?error=auth_failed", request.url),
  );
}
```

**Test:**

- [ ] Go to `/login` page
- [ ] Click "Continue with Google"
- [ ] Complete Google auth
- [ ] Should redirect to `/dashboard`

---

#### FILE 3: Password Reset Endpoint

**File Path:** `src/app/api/auth/forgot-password/route.ts`  
**Status:** ⚠️ NEW FILE

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Check your email for password reset instructions",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

#### FILE 4: Error Boundary

**File Path:** `src/app/error.tsx`  
**Status:** ⚠️ NEW FILE

```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service here
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left bg-red-500/10 border border-red-500/20 rounded p-4">
            <summary className="cursor-pointer font-mono text-sm text-red-500">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
```

---

#### FILE 5: Not Found Page

**File Path:** `src/app/not-found.tsx`  
**Status:** ⚠️ NEW FILE

```typescript
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
```

---

### PHASE 3: FIX EXISTING FILES (3-4 hours)

#### FIX 1: Roadmaps Page - Async/Promise Bug

**File Path:** `src/app/dashboard/roadmaps/page.tsx`  
**Status:** 🔴 CRITICAL BUG

**Current Code (BROKEN):**

```tsx
{
  roadmaps.map(async (roadmap) => {
    // ❌ This returns Promise<JSX>
    const progress = await getUserRoadmapProgress(roadmap.id);
    const completedCount = progress.filter((p) => p.is_completed).length;

    return (
      <RoadmapCard
        key={roadmap.id}
        roadmap={roadmap}
        completedTopics={completedCount}
      />
    );
  });
}
```

**Fixed Code:**

```tsx
import { getAllRoadmaps } from "@/data/roadmaps";
import { RoadmapCard } from "@/features/roadmaps/components/roadmap-card";
import { getUserRoadmapProgress } from "@/features/roadmaps/actions";

// Separate component to handle async data
async function RoadmapsGrid() {
  const roadmaps = getAllRoadmaps();

  // Fetch progress for all roadmaps in parallel
  const roadmapsWithProgress = await Promise.all(
    roadmaps.map(async (roadmap) => ({
      roadmap,
      progress: await getUserRoadmapProgress(roadmap.id),
    })),
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {roadmapsWithProgress.map(({ roadmap, progress }) => {
        const completedCount = progress.filter((p) => p.is_completed).length;
        return (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            completedTopics={completedCount}
          />
        );
      })}
    </div>
  );
}

export default async function RoadmapsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Roadmaps</h1>
        <p className="text-muted-foreground">
          Structured learning paths to master computer science and software
          engineering.
        </p>
      </div>

      <RoadmapsGrid />
    </div>
  );
}
```

**Test:**

- [ ] Go to `/dashboard/roadmaps`
- [ ] Should see roadmap cards (not blank)
- [ ] Should show progress correctly

---

#### FIX 2: Add Missing Function

**File Path:** `src/features/roadmaps/actions.ts`  
**Status:** ⚠️ MISSING FUNCTION

**Add this function to the file:**

```typescript
export async function getUserRoadmapProgress(roadmapId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Not authenticated when fetching roadmap progress");
    return [];
  }

  const { data, error } = await supabase
    .from("user_topic_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("roadmap_id", roadmapId);

  if (error) {
    console.error("Error fetching roadmap progress:", error);
    return [];
  }

  return data || [];
}
```

---

#### FIX 3: Update Forgot Password Form

**File Path:** `src/app/forgot-password/page.tsx`  
**Status:** ⚠️ NEEDS FORM UPDATE

**Change the form action from:**

```tsx
<form className="space-y-6" action="/auth/reset-password">
```

**To:**

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

// ... in component:

<form
  className="space-y-6"
  onSubmit={async (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to send reset email");
    }
  }}
>
```

---

#### FIX 4: Update DSA Error Message

**File Path:** `src/app/dashboard/dsa/page.tsx`  
**Status:** ⚠️ Poor error messaging

**Current Code:**

```tsx
if (error) {
  return (
    <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg text-sm">
      <p className="font-medium mb-1">Waiting for Database Initialization</p>
      <p className="opacity-80">
        The DSA tracker features will be available once the database migration
        is complete. ({error})
      </p>
    </div>
  );
}
```

**Better Code:**

```tsx
if (error) {
  return (
    <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg text-sm">
      <p className="font-medium mb-1">Unable to Load Problems</p>
      <p className="opacity-80">
        We're having trouble loading your problems. This usually means the
        database tables haven't been created yet.
      </p>
      <p className="text-xs mt-2 opacity-60">
        {process.env.NODE_ENV === "development"
          ? `Technical details: ${error}`
          : ""}
      </p>
    </div>
  );
}
```

---

#### FIX 5: Update Notes Error Message

**File Path:** `src/app/dashboard/notes/page.tsx`  
**Status:** ⚠️ Poor error messaging

Same pattern as DSA page - don't expose raw database errors to users.

---

### PHASE 4: ENVIRONMENT CONFIGURATION (30 mins)

#### Update `.env.local`

Make sure your `.env.local` contains:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Site URL for OAuth callbacks
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Gemini API (for AI features)
GEMINI_API_KEY=your_gemini_api_key
```

**Get Supabase credentials:**

1. Go to https://supabase.com
2. Select your project
3. Settings → API → Copy URL and anon key

**Get Gemini API key (optional):**

1. Go to https://ai.google.dev
2. Create new API key
3. Add to `.env.local`

---

### PHASE 5: TESTING (1-2 hours)

#### Test Auth Flow

- [ ] Go to `/login`
- [ ] Enter email/password and sign in
- [ ] Should redirect to `/dashboard`
- [ ] Click profile → Sign out
- [ ] Should redirect to `/login`

#### Test OAuth (if configured)

- [ ] Go to `/signup`
- [ ] Click "Continue with GitHub"
- [ ] Complete GitHub auth
- [ ] Should create account and redirect to `/dashboard`

#### Test Password Reset

- [ ] Go to `/forgot-password`
- [ ] Enter email
- [ ] Check email for reset link
- [ ] Click link and reset password

#### Test DSA Tracker

- [ ] Go to `/dashboard/dsa`
- [ ] Should show "Analytics Dashboard"
- [ ] Click "Add Problem"
- [ ] Fill form and submit
- [ ] Problem should appear in table

#### Test Notes

- [ ] Go to `/dashboard/notes`
- [ ] Should show notes interface
- [ ] Create new note
- [ ] Save and verify it appears

#### Test Roadmaps

- [ ] Go to `/dashboard/roadmaps`
- [ ] Should see roadmap cards (not blank/Promise)
- [ ] Click a roadmap
- [ ] Should show topics with progress

---

## 🔍 VERIFICATION COMMANDS

Run these in your terminal to verify fixes:

```bash
# Check for TypeScript errors
npm run lint

# Test build
npm run build

# Start dev server
npm run dev

# Then navigate to http://localhost:3000
```

---

## ❌ WHAT TO REMOVE

Delete or deprecate these files:

1. **`src/proxy.ts`** - Replace with proper `middleware.ts`
   - Rename to `src/proxy.ts.bak` first
   - Delete after confirming middleware.ts works

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue: "Missing table public.user_problems"

**Solution:** Run the SUPABASE_MIGRATIONS.sql file in Supabase SQL editor

### Issue: OAuth redirects to blank page

**Solution:** Make sure `/api/auth/callback/route.ts` is created and `NEXT_PUBLIC_SUPABASE_URL` is set correctly

### Issue: Roadmaps page shows `[object Promise]`

**Solution:** Apply the roadmaps page fix - replace `.map(async ...)` with `Promise.all()`

### Issue: Password reset form doesn't work

**Solution:** Ensure `/api/auth/forgot-password/route.ts` is created

### Issue: "getUserRoadmapProgress is not a function"

**Solution:** Add the function to `src/features/roadmaps/actions.ts`

---

## 📋 FINAL CHECKLIST

Before declaring MVP ready:

- [ ] All files created (5 new files)
- [ ] All files fixed (5 fixes)
- [ ] Database tables created
- [ ] Environment variables set
- [ ] Build completes without errors (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] Can sign up with email
- [ ] Can sign in with email
- [ ] Can sign in with GitHub (if configured)
- [ ] Can reset password
- [ ] DSA tracker works
- [ ] Notes system works
- [ ] Roadmaps display correctly
- [ ] Profile linking works
- [ ] No console errors in browser

---

## 🚀 DEPLOYMENT CHECKLIST

After all fixes:

1. [ ] Test on staging environment
2. [ ] Run load tests
3. [ ] Security audit
4. [ ] User acceptance testing
5. [ ] Database backups configured
6. [ ] Monitoring alerts set up
7. [ ] Error tracking configured
8. [ ] Deploy to production

---

## 📞 ESTIMATED TIMELINE

| Phase     | Task               | Time           |
| --------- | ------------------ | -------------- |
| 1         | Database setup     | 1 hour         |
| 2         | Create new files   | 2-3 hours      |
| 3         | Fix existing files | 3-4 hours      |
| 4         | Configuration      | 30 mins        |
| 5         | Testing            | 1-2 hours      |
| **Total** | **All fixes**      | **8-12 hours** |

---

**Document Version:** 1.0  
**Last Updated:** May 12, 2026  
**Status:** Ready for implementation
