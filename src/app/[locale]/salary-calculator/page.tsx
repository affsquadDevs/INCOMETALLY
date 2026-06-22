import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';
import { getAllCountryCodes } from '@/lib/countries';
import { getLocalizedCountry, getLocalizedHubFAQs } from '@/lib/content';
import FAQAccordion from '@/components/FAQAccordion';
import { type IncomeMode } from '@/lib/tax/types';
import { generateFAQJsonLd } from '@/lib/seo/faq';
import { generateBreadcrumbJsonLd } from '@/lib/seo/breadcrumbs';
import { siteConfig } from '@/config/site';

// Dynamic import for heavy calculator component
const SalaryCalculator = dynamic(() => import('@/components/SalaryCalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false,
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hub' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteConfig.domain}/salary-calculator`,
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
      url: `${siteConfig.domain}/salary-calculator`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface PageProps {
  params: { locale: string };
  searchParams: {
    mode?: string;
  };
}

export default async function SalaryCalculatorHub({ params: { locale }, searchParams }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations('hub');
  const allCountries = getAllCountryCodes().map((code) => getLocalizedCountry(code, locale)!);
  const mode = searchParams.mode as IncomeMode | undefined;
  const showCalculator = mode && ['hourly', 'monthly', 'yearly'].includes(mode);
  const faqs = getLocalizedHubFAQs(locale);
  const faqJsonLd = generateFAQJsonLd(faqs);
  const breadcrumbs = [{ name: t('title'), url: `${siteConfig.domain}/salary-calculator` }];

  const modeTitle =
    mode === 'hourly'
      ? t('hourlyTitle')
      : mode === 'monthly'
        ? t('monthlyTitle')
        : t('yearlyTitle');

  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBreadcrumbJsonLd(breadcrumbs) }}
      />
      <div className="bg-[#F5F5F0] min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          {/* Intro */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
              {t('title')}
            </h1>
            <p className="text-lg text-black opacity-70 mb-6">{t('intro1')}</p>
            <p className="text-base text-black opacity-70">{t('intro2')}</p>
          </div>

          {/* Country List Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-normal text-black mb-6">{t('byCountryHeading')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allCountries.map((country) => (
                <Link
                  key={country.code}
                  href={`/salary-calculator/${country.code.toLowerCase()}`}
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <div className="text-4xl mb-3">{country.flag}</div>
                  <h3 className="text-xl font-normal text-black mb-2">{country.displayName}</h3>
                  <p className="text-sm text-black opacity-70 mb-4">{country.description}</p>
                  <span className="text-sm text-black opacity-70 underline">
                    {t('calculateCta')}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Calculator (shown when mode query param is present) */}
          {showCalculator && (
            <section className="mb-12">
              <h2 className="text-2xl font-normal text-black mb-6">{modeTitle}</h2>
              <ErrorBoundary>
                <SalaryCalculator initialCountryCode="US" initialYear={2026} initialMode={mode} />
              </ErrorBoundary>
            </section>
          )}

          {/* Choose Mode Section */}
          {!showCalculator && (
            <section className="mb-12">
              <h2 className="text-2xl font-normal text-black mb-6">{t('chooseModeHeading')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/hourly-to-salary"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">{t('converterTitle')}</h3>
                  <p className="text-sm text-black opacity-70 mb-4">{t('converterBody')}</p>
                  <span className="text-sm text-black opacity-70 underline">
                    {t('converterCta')}
                  </span>
                </Link>
                <Link
                  href="/salary-calculator?mode=hourly"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">{t('hourlyTitle')}</h3>
                  <p className="text-sm text-black opacity-70 mb-4">{t('hourlyBody')}</p>
                  <span className="text-sm text-black opacity-70 underline">{t('hourlyCta')}</span>
                </Link>
                <Link
                  href="/salary-calculator?mode=monthly"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">{t('monthlyTitle')}</h3>
                  <p className="text-sm text-black opacity-70 mb-4">{t('monthlyBody')}</p>
                  <span className="text-sm text-black opacity-70 underline">{t('monthlyCta')}</span>
                </Link>
                <Link
                  href="/salary-calculator?mode=yearly"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">{t('yearlyTitle')}</h3>
                  <p className="text-sm text-black opacity-70 mb-4">{t('yearlyBody')}</p>
                  <span className="text-sm text-black opacity-70 underline">{t('yearlyCta')}</span>
                </Link>
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="border-t border-black border-opacity-10 pt-8">
            <h2 className="text-2xl font-normal text-black mb-6">{t('faqHeading')}</h2>
            <FAQAccordion faqs={faqs} />
          </section>
        </div>
      </div>
    </>
  );
}
