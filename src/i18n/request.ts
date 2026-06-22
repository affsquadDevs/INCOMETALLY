import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the segment matched by the middleware.
  const requested = await requestLocale;
  const locale: Locale =
    requested && routing.locales.includes(requested as Locale)
      ? (requested as Locale)
      : routing.defaultLocale;

  // English is the source of truth; other locales fall back to English for any
  // keys that are not yet translated (deep-merged below).
  const en = (await import('../../messages/en.json')).default;
  const messages =
    locale === 'en' ? en : deepMerge(en, (await import(`../../messages/${locale}.json`)).default);

  return { locale, messages };
});

/** Shallow-by-namespace deep merge: translated keys override English fallbacks. */
function deepMerge<T>(base: T, override: Partial<T>): T {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return (override ?? base) as T;
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys((override ?? {}) as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    result[key] =
      b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b)
        ? deepMerge(b, o as Partial<typeof b>)
        : o;
  }
  return result as T;
}
