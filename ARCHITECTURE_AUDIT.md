# StudyOS Architecture Audit & Stabilization Report

**Date:** May 12, 2026  
**Status:** Pre-MVP - Requires Critical Fixes  
**Completion:** ~60% (Core features incomplete, infrastructure gaps)

---

## 📋 CRITICAL ISSUES (BLOCKING - MUST FIX)

### 🔴 ISSUE #1: ASYNC/PROMISE RENDERING BUG - ROADMAPS PAGE

**Severity:** CRITICAL  
**Location:** `src/app/dashboard/roadmaps/page.tsx` (Lines 15-24)  
**Status:** ❌ BROKEN - Produces `[object Promise]` in JSX

**Current Code:**

```tsx
{
  roadmaps.map(async (roadmap) => {
    // ❌ WRONG
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

**Impact:** Roadmaps page renders blank/nothing - users see empty grid

**Root Cause:** `.map(async ())` returns `Promise<JSX>[]` instead of `JSX[]`

**Fix Required:** Restructure as server component with `Promise.all()`

---

### 🔴 ISSUE #2: MISSING SUPABASE DATABASE TABLES

**Severity:** CRITICAL  
**Status:** ❌ Not created - Multiple features completely broken

**Missing Tables:**

1. `user_problems` - DSA Tracker data
2. `user_notes` - Notes & Revision system
3. `user_profiles` - User profile integration
4. `user_topic_progress` - Roadmap progress tracking

**Error Message Users See:**

```
Error: Could not find table public.user_problems
Error: Could not find table public.user_notes
Error: Could not find table public.user_profiles
Error: Could not find table public.user_topic_progress
```

**Impact:**

- DSA Tracker page shows error fallback
- Notes system completely broken
- Profile integration broken
- Roadmap progress not saved

**Required SQL Migration:** (See SUPABASE_MIGRATIONS.sql)

---

### 🔴 ISSUE #3: MISSING OAUTH CALLBACK ROUTE

**Severity:** CRITICAL  
**Location:** `src/features/auth/actions.ts` (Line 66)  
**Status:** ❌ Route missing - OAuth logins don't work

**Current Code:**

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `${getURL()}api/auth/callback`, // ❌ Route doesn't exist
  },
});
```

**Impact:** GitHub & Google OAuth login completely non-functional

**Missing File:** `src/app/api/auth/callback/route.ts`

**What Happens Now:**

1. User clicks "Sign in with Google"
2. Redirected to Google/GitHub
3. After auth, callback to non-existent route
4. User stuck on error page or blank page

---

### 🔴 ISSUE #4: MIDDLEWARE NOT AT ROOT

**Severity:** CRITICAL (Pattern violation)  
**Current Location:** `src/proxy.ts`  
**Should Be:** `middleware.ts` (at root)

**Problem:**

- Using legacy proxy pattern instead of modern Next.js middleware
- Auth redirect logic in proxy.ts is non-standard
- Modern edge middleware won't execute properly

**Impact:**

- Session management may be unreliable
- Auth redirects might not work consistently
- Performance implications

---

### 🔴 ISSUE #5: MISSING FUNCTION - getUserRoadmapProgress

**Severity:** CRITICAL  
**Location:** `src/app/dashboard/roadmaps/page.tsx` (Line 11)  
**Status:** ❌ Imported but not implemented

**Error:**

```
TypeError: getUserRoadmapProgress is not a function
```

**Missing From:** `src/features/roadmaps/actions.ts`

**Impact:** Roadmaps page won't compile/run

---

### 🔴 ISSUE #6: MISSING PASSWORD RESET ENDPOINT

**Severity:** CRITICAL  
**Location:** `src/app/forgot-password/page.tsx` (Line 28)  
**Status:** ❌ Form posts to non-existent endpoint

**Current Code:**

```tsx
<form className="space-y-6" action="/auth/reset-password">
  {/* ❌ This route doesn't exist */}
</form>
```

**Missing File:** `src/app/api/auth/forgot-password/route.ts`

**Impact:** Password reset feature is completely non-functional

