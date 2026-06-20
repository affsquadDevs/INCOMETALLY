import { termsOfServiceConfig } from '@/config/terms';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    "The terms and conditions for using IncomeTally's income, salary, and tax calculators.",
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service',
    description:
      "The terms and conditions for using IncomeTally's income, salary, and tax calculators.",
    url: '/terms',
    type: 'website',
  },
};

export default function TermsOfService() {
  const { title, lastUpdated, intro, sections } = termsOfServiceConfig;

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <article className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-black hover:opacity-70 mb-8 transition-opacity text-sm"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">{title}</h1>
          <div className="text-black text-base opacity-70">Last updated: {lastUpdated}</div>
        </header>

        {intro && (
          <div className="mb-10">
            <p className="text-black opacity-80 text-lg leading-relaxed">
              {intro.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                if (part.match(/^https?:\/\//)) {
                  return (
                    <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066FF] hover:underline"
                    >
                      {part}
                    </a>
                  );
                }
                return <span key={index}>{part}</span>;
              })}
            </p>
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-p:opacity-80 prose-a:text-[#0066FF] prose-a:no-underline hover:prose-a:underline prose-strong:text-black prose-ul:text-black prose-ul:opacity-80">
          {sections.map((section, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-2xl font-normal text-black mb-4">{section.title}</h2>
              
              {section.paragraphs.map((paragraph, pIndex) => {
                // Check if paragraph contains a URL
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const hasUrl = urlRegex.test(paragraph);
                
                if (hasUrl) {
                  const parts = paragraph.split(urlRegex);
                  return (
                    <p key={pIndex} className="text-black opacity-80 mb-4 leading-relaxed">
                      {parts.map((part, partIndex) => {
                        if (urlRegex.test(part)) {
                          return (
                            <a
                              key={partIndex}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0066FF] hover:underline"
                            >
                              {part}
                            </a>
                          );
                        }
                        return <span key={partIndex}>{part}</span>;
                      })}
                    </p>
                  );
                }
                
                return (
                  <p key={pIndex} className="text-black opacity-80 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}

              {section.listItems && section.listItems.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-black opacity-80 mb-4 ml-4">
                  {section.listItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}

              {section.paragraphsAfterList && section.paragraphsAfterList.map((paragraph, pIndex) => {
                // Check if paragraph contains a URL
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const hasUrl = urlRegex.test(paragraph);
                
                if (hasUrl) {
                  const parts = paragraph.split(urlRegex);
                  return (
                    <p key={`after-${pIndex}`} className="text-black opacity-80 mb-4 leading-relaxed">
                      {parts.map((part, partIndex) => {
                        if (urlRegex.test(part)) {
                          return (
                            <a
                              key={partIndex}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0066FF] hover:underline"
                            >
                              {part}
                            </a>
                          );
                        }
                        return <span key={partIndex}>{part}</span>;
                      })}
                    </p>
                  );
                }
                
                return (
                  <p key={`after-${pIndex}`} className="text-black opacity-80 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

