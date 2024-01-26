export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subjects/:path*',
    '/topics/:path*',
    '/search/:path*',
  ],
};
