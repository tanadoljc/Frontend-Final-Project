import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: '__Secure-next-auth.session-token',
  });

  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  const restrictedForMember = ['/exhibition/create', '/exhibition/edit'];

  if (
    token.role === 'member' &&
    restrictedForMember.some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// routes ที่ middleware จะตรวจ
export const config = {
  matcher: [
    '/mybooking/:path*',
    '/profile/:path*',
    '/exhibition/create',
    '/exhibition/create-booking/:path*',
    '/exhibition/edit/:path*',
  ],
};
