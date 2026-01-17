import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Force HTTPS in production
    if (
        process.env.NODE_ENV === 'production' &&
        request.headers.get('x-forwarded-proto') !== 'https'
    ) {
        return NextResponse.redirect(
            `https://${request.headers.get('host')}${pathname}${search}`,
            301
        );
    }

    // Force non-www (or www, choose one)
    const host = request.headers.get('host') || '';
    if (host.startsWith('www.')) {
        return NextResponse.redirect(
            `https://${host.replace('www.', '')}${pathname}${search}`,
            301
        );
    }

    // Remove trailing slashes (except for root)
    if (pathname !== '/' && pathname.endsWith('/')) {
        return NextResponse.redirect(
            new URL(pathname.slice(0, -1) + search, request.url),
            301
        );
    }

    // Clean up filter parameters (prevent duplicate URLs)
    // If there are query params but no actual filters, redirect to clean URL
    const url = request.nextUrl.clone();
    const hasFilters = url.searchParams.has('category') || url.searchParams.has('pricing');

    if (!hasFilters && url.search) {
        // Remove all query params if no valid filters
        url.search = '';
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
