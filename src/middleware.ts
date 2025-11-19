import { withAuth } from 'next-auth/middleware';

// ต้อง export default function (หรือ export function middleware)
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // บังคับให้ต้อง login
  },
});

export const config = {
  matcher: [
    '/mybooking/:path*',
    '/profile/:path*',
    '/exhibition/create',
    '/exhibition/create-booking/:path*',
    '/exhibition/edit/:path*',
  ],
};
