import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['login', 'register'];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const locale = pathname.split('/')[1];
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();
  // Skip public paths and static assets
  if (PUBLIC_PATHS.some(path => pathname.includes(path))) {
    return NextResponse.next();
  }
  // Allow access to the main page without authentication
  if (url.pathname === "/") {
    return NextResponse.next();
  }

  // For other pages, redirect unauthenticated users to login
  if (!token) {
    // Redirect unauthenticated user to localized login page
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except api, _next, etc.
export const config = {
  matcher: [
    /*
     * Protect all routes except static files, api routes, and the main page
     * Include other public pages if any by excluding them here
     */
    "/((?!api|_next|favicon.ico|).*)",
  ],
};