---

### 🟠 ISSUE #7: MISSING GEMINI API KEY

**Severity:** HIGH (Feature blocking)  
**Location:** `src/services/ai/gemini.ts` (Line 1)  
**Status:** ⚠️ Not configured

**Current Code:**

```typescript
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
```

**Impact:**

- AI Coach won't respond with real analysis
- Topic analyzer shows "API key not configured" message
- Feature gracefully degrades but doesn't work

**Fix:** Add `GEMINI_API_KEY` to `.env.local`

---

## 🟠 HIGH-PRIORITY ISSUES

### ISSUE #8: MISSING CONTEST FETCHING IMPLEMENTATION

**Severity:** HIGH  
**Location:** `src/services/contests.ts`  
**Status:** ⚠️ File exists but function not implemented

**Problem:** `fetchContests()` is called but empty

```typescript
// src/services/contests.ts - Not implemented
export async function fetchContests() {
  // What should this return?
}
```

**Impact:** Contests page loads but shows no data

**Options:**

1. Implement real fetching from Codeforces/LeetCode API
2. Use mock data for MVP
3. Remove feature entirely

---

### ISSUE #9: TOP NAVBAR LOGOUT PATTERN INCONSISTENCY

**Severity:** MEDIUM  
**Location:** `src/components/layout/top-navbar.tsx` (Line 61-65)  
**Status:** ⚠️ Works but suboptimal pattern

**Current Code:**

```tsx
<form action={logout}>
  <button type="submit" className="w-full text-left">
    Sign out
  </button>
</form>
```

**Issue:** Server action called directly from client component - could cause hydration mismatches

**Better Pattern:** Use onClick handler with async import

---

### ISSUE #10: DASHBOARD HARDCODED MOCK DATA

**Severity:** MEDIUM  
**Location:** `src/app/dashboard/page.tsx` (Lines 28-70)  
**Status:** ⚠️ All stats are hardcoded

**Examples:**

```tsx
<div className="text-2xl font-bold">12 Days</div>        // Streak
<div className="text-2xl font-bold">248</div>            // Problems
<div className="text-2xl font-bold text-yellow-500">1452</div>  // Rating
<div className="text-xl font-bold">Div. 2 Round</div>    // Contest
```

**Impact:** Dashboard doesn't show real user data

**Should Come From:**

- Streaks table (not created yet)
- user_problems table data
- External APIs (Codeforces, LeetCode)
- Contests API

---

## 🟡 MEDIUM-PRIORITY ISSUES

### ISSUE #11: NO ERROR BOUNDARIES

**Status:** ⚠️ Missing error.tsx files
**Locations:**

- `src/app/error.tsx` - Global error handler (missing)
- `src/app/dashboard/error.tsx` - Dashboard errors (missing)
- `src/app/not-found.tsx` - 404 page (missing)

**Impact:** Unhandled errors show ugly default Next.js error page

---

### ISSUE #12: TYPE SAFETY - UNSAFE CASTS

**Severity:** MEDIUM  
**Locations:**

- `src/features/dsa/actions.ts` - Line 18
- `src/features/notes/actions.ts` - Line 16
- Other server action files

**Current Code:**

```typescript
return { data: data as UserProblem[], error: null }; // ❌ Unsafe
```

**Better:** Validate data before casting

---

### ISSUE #13: INCONSISTENT ERROR MESSAGES

**Severity:** MEDIUM  
**Locations:**

- `src/app/dashboard/dsa/page.tsx` (Line 13-17)
- `src/app/dashboard/notes/page.tsx` (Line 9-13)

**Problem:** Raw database errors exposed to users

```tsx
{
  error;
} // ❌ Shows "Could not find table public.user_problems"
```

**Should:** Show friendly message, hide implementation details

---

### ISSUE #14: MISSING LOADING/SKELETON STATES

**Severity:** MEDIUM  
**Locations:**

- Profile stats fetching
- Contest list loading
- Some async transitions

**Impact:** Pages feel unresponsive while loading

---

### ISSUE #15: NO FORM VALIDATION

