export { default } from 'next-auth/middleware';

export const config = {
  // TODO: update middlewar
  matcher: ['/mybooking/:path*', '/profile'],
}