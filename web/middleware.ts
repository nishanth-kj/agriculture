import { NextRequest, NextResponse } from 'next/server';

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
        // Edge middleware avoids Node-only JWT libs; API routes still validate token server-side.
        return NextResponse.redirect(new URL('/dashboard', req.url));
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
