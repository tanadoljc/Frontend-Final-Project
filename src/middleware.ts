import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/mybooking/:path*',
    '/profile/:path*',
    '/exhibition/create',
    '/exhibition/create-booking/:path*',
    '/exhibition/edit/:path*',
  ],
};
