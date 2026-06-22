import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';
import FAQAccordion, { type FAQ } from '@/components/FAQAccordion';
import { siteConfig } from '@/config/site';

// Dynamic import for calculator - reduces initial page load
const SalaryCalculator = dynamic(() => import('@/components/SalaryCalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false,
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hourlyPage' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${siteConfig.domain}/hourly-to-salary`,
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.ogDescription'),
      type: 'website',
      url: `${siteConfig.domain}/hourly-to-salary`,
    },
  };
}

export default async function HourlyToSalaryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('hourlyPage');

  // First four FAQ answers are plain text; the fifth contains an inline link
  // (rendered via t.rich) and the sixth follows it, so they are appended here
  // to keep the original ordering.
  const faqs: FAQ[] = [
    ...(t.raw('faq.items') as { question: string; answer: string }[]),
    {
      question: t('faq.countriesQuestion'),
      answer: t.rich('faq.countriesAnswer', {
        link: (chunks) => (
          <Link href="/salary-calculator" className="underline">
            {chunks}
          </Link>
        ),
      }),
    },
    {
      question: t('faq.partTimeQuestion'),
      answer: t('faq.partTimeAnswer'),
    },
  ];

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
            {t('title')}
          </h1>
          <p className="text-lg text-black opacity-70 mb-6">{t('intro')}</p>
        </div>

        {/* Calculator */}
        <section className="mb-12">
          <h2 className="text-2xl font-normal text-black mb-6">{t('calc.heading')}</h2>
          <p className="text-base text-black opacity-70 mb-6">{t('calc.intro')}</p>
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
          <h2 className="text-2xl font-normal text-black mb-6">{t('formulas.heading')}</h2>
          <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8 mb-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-3">
                  {t('formulas.annual.title')}
                </h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">{t('formulas.annual.code')}</code>
                </div>
                <p className="text-sm text-black opacity-70">{t('formulas.annual.note')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-3">
                  {t('formulas.monthly.title')}
                </h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">{t('formulas.monthly.code')}</code>
                </div>
                <p className="text-sm text-black opacity-70">{t('formulas.monthly.note')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-3">
                  {t('formulas.weekly.title')}
                </h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">{t('formulas.weekly.code')}</code>
                </div>
                <p className="text-sm text-black opacity-70">{t('formulas.weekly.note')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-3">{t('formulas.daily.title')}</h3>
                <div className="bg-[#F5F5F0] rounded p-4 mb-2">
                  <code className="text-sm text-black">{t('formulas.daily.code')}</code>
                </div>
                <p className="text-sm text-black opacity-70">{t('formulas.daily.note')}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <p className="text-sm text-amber-900">
              {t.rich('formulas.grossNote', {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </section>

        {/* Examples Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-normal text-black mb-6">{t('examples.heading')}</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
              <h3 className="text-lg font-medium text-black mb-4">{t('examples.ex1.title')}</h3>
              <div className="space-y-2 text-sm text-black opacity-80">
                <p>{t.rich('examples.ex1.annual', { b: (chunks) => <strong>{chunks}</strong> })}</p>
                <p>
                  {t.rich('examples.ex1.monthly', { b: (chunks) => <strong>{chunks}</strong> })}
                </p>
                <p>{t.rich('examples.ex1.weekly', { b: (chunks) => <strong>{chunks}</strong> })}</p>
                <p>{t.rich('examples.ex1.daily', { b: (chunks) => <strong>{chunks}</strong> })}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
              <h3 className="text-lg font-medium text-black mb-4">{t('examples.ex2.title')}</h3>
              <div className="space-y-2 text-sm text-black opacity-80">
                <p>{t.rich('examples.ex2.annual', { b: (chunks) => <strong>{chunks}</strong> })}</p>
                <p>
                  {t.rich('examples.ex2.monthly', { b: (chunks) => <strong>{chunks}</strong> })}
                </p>
                <p>{t.rich('examples.ex2.weekly', { b: (chunks) => <strong>{chunks}</strong> })}</p>
                <p>{t.rich('examples.ex2.daily', { b: (chunks) => <strong>{chunks}</strong> })}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-black border-opacity-10 p-6">
              <h3 className="text-lg font-medium text-black mb-4">{t('examples.ex3.title')}</h3>
              <div className="space-y-2 text-sm text-black opacity-80">
                <p>{t.rich('examples.ex3.annual', { b: (chunks) => <strong>{chunks}</strong> })}</p>
                <p>
                  {t.rich('examples.ex3.monthly', { b: (chunks) => <strong>{chunks}</strong> })}
                </p>
                <p>{t.rich('examples.ex3.weekly', { b: (chunks) => <strong>{chunks}</strong> })}</p>
                <p className="text-xs text-black opacity-60 mt-2">{t('examples.ex3.note')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-normal text-black mb-6">{t('faq.heading')}</h2>
          <FAQAccordion faqs={faqs} />
        </section>

        {/* Related Links */}
        <section className="border-t border-black border-opacity-10 pt-8">
          <h3 className="text-xl font-normal text-black mb-4">{t('related.heading')}</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/salary-calculator"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                {t('related.hub')}
              </Link>
            </li>
            <li>
              <Link
                href="/salary-calculator/us"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                {t('related.us')}
              </Link>
            </li>
            <li>
              <Link
                href="/salary-calculator/de"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                {t('related.de')}
              </Link>
            </li>
            <li>
              <Link
                href="/salary-calculator/uk"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                {t('related.uk')}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
