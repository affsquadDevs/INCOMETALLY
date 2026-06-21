import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';
import { countries, getAllCountryCodes } from '@/lib/countries';
import FAQAccordion from '@/components/FAQAccordion';
import { type IncomeMode } from '@/lib/tax/types';
import { getHubFAQs, generateFAQJsonLd } from '@/lib/seo/faq';
import { generateBreadcrumbJsonLd } from '@/lib/seo/breadcrumbs';
import { siteConfig } from '@/config/site';

// Dynamic import for heavy calculator component
// Reduces initial bundle size for hub page
const SalaryCalculator = dynamic(() => import('@/components/SalaryCalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Salary Tax Calculator Hub - Calculate Net Income by Country',
  description:
    'Free salary tax calculators for multiple countries. Calculate your net income after taxes and social contributions in the US, Germany, UK, and more.',
  alternates: {
    canonical: `${siteConfig.domain}/salary-calculator`, // Canonical hub URL
  },
  openGraph: {
    title: 'Salary Tax Calculator Hub - Calculate Net Income by Country',
    description:
      'Free salary tax calculators for multiple countries. Calculate your net income after taxes and social contributions.',
    type: 'website',
    url: `${siteConfig.domain}/salary-calculator`,
  },
  // Ensure this is the canonical page for calculator hub intent
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: {
    mode?: string;
  };
}

export default function SalaryCalculatorHub({ searchParams }: PageProps) {
  const allCountries = getAllCountryCodes().map((code) => countries[code]);
  const mode = searchParams.mode as IncomeMode | undefined;
  const showCalculator = mode && ['hourly', 'monthly', 'yearly'].includes(mode);
  const faqs = getHubFAQs();
  const faqJsonLd = generateFAQJsonLd(faqs);
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.domain },
    { name: 'Salary Calculator Hub', url: `${siteConfig.domain}/salary-calculator` },
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
          {/* Intro */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
              Salary Tax Calculator Hub
            </h1>
            <p className="text-lg text-black opacity-70 mb-6">
              Calculate your net income after taxes and social contributions. Our free calculators
              help you understand how much you&apos;ll take home in different countries, with
              detailed breakdowns of income tax, social security contributions, and other
              deductions.
            </p>
            <p className="text-base text-black opacity-70">
              Select a country below to get started, or choose a calculation mode that fits your
              needs.
            </p>
          </div>

          {/* Country List Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-normal text-black mb-6">Calculate by Country</h2>
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
                  <span className="text-sm text-black opacity-70 underline">Calculate →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Calculator (shown when mode query param is present) */}
          {showCalculator && (
            <section className="mb-12">
              <h2 className="text-2xl font-normal text-black mb-6">
                {mode === 'hourly' && 'Hourly Income Calculator'}
                {mode === 'monthly' && 'Monthly Salary Calculator'}
                {mode === 'yearly' && 'Annual Salary Calculator'}
              </h2>
              <ErrorBoundary>
                <SalaryCalculator initialCountryCode="US" initialYear={2026} initialMode={mode} />
              </ErrorBoundary>
            </section>
          )}

          {/* Choose Mode Section */}
          {!showCalculator && (
            <section className="mb-12">
              <h2 className="text-2xl font-normal text-black mb-6">Choose Calculation Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/hourly-to-salary"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">
                    Hourly to Salary Converter
                  </h3>
                  <p className="text-sm text-black opacity-70 mb-4">
                    Convert your hourly wage to annual, monthly, and weekly salary. Perfect for
                    understanding your total compensation when negotiating or comparing job offers.
                  </p>
                  <span className="text-sm text-black opacity-70 underline">
                    Convert Hourly Rate →
                  </span>
                </Link>
                <Link
                  href="/salary-calculator?mode=hourly"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">Hourly Income Calculator</h3>
                  <p className="text-sm text-black opacity-70 mb-4">
                    Calculate net income when you know your hourly rate. Includes options for custom
                    hours per week and weeks per year to match your work schedule.
                  </p>
                  <span className="text-sm text-black opacity-70 underline">
                    Calculate Hourly →
                  </span>
                </Link>
                <Link
                  href="/salary-calculator?mode=monthly"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">Monthly Salary Calculator</h3>
                  <p className="text-sm text-black opacity-70 mb-4">
                    Calculate your net monthly income after taxes. Ideal for budgeting and
                    understanding your monthly take-home pay.
                  </p>
                  <span className="text-sm text-black opacity-70 underline">
                    Calculate Monthly →
                  </span>
                </Link>
                <Link
                  href="/salary-calculator?mode=yearly"
                  className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-normal text-black mb-2">Annual Salary Calculator</h3>
                  <p className="text-sm text-black opacity-70 mb-4">
                    Calculate your net annual income from your gross yearly salary. See the full
                    breakdown of taxes and deductions for the entire year.
                  </p>
                  <span className="text-sm text-black opacity-70 underline">
                    Calculate Yearly →
                  </span>
                </Link>
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="border-t border-black border-opacity-10 pt-8">
            <h2 className="text-2xl font-normal text-black mb-6">Frequently Asked Questions</h2>
            <FAQAccordion faqs={faqs} />
          </section>
        </div>
      </div>
    </>
  );
}
