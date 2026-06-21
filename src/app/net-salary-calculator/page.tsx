import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Net Salary Calculator - Calculate Your Take-Home Pay',
  description:
    'Free net salary calculator. Work out your take-home pay after income tax and social contributions for the US, Germany, and the UK.',
  alternates: {
    canonical: `${siteConfig.domain}/net-salary-calculator`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Net Salary Calculator - Calculate Your Take-Home Pay',
    description:
      'Free net salary calculator. Work out your take-home pay after income tax and social contributions for the US, Germany, and the UK.',
    type: 'website',
    url: `${siteConfig.domain}/net-salary-calculator`,
  },
};

export default function NetSalaryCalculatorPage() {
  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-normal text-black mb-4 tracking-[-0.02em]">
            Net Salary Calculator
          </h1>
          <p className="text-lg text-black opacity-70 mb-8 max-w-2xl mx-auto">
            Calculate your net income (take-home pay) after taxes and social contributions. Our
            comprehensive salary calculator helps you understand exactly how much you&apos;ll
            receive after all deductions.
          </p>

          <div className="mb-8">
            <Link
              href="/salary-calculator"
              className="inline-block px-6 py-3 bg-black text-white rounded-sm hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              Go to Salary Calculator Hub →
            </Link>
          </div>

          <div className="text-left max-w-2xl mx-auto space-y-4 text-base text-black opacity-70">
            <p>Our salary calculator provides detailed breakdowns of:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Gross income (before taxes)</li>
              <li>Income tax calculations</li>
              <li>Social security contributions</li>
              <li>Net income (take-home pay)</li>
              <li>Effective tax rates</li>
            </ul>
            <p className="mt-4">
              Available for multiple countries including the United States, Germany, and the United
              Kingdom. Select your country to get started with accurate, up-to-date tax calculations
              for 2026.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-black border-opacity-10">
            <p className="text-sm text-black opacity-60 mb-4">
              You can also access our specialized calculators:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/hourly-to-salary"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                Hourly to Salary Converter
              </Link>
              <span className="text-black opacity-30">•</span>
              <Link
                href="/salary-calculator/us"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                US Calculator
              </Link>
              <span className="text-black opacity-30">•</span>
              <Link
                href="/salary-calculator/de"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                Germany Calculator
              </Link>
              <span className="text-black opacity-30">•</span>
              <Link
                href="/salary-calculator/uk"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                UK Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Net salary explainer */}
        <section className="mt-12 bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-12 text-left">
          <h2 className="text-2xl md:text-3xl font-normal text-black mb-4">What Is Net Salary?</h2>
          <div className="space-y-4 text-base text-black opacity-80 leading-relaxed">
            <p>
              Your <strong>net salary</strong> — often called take-home pay — is the amount that
              actually reaches your bank account after mandatory deductions are removed from your
              gross salary. Gross salary is the headline figure in your employment contract; net
              salary is what you can budget and spend.
            </p>
            <p>
              The gap between the two is made up of <strong>income tax</strong> and{' '}
              <strong>social contributions</strong>. Income tax is usually progressive, meaning
              higher portions of your income are taxed at higher rates. Social contributions fund
              programs such as state pensions, healthcare, and unemployment insurance, and the exact
              rates depend on where you live.
            </p>
            <p>
              Because every country calculates these deductions differently, the same gross salary
              can produce very different take-home pay in the United States, Germany, or the United
              Kingdom. Choose your country above to see a detailed, country-specific breakdown for
              the 2026 tax year.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
