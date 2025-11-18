export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/mybooking/:path*', 
    '/profile/:path*',
    '/exhibition/create',
    '/exhibition/create-booking/:path*',
    '/exhibition/edit/:path*',
  ],
}