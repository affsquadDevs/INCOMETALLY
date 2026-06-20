import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { getGuideBySlug, getAllGuideSlugs } from '@/data/guides';
import FAQAccordion from '@/components/FAQAccordion';
import { generateFAQJsonLd } from '@/lib/seo/faq';
import { generateBreadcrumbJsonLd } from '@/lib/seo/breadcrumbs';
import { siteConfig } from '@/config/site';

// Dynamic import for react-markdown - heavy library, only load when needed
// Reduces initial bundle size for guide pages
const ReactMarkdown = dynamic(
  () => import('react-markdown'),
  {
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ),
  }
);

interface PageProps {
  params: {
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
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  const url = `${siteConfig.domain}/guides/${guide.slug}`;

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.date,
      url,
    },
    keywords: guide.keywords,
  };
}

// Simple TOC extraction from markdown headers
function extractTOC(content: string): Array<{ id: string; text: string; level: number }> {
  const lines = content.split('\n');
  const toc: Array<{ id: string; text: string; level: number }> = [];

  lines.forEach((line) => {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      toc.push({ id, text, level });
    }
  });

  return toc;
}

export default function GuidePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const toc = extractTOC(guide.content);
  const url = `${siteConfig.domain}/guides/${guide.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.domain },
    { name: 'Guides', url: `${siteConfig.domain}/guides` },
    { name: guide.title, url },
  ];

  // Generate JSON-LD for BlogPosting
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
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
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:opacity-100">
              Guides
            </Link>
            <span className="mx-2">/</span>
            <span className="opacity-100">{guide.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
              {guide.title}
            </h1>
            <p className="text-lg text-black opacity-70 mb-4">
              {guide.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-black opacity-60">
              <time dateTime={guide.date}>
                {new Date(guide.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{guide.keywords.length} topics</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8 mb-8">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {guide.content}
                  </ReactMarkdown>
                </div>
              </article>

              {/* FAQ Section */}
              {guide.faqs && guide.faqs.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-3xl font-normal text-black mb-6">
                    Frequently Asked Questions
                  </h2>
                  <FAQAccordion faqs={guide.faqs} />
                </section>
              )}

              {/* Related Links */}
              <section className="border-t border-black border-opacity-10 pt-8">
                <h3 className="text-xl font-normal text-black mb-4">Related Resources</h3>
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
                      href="/hourly-to-salary"
                      className="text-black opacity-70 hover:opacity-100 underline"
                    >
                      Hourly to Salary Converter
                    </Link>
                  </li>
                </ul>
              </section>
            </div>

            {/* Sidebar - Table of Contents */}
            {toc.length > 0 && (
              <aside className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-lg border border-black border-opacity-10 p-6">
                  <h3 className="text-lg font-medium text-black mb-4">Table of Contents</h3>
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

