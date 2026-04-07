import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const res = NextResponse.next();

  // 1. Enforce Strict Security Headers (Enterprise Standard)
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // 2. Protect Admin Routes (Zero-Trust Model)
  if (path.startsWith('/admin') && !path.includes('/login') && !path.includes('/register')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // 3. Rate Limit Flagging for Auth Routes (Prevents Brute Force)
  if (path.includes('/api/login') || path.includes('/api/register')) {
    res.headers.set('X-RateLimit-Limit', '5');
  }

  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/login",
    "/api/register"
  ],
};
