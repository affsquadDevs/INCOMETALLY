import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for redirects and canonical enforcement
 * 
 * Handles:
 * - Trailing slash normalization
 * - Alias redirects (e.g., /net-salary-calculator -> /salary-calculator)
 * - Ensures consistent URL structure
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Remove trailing slashes (except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308); // 308 Permanent Redirect (preserves method)
  }

  // Alias redirects - redirect aliases to canonical URLs
  const aliases: Record<string, string> = {
    '/net-salary-calculator': '/salary-calculator',
    '/salary-calculator/': '/salary-calculator', // Remove trailing slash
    '/privacy-policy': '/privacy',
    '/terms-of-service': '/terms',
  };

  // Check for exact alias matches
  if (aliases[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = aliases[pathname];
    return NextResponse.redirect(url, 301); // 301 Permanent Redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

