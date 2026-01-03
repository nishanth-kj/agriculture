import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const protectedRoutes = ['/dashboard', '/profile', '/stocks'];
const authRoutes = ['/login', '/signup'];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // 1. If trying to access a protected route without a token
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2. If trying to access login/signup while already authenticated
    if (authRoutes.some(route => pathname.startsWith(route)) && token) {
        try {
            verifyToken(token);
            return NextResponse.redirect(new URL('/dashboard', req.url));
        } catch (e) {
            // Token invalid, allow access to auth routes
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
