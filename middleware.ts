import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Protect all /admin routes except login/register
  if (path.startsWith('/admin') && !path.includes('/login') && !path.includes('/register')) {
    const sessionToken = 
      req.cookies.get('next-auth.session-token')?.value || 
      req.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
