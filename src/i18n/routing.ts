import { defineRouting } from 'next-intl/routing';

/**
 * Supported locales. English is the default and is served at the root with no
 * prefix (localePrefix: 'as-needed'); every other locale is served under its
 * own prefix, e.g. /es, /de, /uk.
 *
 * These are ISO-639 language codes and are intentionally distinct from the
 * site's country/tax codes (e.g. UK, SE, PT) used by the calculators.
 */
export const locales = [
  'en', // English
  'pl', // Polish
  'es', // Spanish
  'pt', // Portuguese
  'fr', // French
  'it', // Italian
  'de', // German
  'uk', // Ukrainian
  'sv', // Swedish
  'cs', // Czech
  'el', // Greek
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Human-readable names for the language switcher (endonyms). */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  pl: 'Polski',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  uk: 'Українська',
  sv: 'Svenska',
  cs: 'Čeština',
  el: 'Ελληνικά',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});
