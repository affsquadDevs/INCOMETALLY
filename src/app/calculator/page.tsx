import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';

// Dynamic import - calculator is heavy, load on demand
const SalaryCalculator = dynamic(() => import('@/components/SalaryCalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Salary & Tax Calculator — Estimate Your Net Income',
  description:
    'Free salary tax calculator. Enter your gross income to estimate net pay, income tax, and social contributions for the US, Germany, and the UK in 2026.',
  alternates: { canonical: '/calculator' },
  openGraph: {
    title: 'Salary & Tax Calculator — Estimate Your Net Income',
    description:
      'Free salary tax calculator. Estimate net pay, income tax, and social contributions for the US, Germany, and the UK.',
    url: '/calculator',
    type: 'website',
  },
};

export default function CalculatorPage() {
  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
            Salary &amp; Tax Calculator
          </h1>
          <p className="text-lg text-black opacity-70">
            Estimate your net income (take-home pay) after income tax and social
            contributions. Enter your gross salary, choose your country and pay
            period, and get an instant breakdown for the 2026 tax year.
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-12">
          <ErrorBoundary>
            <SalaryCalculator />
          </ErrorBoundary>
        </div>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-3xl font-normal text-black mb-6">
            How the Calculator Works
          </h2>
          <div className="space-y-4 text-base text-black opacity-90 leading-relaxed">
            <p>
              Our calculator converts your gross income into estimated take-home
              pay using up-to-date tax brackets and social contribution rates for
              each supported country. You can enter income as an hourly rate, a
              monthly salary, or an annual figure, and the calculator annualizes
              it before applying the relevant tax rules.
            </p>
            <p>
              The breakdown separates income tax from social contributions — such
              as Social Security and Medicare in the United States, statutory
              insurance contributions in Germany, and National Insurance in the
              United Kingdom — so you can see exactly where your money goes and
              what your effective tax rate is.
            </p>
            <p>
              Results are estimates for informational and planning purposes only
              and do not account for every individual circumstance, such as state
              and local taxes, tax credits, or benefits in kind. For advice
              specific to your situation, consult a qualified tax professional.
            </p>
          </div>
        </section>

        {/* Related links */}
        <section className="border-t border-black border-opacity-10 pt-8">
          <h2 className="text-xl font-normal text-black mb-4">
            Explore Country-Specific Calculators
          </h2>
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
                href="/salary-calculator/us"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                United States Salary Calculator
              </Link>
            </li>
            <li>
              <Link
                href="/salary-calculator/de"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                Germany Salary Calculator
              </Link>
            </li>
            <li>
              <Link
                href="/salary-calculator/uk"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                United Kingdom Salary Calculator
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
            <li>
              <Link
                href="/guides"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                Salary &amp; Tax Guides
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
