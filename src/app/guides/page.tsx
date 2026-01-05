import { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides } from '@/data/guides';

export const metadata: Metadata = {
  title: 'Salary & Tax Guides - Expert Articles on Income Calculations',
  description: 'Comprehensive guides on salary calculations, tax brackets, deductions, and net income. Learn how to calculate take-home pay and understand tax systems.',
  openGraph: {
    title: 'Salary & Tax Guides - Expert Articles on Income Calculations',
    description: 'Comprehensive guides on salary calculations, tax brackets, deductions, and net income.',
    type: 'website',
  },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
            Salary & Tax Guides
          </h1>
          <p className="text-lg text-black opacity-70">
            Expert articles on salary calculations, tax systems, deductions, and understanding your take-home pay.
          </p>
        </div>

        <div className="space-y-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-normal text-black mb-2">
                    {guide.title}
                  </h2>
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
                    {new Date(guide.date).toLocaleDateString('en-US', {
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

        <div className="mt-12 pt-8 border-t border-black border-opacity-10">
          <h2 className="text-2xl font-normal text-black mb-4">Related Resources</h2>
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
        </div>
      </div>
    </div>
  );
}

