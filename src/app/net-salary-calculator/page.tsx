import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Net Salary Calculator - Calculate Your Take-Home Pay',
  description: 'Calculate your net salary after taxes and deductions. Free net income calculator for multiple countries.',
  alternates: {
    canonical: `${siteConfig.domain}/salary-calculator`, // Canonical points to hub
  },
  robots: {
    index: false, // Don't index this page (redirected via middleware)
    follow: true,
  },
  openGraph: {
    title: 'Net Salary Calculator - Calculate Your Take-Home Pay',
    description: 'Calculate your net salary after taxes and deductions. Free net income calculator for multiple countries.',
    type: 'website',
    url: `${siteConfig.domain}/salary-calculator`, // OG URL points to canonical
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
            Calculate your net income (take-home pay) after taxes and social contributions. Our comprehensive salary calculator helps you understand exactly how much you&apos;ll receive after all deductions.
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
            <p>
              Our salary calculator provides detailed breakdowns of:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Gross income (before taxes)</li>
              <li>Income tax calculations</li>
              <li>Social security contributions</li>
              <li>Net income (take-home pay)</li>
              <li>Effective tax rates</li>
            </ul>
            <p className="mt-4">
              Available for multiple countries including the United States, Germany, and the United Kingdom. Select your country to get started with accurate, up-to-date tax calculations for 2026.
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
      </div>
    </div>
  );
}

