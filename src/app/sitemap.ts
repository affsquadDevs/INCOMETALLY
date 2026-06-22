import { MetadataRoute } from 'next';
import { getAllCountryCodes } from '@/lib/countries';
import { getAllGuideSlugs } from '@/data/guides';
import { buildAlternates } from '@/i18n/seo';
import { locales } from '@/i18n/routing';

// Fixed build-stable timestamp (no Date.now()) so the sitemap is deterministic.
const LAST_MODIFIED = '2026-06-01';

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

/**
 * A single indexable path (locale-independent, beginning with '/') plus its
 * SEO weighting. The default-locale URL is emitted as the entry `url`, and the
 * full per-locale hreflang map is attached via `alternates.languages`.
 */
interface Route {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const countries = getAllCountryCodes();
  const guides = getAllGuideSlugs();

  const routes: Route[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/salary-calculator', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/hourly-to-salary', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/net-salary-calculator', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/calculator', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/guides', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about-us', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
    // Country calculator pages
    ...countries.map(
      (code): Route => ({
        path: `/salary-calculator/${code.toLowerCase()}`,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    ),
    // Guide pages
    ...guides.map(
      (slug): Route => ({
        path: `/guides/${slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    ),
  ];

  // Emit one <url> entry per (path × locale) so every localized URL is its own
  // <loc>, each carrying the full hreflang alternate set (incl. x-default).
  return routes.flatMap(({ path, changeFrequency, priority }) => {
    const { languages } = buildAlternates('en', path);
    return locales.map((locale) => ({
      url: languages[locale],
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
