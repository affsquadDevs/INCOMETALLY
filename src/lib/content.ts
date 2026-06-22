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

type AboutContent = typeof siteConfig.aboutUs;
type ContactContent = typeof siteConfig.contactPage;

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
