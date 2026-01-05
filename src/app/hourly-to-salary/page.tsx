import { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';
import FAQAccordion from '@/components/FAQAccordion';
import { siteConfig } from '@/config/site';

// Dynamic import for calculator - reduces initial page load
const SalaryCalculator = dynamic(
  () => import('@/components/SalaryCalculator'),
  {
    loading: () => <CalculatorSkeleton />,
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: 'Hourly to Salary Converter - Calculate Annual, Monthly & Weekly Income',
  description: 'Convert hourly wage to annual, monthly, and weekly salary. Free calculator with formulas and examples. Perfect for job negotiations and salary comparisons.',
  alternates: {
    canonical: `${siteConfig.domain}/hourly-to-salary`,
  },
  openGraph: {
    title: 'Hourly to Salary Converter - Calculate Annual, Monthly & Weekly Income',
    description: 'Convert hourly wage to annual, monthly, and weekly salary. Free calculator with formulas and examples.',
    type: 'website',
    url: `${siteConfig.domain}/hourly-to-salary`,
  },
};

export default function HourlyToSalaryPage() {
  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
            Hourly to Salary Converter
          </h1>
          <p className="text-lg text-black opacity-70 mb-6">
            Convert your hourly wage to annual, monthly, weekly, and daily salary. Understand your total compensation when negotiating job offers or comparing positions.
          </p>
        </div>

      
        {/* Calculator */}
        <section className="mb-12">
          <h2 className="text-2xl font-normal text-black mb-6">Calculate Your Net Income</h2>
          <p className="text-base text-black opacity-70 mb-6">
            Enter your hourly rate below to calculate your gross and net income. The calculator is pre-set to hourly mode and will show your take-home pay after taxes.
          </p>
          <ErrorBoundary>
            <SalaryCalculator
              initialCountryCode="US"
              initialYear={2026}
              initialMode="hourly"
              initialValue={25}
            />
          </ErrorBoundary>
        </section>
  {/* Conversion Formulas Section */}
  <section className="mb-12">
          <h2 className="text-2xl font-normal text-black mb-6">Conversion Formulas</h2>
          <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8 mb-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Annual Salary from Hourly Rate</h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">
                    Annual Salary = Hourly Rate × Hours per Week × Weeks per Year
                  </code>
                </div>
                <p className="text-sm text-black opacity-70">
                  Standard calculation: Multiply your hourly rate by 40 hours per week and 52 weeks per year.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-3">Monthly Salary</h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">
                    Monthly Salary = Annual Salary ÷ 12
                  </code>
                </div>
                <p className="text-sm text-black opacity-70">
                  Divide annual salary by 12 months. Note: This gives an average monthly amount; actual monthly pay may vary if paid bi-weekly or semi-monthly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-3">Weekly Salary</h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">
                    Weekly Salary = Hourly Rate × Hours per Week
                  </code>
                </div>
                <p className="text-sm text-black opacity-70">
                  Simply multiply your hourly rate by the number of hours you work per week.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-3">Daily Salary</h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">
                    Daily Salary = Hourly Rate × Hours per Day
                  </code>
                </div>
                <p className="text-sm text-black opacity-70">
                  For an 8-hour workday, multiply your hourly rate by 8.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> These formulas calculate gross (pre-tax) income. Use the calculator below to see your net (take-home) pay after taxes and deductions.
            </p>
          </div>
        </section>

        {/* Examples Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-normal text-black mb-6">Examples</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
              <h3 className="text-lg font-medium text-black mb-4">Example 1: $25 per hour, 40 hours/week, 52 weeks/year</h3>
              <div className="space-y-2 text-sm text-black opacity-80">
                <p><strong>Annual Gross:</strong> $25 × 40 × 52 = $52,000</p>
                <p><strong>Monthly Gross:</strong> $52,000 ÷ 12 = $4,333.33</p>
                <p><strong>Weekly Gross:</strong> $25 × 40 = $1,000</p>
                <p><strong>Daily Gross (8 hours):</strong> $25 × 8 = $200</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
              <h3 className="text-lg font-medium text-black mb-4">Example 2: $30 per hour, 35 hours/week, 50 weeks/year</h3>
              <div className="space-y-2 text-sm text-black opacity-80">
                <p><strong>Annual Gross:</strong> $30 × 35 × 50 = $52,500</p>
                <p><strong>Monthly Gross:</strong> $52,500 ÷ 12 = $4,375</p>
                <p><strong>Weekly Gross:</strong> $30 × 35 = $1,050</p>
                <p><strong>Daily Gross (7 hours):</strong> $30 × 7 = $210</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
              <h3 className="text-lg font-medium text-black mb-4">Example 3: $20 per hour, 40 hours/week, 48 weeks/year (with 4 weeks unpaid time off)</h3>
              <div className="space-y-2 text-sm text-black opacity-80">
                <p><strong>Annual Gross:</strong> $20 × 40 × 48 = $38,400</p>
                <p><strong>Monthly Gross:</strong> $38,400 ÷ 12 = $3,200</p>
                <p><strong>Weekly Gross:</strong> $20 × 40 = $800</p>
                <p className="text-xs text-black opacity-60 mt-2">
                  Note: Adjusting weeks per year accounts for unpaid time off, vacation, or seasonal work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-normal text-black mb-6">Frequently Asked Questions</h2>
          <FAQAccordion
            faqs={[
              {
                question: "What's the difference between gross and net salary?",
                answer: "Gross salary is your total earnings before taxes and deductions. Net salary (take-home pay) is what you receive after income tax, social security, and other mandatory deductions are subtracted. The calculator above shows both gross and net amounts.",
              },
              {
                question: "How many weeks should I use in the calculation?",
                answer: "The standard is 52 weeks per year for full-time employees. However, if you have unpaid time off, work seasonally, or take extended leave, adjust accordingly. For example, 2 weeks of unpaid vacation would mean 50 weeks per year.",
              },
              {
                question: "Should I include overtime in my hourly rate?",
                answer: "For accurate annual salary calculations, use your base hourly rate and standard hours. If you regularly work overtime, you can either: (1) calculate base salary separately and add estimated overtime, or (2) use an average hourly rate that accounts for overtime. The calculator allows you to adjust hours per week to reflect your actual schedule.",
              },
              {
                question: "How do I convert salary back to hourly rate?",
                answer: "To convert annual salary to hourly: Hourly Rate = Annual Salary ÷ (Hours per Week × Weeks per Year). For example, $52,000 ÷ (40 × 52) = $25 per hour. Use our calculator in reverse by entering your annual salary and selecting yearly mode.",
              },
              {
                question: "Are these calculations accurate for all countries?",
                answer: (
                  <>
                    The conversion formulas (hourly to annual, monthly, etc.) are universal. However, net income calculations vary by country due to different tax systems. Use the country-specific calculators on our <Link href="/salary-calculator" className="underline">Salary Calculator Hub</Link> for accurate net income estimates.
                  </>
                ),
              },
              {
                question: "What if I work part-time or have irregular hours?",
                answer: "For part-time work, enter your actual hours per week. For irregular hours, calculate an average weekly hours over a longer period (e.g., 3-6 months) and use that. The calculator allows custom hours per week and weeks per year to match any work schedule.",
              },
            ]}
          />
        </section>

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
                href="/salary-calculator/us"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                US Salary Calculator
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
                UK Salary Calculator
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

