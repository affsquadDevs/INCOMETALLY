/**
 * Locale-aware content loaders for the static pages. English comes from the
 * source config files; other locales deep-merge their override on top, falling
 * back to English for anything not yet translated.
 */
import { deepMerge } from '@/i18n/merge';
import { siteConfig } from '@/config/site';
import { privacyPolicyConfig, type PrivacyPolicyConfig } from '@/config/privacy';
import { termsOfServiceConfig, type TermsOfServiceConfig } from '@/config/terms';
import { pageOverrides } from '@/content/pages';
import { countries, type CountryCode, type CountryMetadata } from '@/lib/countries';
import { getCountryFAQs, getHubFAQs, type FAQ } from '@/lib/seo/faq';
import { countryOverrides } from '@/content/countries';
import {
  guides,
  getGuideBySlug,
  getGuidesByPillar,
  getRelatedGuides,
  type Guide,
} from '@/data/guides';
import { getAllPillars, getPillar, type Pillar } from '@/data/pillars';
import { getAuthor, type Author } from '@/data/authors';
import { guideOverrides } from '@/content/guides';
import { pillarOverrides } from '@/content/pillars';
import { authorOverrides } from '@/content/authors';

type AboutContent = typeof siteConfig.aboutUs;
type ContactContent = typeof siteConfig.contactPage;

/** Translatable country text fields that a locale override may provide. */
interface CountryTextOverride {
  displayName?: string;
  title?: string;
  description?: string;
  taxExplanation?: string;
  faqs?: FAQ[];
}

function countryOverride(locale: string, code: string): CountryTextOverride | undefined {
  const loc = countryOverrides[locale] as Record<string, CountryTextOverride> | undefined;
  return loc?.[code.toUpperCase()];
}

/**
 * Locale-aware country metadata: English base (code/flag/currency/example +
 * English text) with translated displayName/title/description/taxExplanation
 * merged on top. Returns null for an unknown country code.
 */
export function getLocalizedCountry(code: string, locale: string): CountryMetadata | null {
  const base = countries[code.toUpperCase() as CountryCode];
  if (!base) return null;
  const o = countryOverride(locale, code);
  if (!o) return base;
  return deepMerge(base, {
    displayName: o.displayName,
    title: o.title,
    description: o.description,
    taxExplanation: o.taxExplanation,
  });
}

/** Locale-aware country FAQs (falls back to English). */
export function getLocalizedCountryFAQs(code: string, locale: string): FAQ[] {
  return countryOverride(locale, code)?.faqs ?? getCountryFAQs(code);
}

/** Locale-aware salary-calculator hub FAQs (falls back to English). */
export function getLocalizedHubFAQs(locale: string): FAQ[] {
  const loc = countryOverrides[locale] as { hub?: { faqs?: FAQ[] } } | undefined;
  return loc?.hub?.faqs ?? getHubFAQs();
}

// ---- Guides -----------------------------------------------------------------

function mergeGuide(g: Guide, locale: string): Guide {
  const o = (guideOverrides[locale] as Record<string, Partial<Guide>> | undefined)?.[g.slug];
  return o ? deepMerge(g, o) : g;
}

export function getLocalizedGuideBySlug(slug: string, locale: string): Guide | undefined {
  const g = getGuideBySlug(slug);
  return g ? mergeGuide(g, locale) : g;
}

export function getLocalizedGuides(locale: string): Guide[] {
  return guides.map((g) => mergeGuide(g, locale));
}

export function getLocalizedGuidesByPillar(pillarId: string, locale: string): Guide[] {
  return getGuidesByPillar(pillarId).map((g) => mergeGuide(g, locale));
}

export function getLocalizedRelatedGuides(slug: string, locale: string): Guide[] {
  return getRelatedGuides(slug).map((g) => mergeGuide(g, locale));
}

// ---- Pillars ----------------------------------------------------------------

function mergePillar(p: Pillar, locale: string): Pillar {
  const o = (pillarOverrides[locale] as Record<string, Partial<Pillar>> | undefined)?.[p.id];
  return o ? deepMerge(p, o) : p;
}

export function getLocalizedPillars(locale: string): Pillar[] {
  return getAllPillars().map((p) => mergePillar(p, locale));
}

export function getLocalizedPillar(id: string, locale: string): Pillar | undefined {
  const p = getPillar(id);
  return p ? mergePillar(p, locale) : p;
}

// ---- Authors ----------------------------------------------------------------

export function getLocalizedAuthor(id: string | undefined, locale: string): Author {
  const a = getAuthor(id);
  const o = (authorOverrides[locale] as Record<string, Partial<Author>> | undefined)?.[a.id];
  return o ? deepMerge(a, o) : a;
}

export function getAbout(locale: string): AboutContent {
  return deepMerge(siteConfig.aboutUs, pageOverrides[locale]?.about);
}

export function getContact(locale: string): ContactContent {
  return deepMerge(siteConfig.contactPage, pageOverrides[locale]?.contact);
}

export function getPrivacy(locale: string): PrivacyPolicyConfig {
  return deepMerge(privacyPolicyConfig, pageOverrides[locale]?.privacy);
}

export function getTerms(locale: string): TermsOfServiceConfig {
  return deepMerge(termsOfServiceConfig, pageOverrides[locale]?.terms);
}
