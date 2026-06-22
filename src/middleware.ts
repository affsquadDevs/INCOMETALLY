import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Legacy → canonical path aliases, applied within any locale.
const aliases: Record<string, string> = {
  '/blog': '/guides',
  '/privacy-policy': '/privacy',
  '/terms-of-service': '/terms',
};

/** Split an optional leading locale segment off a pathname. */
function splitLocale(pathname: string): { locale: string | null; rest: string } {
  const segs = pathname.split('/');
  const maybe = segs[1];
  if (maybe && (routing.locales as readonly string[]).includes(maybe)) {
    return { locale: maybe, rest: '/' + segs.slice(2).join('/') };
  }
  return { locale: null, rest: pathname };
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Strip trailing slash (except root).
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  // 2) Legacy path aliases, preserving any locale prefix.
  const { locale, rest } = splitLocale(pathname);
  const aliased = aliases[rest === '' ? '/' : rest];
  if (aliased) {
    const url = request.nextUrl.clone();
    url.pathname = (locale ? `/${locale}` : '') + aliased;
    return NextResponse.redirect(url, 301);
  }

  // 3) Hand off to next-intl for locale detection and prefixing.
  return intlMiddleware(request);
}

export const config = {
  // All pathnames except API routes, Next internals, and any path containing a
  // dot (static files: favicon.ico, images, robots.txt, sitemap.xml, OG images).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
