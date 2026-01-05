import { siteConfig } from '@/config/site';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FAQAccordion from '@/components/FAQAccordion';

export default function AboutUs() {
  const { aboutUs } = siteConfig;

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <article className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">{aboutUs.title}</h1>
          <div className="text-black text-base opacity-70">Last updated: {aboutUs.lastUpdated}</div>
        </header>

        <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-p:opacity-80 prose-a:text-[#0066FF] prose-a:no-underline hover:prose-a:underline prose-strong:text-black prose-code:text-[#0066FF] prose-code:bg-[#F5F5F0] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black prose-pre:text-white mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutUs.content}</ReactMarkdown>
        </div>

        {/* FAQ Section */}
        {aboutUs.faq && (
          <div className="mt-16 pt-16 border-t border-black border-opacity-10">
            <div className="bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black mb-12 tracking-[-0.02em]">{aboutUs.faq.title}</h2>
              <FAQAccordion faqs={aboutUs.faq.items} />
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
