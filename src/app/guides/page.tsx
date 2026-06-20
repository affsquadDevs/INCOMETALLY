import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { getAllGuides, getGuidesByPillar, type Guide } from '@/data/guides';
import { getAllPillars } from '@/data/pillars';
import { generateBreadcrumbJsonLd } from '@/lib/seo/breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Salary & Tax Guides - Expert Articles on Income Calculations',
  description:
    'Comprehensive guides on salary calculations, tax brackets, deductions, and net income. Learn how to calculate take-home pay and understand tax systems.',
  alternates: {
    canonical: `${siteConfig.domain}/guides`,
  },
  openGraph: {
    title: 'Salary & Tax Guides - Expert Articles on Income Calculations',
    description:
      'Comprehensive guides on salary calculations, tax brackets, deductions, and net income.',
    type: 'website',
    url: `${siteConfig.domain}/guides`,
  },
};

// Cornerstone article first, then the rest of the cluster
function orderGuides(guides: Guide[]): Guide[] {
  return [...guides].sort(
    (a, b) => Number(b.isPillar ?? false) - Number(a.isPillar ?? false)
  );
}

export default function GuidesPage() {
  const pillars = getAllPillars();
  const allGuides = getAllGuides();

  const breadcrumbs = [
    { name: 'Home', url: siteConfig.domain },
    { name: 'Guides', url: `${siteConfig.domain}/guides` },
  ];

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Salary & Tax Guides',
    description:
      'Educational guides on salary, take-home pay, income tax, and money planning.',
    url: `${siteConfig.domain}/guides`,
    isPartOf: { '@id': `${siteConfig.domain}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allGuides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.domain}/guides/${guide.slug}`,
        name: guide.title,
      })),
    },
  };

  return (
    <>
      <Script
        id="collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBreadcrumbJsonLd(breadcrumbs) }}
      />
      <div className="bg-[#F5F5F0] min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
              Salary &amp; Tax Guides
            </h1>
            <p className="text-lg text-black opacity-70">
              Expert articles on salary calculations, tax systems, deductions, and
              understanding your take-home pay — organized into three topic pillars.
            </p>
          </div>

          {pillars.map((pillar) => {
            const pillarGuides = orderGuides(getGuidesByPillar(pillar.id));
            if (pillarGuides.length === 0) return null;

            return (
              <section key={pillar.id} className="mb-14">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-normal text-black mb-2 tracking-[-0.01em]">
                    {pillar.title}
                  </h2>
                  <p className="text-base text-black opacity-70">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {pillarGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className={`block bg-white rounded-lg border p-6 transition-all hover:shadow-lg ${
                        guide.isPillar
                          ? 'border-[#0066FF] border-opacity-40 hover:border-opacity-70'
                          : 'border-black border-opacity-10 hover:border-opacity-30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {guide.isPillar && (
                            <span className="inline-block text-xs font-medium uppercase tracking-[0.05em] text-[#0066FF] mb-2">
                              Start here · Pillar guide
                            </span>
                          )}
                          <h3 className="text-xl md:text-2xl font-normal text-black mb-2">
                            {guide.title}
                          </h3>
                          <p className="text-base text-black opacity-70 mb-4">
                            {guide.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {guide.keywords.slice(0, 3).map((keyword) => (
                              <span
                                key={keyword}
                                className="text-xs px-2 py-1 bg-black bg-opacity-5 rounded text-black opacity-60"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <time className="text-sm text-black opacity-50">
                            Updated{' '}
                            {new Date(
                              guide.updated ?? guide.date
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        <svg
                          className="w-6 h-6 text-black opacity-30 flex-shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="mt-4 pt-8 border-t border-black border-opacity-10">
            <h2 className="text-2xl font-normal text-black mb-4">Try the calculators</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/salary-calculator"
                  className="text-black opacity-70 hover:opacity-100 underline"
                >
                  Salary Calculator Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/net-salary-calculator"
                  className="text-black opacity-70 hover:opacity-100 underline"
                >
                  Net Salary Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/hourly-to-salary"
                  className="text-black opacity-70 hover:opacity-100 underline"
                >
                  Hourly to Salary Converter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
