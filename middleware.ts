import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Root-level middleware for authentication and session management.
 * Handles:
 * - Session token refresh
 * - Auth redirects for protected routes
 * - Session persistence across requests
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - static files (_next/static)
     * - image optimization files (_next/image)
     * - favicon
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
