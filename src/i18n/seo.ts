import { locales, defaultLocale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

const domain = siteConfig.domain;

/**
 * Build the absolute URL for a given locale and locale-independent path.
 *
 * English (the default locale) is served at the ROOT with no prefix; every
 * other locale lives under its `/{locale}` prefix. The home path ('/') is
 * special-cased so the default-locale home is the bare domain and other
 * locales are `${domain}/${locale}` (no trailing slash).
 *
 * @param locale ISO-639 locale code (must be one of `locales`).
 * @param path   Locale-independent path beginning with '/', e.g. '/', '/about-us'.
 */
function urlFor(locale: string, path: string): string {
  const suffix = path === '/' ? '' : path;
  if (locale === defaultLocale) {
    return `${domain}${suffix}`;
  }
  return `${domain}/${locale}${suffix}`;
}

export interface Alternates {
  canonical: string;
  languages: Record<string, string>;
}

/**
 * Produce the canonical URL plus the full hreflang language map (including
 * `x-default`) for a page, given the active locale and its locale-independent
 * path. Intended to be spread into a page's `metadata.alternates`.
 *
 * @example
 *   alternates: buildAlternates(locale, '/about-us')
 */
export function buildAlternates(locale: string, path: string): Alternates {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = urlFor(l, path);
  }
  languages['x-default'] = urlFor(defaultLocale, path);

  return {
    canonical: urlFor(locale, path),
    languages,
  };
}
