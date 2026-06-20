/**
 * Internal linking helper for programmatic SEO
 * Auto-generates contextual internal links between pages
 */

import { getAllCountryCodes } from '@/lib/countries';
import { getAllGuideSlugs } from '@/data/guides';
import { getAllLongTailSlugs } from '@/data/longtail-intents';
import { siteConfig } from '@/config/site';

export interface InternalLink {
  href: string;
  text: string;
  description?: string;
}

/**
 * Get related country links (excluding current country)
 */
export function getCountryLinks(excludeCountry?: string): InternalLink[] {
  const countries = getAllCountryCodes();
  const countryNames: Record<string, string> = {
    US: 'United States',
    DE: 'Germany',
    UK: 'United Kingdom',
    PL: 'Poland',
    FR: 'France',
    ES: 'Spain',
    IT: 'Italy',
    SE: 'Sweden',
    PT: 'Portugal',
  };

  return countries
    .filter(code => code !== excludeCountry)
    .map(code => ({
      href: `/salary-calculator/${code.toLowerCase()}`,
      text: `${countryNames[code]} Salary Calculator`,
      description: `Calculate net income in ${countryNames[code]}`,
    }));
}

/**
 * Get related guide links
 */
export function getGuideLinks(limit: number = 3): InternalLink[] {
  const guides = getAllGuideSlugs();
  // In a real implementation, you'd load guide metadata
  // For now, return placeholder links
  return guides.slice(0, limit).map(slug => ({
    href: `/guides/${slug}`,
    text: `Guide: ${slug.replace(/-/g, ' ')}`,
  }));
}

/**
 * Get hub and main calculator links
 */
export function getMainLinks(): InternalLink[] {
  return [
    {
      href: '/salary-calculator',
      text: 'Salary Calculator Hub',
      description: 'All country calculators',
    },
    {
      href: '/hourly-to-salary',
      text: 'Hourly to Salary Converter',
      description: 'Convert hourly wages to annual salary',
    },
  ];
}

/**
 * Generate internal link block for a page
 */
export function generateInternalLinks(context: {
  currentPath?: string;
  countryCode?: string;
  relatedIntents?: string[];
}): InternalLink[] {
  const links: InternalLink[] = [];

  // Always include main links
  links.push(...getMainLinks());

  // Add country links if on a country page
  if (context.countryCode) {
    links.push(...getCountryLinks(context.countryCode));
  } else {
    // If not on country page, show all countries
    links.push(...getCountryLinks());
  }

  // Add related guides
  links.push(...getGuideLinks(3));

  return links;
}

