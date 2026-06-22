import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllGuideSlugs } from '@/data/guides';
import {
  getLocalizedGuideBySlug,
  getLocalizedRelatedGuides,
  getLocalizedPillar,
  getLocalizedAuthor,
} from '@/lib/content';
import FAQAccordion from '@/components/FAQAccordion';
import { generateFAQJsonLd } from '@/lib/seo/faq';
import { generateBreadcrumbJsonLd } from '@/lib/seo/breadcrumbs';
import { siteConfig } from '@/config/site';
import { buildAlternates } from '@/i18n/seo';

// Dynamic import for react-markdown - heavy library, only load when needed
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  ),
});

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static params for SSG
export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getLocalizedGuideBySlug(params.slug, params.locale);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  const url = `${siteConfig.domain}/guides/${guide.slug}`;
  const author = getLocalizedAuthor(guide.authorId, params.locale);
  const pillar = getLocalizedPillar(guide.pillar, params.locale);

  return {
    title: guide.title,
    description: guide.description,
    alternates: buildAlternates(params.locale, `/guides/${guide.slug}`),
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.date,
      modifiedTime: guide.updated ?? guide.date,
      authors: [author.name],
      section: pillar?.title,
      tags: guide.keywords,
      url,
    },
    keywords: guide.keywords,
  };
}

// Simple TOC extraction from markdown headers
function extractTOC(content: string): Array<{ id: string; text: string; level: number }> {
  const lines = content.split('\n');
  const toc: Array<{ id: string; text: string; level: number }> = [];

  lines.forEach((line, index) => {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      // Fall back to a positional id for non-Latin scripts where the slug is empty
      const id = slug || `section-${index}`;
      toc.push({ id, text, level });
    }
  });

  return toc;
}

export default async function GuidePage({ params }: PageProps) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');
  const dateLocale = locale === 'en' ? 'en-US' : locale;

  const guide = getLocalizedGuideBySlug(params.slug, locale);

  if (!guide) {
    notFound();
  }

  const author = getLocalizedAuthor(guide.authorId, locale);
  const pillar = getLocalizedPillar(guide.pillar, locale);
  const related = getLocalizedRelatedGuides(guide.slug, locale);
  // Strip a leading H1 from the markdown so each page has a single H1 (the header below)
  const contentBody = guide.content.replace(/^#\s+.+\n+/, '');
  const toc = extractTOC(contentBody);
  const url = `${siteConfig.domain}/guides/${guide.slug}`;
  const breadcrumbs = [
    { name: t('breadcrumbHome'), url: siteConfig.domain },
    { name: t('breadcrumbGuides'), url: `${siteConfig.domain}/guides` },
    { name: guide.title, url },
  ];

  // Generate JSON-LD for BlogPosting
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.updated ?? guide.date,
    inLanguage: locale,
    articleSection: pillar?.title,
    keywords: guide.keywords.join(', '),
    author: {
      '@type': author.type,
      name: author.name,
      url: `${siteConfig.domain}${author.url}`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domain,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.domain}${siteConfig.logo.image}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(guide.sources && guide.sources.length > 0
      ? {
          citation: guide.sources.map((source) => ({
            '@type': 'CreativeWork',
            name: source.label,
            url: source.url,
          })),
        }
      : {}),
  };

  // Generate FAQ JSON-LD if FAQs exist
  const faqJsonLd = guide.faqs ? generateFAQJsonLd(guide.faqs) : null;

  return (
    <>
      <Script
        id="blogposting-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema, null, 2) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBreadcrumbJsonLd(breadcrumbs) }}
      />
      {faqJsonLd && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd }}
        />
      )}

      <div className="bg-[#F5F5F0] min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-black opacity-70">
            <Link href="/" className="hover:opacity-100">
              {t('breadcrumbHome')}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:opacity-100">
              {t('breadcrumbGuides')}
            </Link>
            <span className="mx-2">/</span>
            <span className="opacity-100">{guide.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
              {guide.title}
            </h1>
            <p className="text-lg text-black opacity-70 mb-4">{guide.description}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black opacity-60">
              <span>
                {t('by')}{' '}
                <Link href={author.url} className="hover:opacity-100 hover:underline">
                  {author.name}
                </Link>
              </span>
              <span>•</span>
              <time dateTime={guide.date}>
                {t('published')}{' '}
                {new Date(guide.date).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {guide.updated && (
                <>
                  <span>•</span>
                  <time dateTime={guide.updated}>
                    {t('updated')}{' '}
                    {new Date(guide.updated).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8 mb-8">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentBody}</ReactMarkdown>
                </div>
              </article>

              {/* FAQ Section */}
              {guide.faqs && guide.faqs.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-3xl font-normal text-black mb-6">{t('faqHeading')}</h2>
                  <FAQAccordion faqs={guide.faqs} />
                </section>
              )}

              {/* Sources & further reading */}
              {guide.sources && guide.sources.length > 0 && (
                <section className="border-t border-black border-opacity-10 pt-8 mb-8">
                  <h2 className="text-xl font-normal text-black mb-4">{t('sourcesHeading')}</h2>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {guide.sources.map((source) => (
                      <li key={source.url}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-[#0066FF] hover:underline"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Author / editorial standards */}
              <section className="border-t border-black border-opacity-10 pt-8 mb-8">
                <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
                  <h2 className="text-lg font-medium text-black mb-2">{t('aboutAuthorHeading')}</h2>
                  <p className="text-sm font-medium text-black mb-1">{author.name}</p>
                  <p className="text-sm text-black opacity-70 leading-relaxed mb-3">{author.bio}</p>
                  <Link href={author.url} className="text-sm text-[#0066FF] hover:underline">
                    {t('editorialStandards')}
                  </Link>
                </div>
              </section>

              {/* Related guides (same pillar) */}
              {related.length > 0 && (
                <section className="border-t border-black border-opacity-10 pt-8 mb-8">
                  <h2 className="text-xl font-normal text-black mb-4">
                    {pillar ? t('moreInPillar', { pillar: pillar.title }) : t('relatedGeneric')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((relatedGuide) => (
                      <Link
                        key={relatedGuide.slug}
                        href={`/guides/${relatedGuide.slug}`}
                        className="block bg-white rounded-lg border border-black border-opacity-10 p-4 hover:border-opacity-30 transition-all hover:shadow"
                      >
                        <span className="text-sm font-medium text-black">
                          {relatedGuide.title}
                          {relatedGuide.isPillar ? ' ★' : ''}
                        </span>
                        <span className="block text-xs text-black opacity-60 mt-1 line-clamp-2">
                          {relatedGuide.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Calculators */}
              <section className="border-t border-black border-opacity-10 pt-8">
                <h2 className="text-xl font-normal text-black mb-4">{t('tryCalculators')}</h2>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/salary-calculator"
                      className="text-black opacity-70 hover:opacity-100 underline"
                    >
                      {t('linkHub')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/net-salary-calculator"
                      className="text-black opacity-70 hover:opacity-100 underline"
                    >
                      {t('linkNet')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hourly-to-salary"
                      className="text-black opacity-70 hover:opacity-100 underline"
                    >
                      {t('linkHourly')}
                    </Link>
                  </li>
                </ul>
              </section>
            </div>

            {/* Sidebar - Table of Contents */}
            {toc.length > 0 && (
              <aside className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-lg border border-black border-opacity-10 p-6">
                  <h3 className="text-lg font-medium text-black mb-4">{t('toc')}</h3>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm text-black opacity-70 hover:opacity-100 hover:underline ${
                          item.level === 1 ? 'font-medium' : item.level === 2 ? 'pl-4' : 'pl-8'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
