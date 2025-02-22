import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
    if (token && pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/teacher/dashboard', req.url));
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!token && pathname.startsWith('/teacher')) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si l'utilisateur est un étudiant et essaie d'accéder à l'espace professeur
    if (token?.role === 'STUDENT' && pathname.startsWith('/teacher')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // On gère l'autorisation dans le middleware
    },
  }
);

export const config = {
  matcher: [
    '/teacher/:path*',
    '/auth/login',
  ],
}; 