**Severity:** MEDIUM  
**Locations:**

- Add problem modal
- Profile form
- Note editor

**Current:** Only HTML5 validation (type="email", required, etc.)

**Missing:**

- Length validation
- Format validation
- Cross-field validation
- Real-time feedback

---

## 🟢 ISSUES THAT ARE OK (Don't change)

✅ Server Components + Server Actions pattern  
✅ Supabase SSR implementation  
✅ Suspense boundaries usage  
✅ TypeScript configuration  
✅ Component organization by feature  
✅ Environment variable setup

---

## 📊 ISSUE SUMMARY

| Category            | Count | Examples                                     |
| ------------------- | ----- | -------------------------------------------- |
| Critical (Blocking) | 6     | Async bug, Missing tables, No OAuth callback |
| High Priority       | 3     | Contest fetching, Mock data, Navbar pattern  |
| Medium Priority     | 6     | Error boundaries, Type safety, Validation    |
| Low Priority        | 2     | Performance, Testing                         |

**Total Actionable Issues:** 17  
**Estimated Time to Fix:** 8-12 hours

---

## 🛠️ QUICK FIX CHECKLIST

### Priority 1 - BLOCKING (Do first)

- [ ] Fix async/await in roadmaps page
- [ ] Create database tables (user_problems, user_notes, user_profiles, user_topic_progress)
- [ ] Add OAuth callback route (`src/app/api/auth/callback/route.ts`)
- [ ] Create middleware.ts at root
- [ ] Implement `getUserRoadmapProgress` function

### Priority 2 - HIGH (Do next)

- [ ] Add password reset endpoint (`src/app/api/auth/forgot-password/route.ts`)
- [ ] Implement contests fetching or remove feature
- [ ] Create error.tsx and not-found.tsx
- [ ] Add GEMINI_API_KEY to .env.local

### Priority 3 - STABILITY (Polish)

- [ ] Fix error messages (don't expose DB errors)
- [ ] Add loading states where missing
- [ ] Remove hardcoded dashboard data
- [ ] Add form validation
- [ ] Fix type safety issues

---

## 📝 DATABASE MIGRATIONS REQUIRED

**File:** See attached `SUPABASE_MIGRATIONS.sql`

**Tables to Create:**

1. `user_profiles` - User profile data (GitHub, LeetCode, Codeforces handles)
2. `user_problems` - DSA problem tracking
3. `user_notes` - Notes with confidence levels
4. `user_topic_progress` - Roadmap progress tracking

**Security:** All tables need Row Level Security (RLS) enabled

---

## 🚀 DEPLOYMENT READINESS

**Current Score:** 35/100

**Missing for Production:**

- ❌ Database migrations documented
- ❌ All critical issues fixed
- ❌ Error pages for 404/500
- ❌ Tests/QA
- ❌ Monitoring setup
- ❌ Logging infrastructure

**Ready:**

- ✅ TypeScript configuration
- ✅ Build process
- ✅ Auth pattern
- ✅ Environment setup

---

## 📚 RELATED DOCUMENTS

- `SUPABASE_MIGRATIONS.sql` - Complete database schema
- `.env.example` - Environment variables needed
- Next Steps section below

---

## 🎯 NEXT STEPS

1. **Immediate (Today):**
   - Create database tables via Supabase UI or SQL
   - Apply critical code fixes
   - Test OAuth callback flow

2. **This Week:**
   - Implement missing endpoints
   - Add error boundaries
   - Create loading states

3. **Before Launch:**
   - Test entire auth flow
   - Verify all CRUD operations
   - Load test with sample data
   - Security audit

---

## 📞 NOTES

This audit identified the main blockers preventing the MVP from functioning. The project has good foundations (modern Next.js patterns, proper auth setup, component organization) but needs infrastructure completion (database, API routes) and stability fixes (error handling, missing functions).

The fixes are straightforward and don't require architecture changes - mostly creating missing pieces and fixing the async/await bug in the roadmaps page.

Estimated time to production-ready: **1-2 weeks** with focused effort.
