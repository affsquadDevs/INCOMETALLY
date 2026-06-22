import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';
import ExampleCalculation from '@/components/ExampleCalculation';
import TaxDisclaimer from '@/components/TaxDisclaimer';
import FAQAccordion from '@/components/FAQAccordion';
import { getOtherCountries } from '@/lib/countries';
import { getLocalizedCountry, getLocalizedCountryFAQs } from '@/lib/content';
import { getTaxTable } from '@/lib/tax';
import { generateFAQJsonLd } from '@/lib/seo/faq';
import { generateBreadcrumbJsonLd } from '@/lib/seo/breadcrumbs';
import { siteConfig } from '@/config/site';
import { buildAlternates } from '@/i18n/seo';
import DataSources from '@/components/DataSources';

// Dynamic import for heavy calculator component
const SalaryCalculator = dynamic(() => import('@/components/SalaryCalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false, // Calculator requires client-side hydration for localStorage
});

interface PageProps {
  params: {
    locale: string;
    country: string;
  };
}

// Generate static params for SSG
export async function generateStaticParams() {
  return [
    { country: 'us' },
    { country: 'de' },
    { country: 'uk' },
    { country: 'pl' },
    { country: 'fr' },
    { country: 'es' },
    { country: 'it' },
    { country: 'se' },
    { country: 'pt' },
  ];
}

// Generate metadata for each country
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = getLocalizedCountry(params.country, params.locale);

  if (!country) {
    return {
      title: 'Country Not Found',
    };
  }

  const url = `${siteConfig.domain}/salary-calculator/${params.country.toLowerCase()}`;

  return {
    title: country.title,
    description: country.description,
    alternates: buildAlternates(
      params.locale,
      `/salary-calculator/${params.country.toLowerCase()}`
    ),
    openGraph: {
      title: country.title,
      description: country.description,
      type: 'website',
      url,
    },
  };
}

// Get tax data for example calculation
function getTaxData(countryCode: string, year: number) {
  try {
    return getTaxTable(countryCode, year);
  } catch (error) {
    console.error('Failed to load tax data:', error);
    return null;
  }
}

export default async function CountryCalculatorPage({ params }: PageProps) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('country');

  const country = getLocalizedCountry(params.country, locale);

  if (!country) {
    notFound();
  }

  const taxData = getTaxData(country.code, 2026);
  const otherCountries = getOtherCountries(country.code)
    .slice(0, 3)
    .map((other) => getLocalizedCountry(other.code, locale) ?? other);
  const faqs = getLocalizedCountryFAQs(country.code, locale);
  const faqJsonLd = generateFAQJsonLd(faqs);
  const url = `${siteConfig.domain}/salary-calculator/${params.country.toLowerCase()}`;
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.domain },
    { name: 'Salary Calculator Hub', url: `${siteConfig.domain}/salary-calculator` },
    { name: `${country.displayName} Calculator`, url },
  ];

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
              {country.flag} {country.displayName} {t('h1Suffix')}
            </h1>
            <p className="text-lg text-black opacity-70 mb-6">{country.description}</p>

            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/salary-calculator"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                {t('allCalculators')}
              </Link>
              <span className="text-black opacity-30">|</span>
              <Link
                href="/hourly-to-salary"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                {t('hourlyConverter')}
              </Link>
              {otherCountries.length > 0 && (
                <>
                  <span className="text-black opacity-30">|</span>
                  <span className="text-sm text-black opacity-70">{t('otherCountries')}</span>
                  {otherCountries.map((other, index) => (
                    <span key={other.code}>
                      {index > 0 && <span className="text-black opacity-30 mx-1">·</span>}
                      <Link
                        href={`/salary-calculator/${other.code.toLowerCase()}`}
                        className="text-sm text-black opacity-70 hover:opacity-100 underline"
                      >
                        {other.displayName}
                      </Link>
                    </span>
                  ))}
                </>
              )}
            </nav>
          </div>

          {/* Calculator */}
          <div className="mb-12">
            <ErrorBoundary>
              <SalaryCalculator
                initialCountryCode={country.code}
                initialYear={2026}
                initialMode={country.exampleMode}
                initialValue={country.exampleGross}
                hideCountrySelect={true}
              />
            </ErrorBoundary>
          </div>

          {/* How Salary Taxes Work Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-normal text-black mb-6">
              {t('howItWorksHeading', { country: country.displayName })}
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="text-black opacity-90 leading-relaxed whitespace-pre-line">
                {country.taxExplanation}
              </div>
            </div>
          </section>

          {/* Example Calculation */}
          {taxData && (
            <section className="mb-12">
              <ExampleCalculation country={country} taxData={taxData} />
            </section>
          )}

          {/* Disclaimer Section */}
          <section className="mb-8">
            <TaxDisclaimer countryCode={country.code} />
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-normal text-black mb-6">{t('faqHeading')}</h2>
            <FAQAccordion faqs={faqs} />
          </section>

          {/* Data Sources */}
          <DataSources countryCode={country.code} countryName={country.displayName} />

          {/* Additional Links */}
          <section className="border-t border-black border-opacity-10 pt-8">
            <h3 className="text-xl font-normal text-black mb-4">{t('relatedHeading')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/salary-calculator"
                  className="text-black opacity-70 hover:opacity-100 underline"
                >
                  {t('relatedHub')}
                </Link>
              </li>
              <li>
                <Link
                  href="/hourly-to-salary"
                  className="text-black opacity-70 hover:opacity-100 underline"
                >
                  {t('hourlyConverter')}
                </Link>
              </li>
              {otherCountries.map((other) => (
                <li key={other.code}>
                  <Link
                    href={`/salary-calculator/${other.code.toLowerCase()}`}
                    className="text-black opacity-70 hover:opacity-100 underline"
                  >
                    {other.displayName} {t('calculatorSuffix')}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
