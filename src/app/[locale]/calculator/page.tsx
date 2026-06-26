import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';
import { buildAlternates } from '@/i18n/seo';

// Dynamic import - calculator is heavy, load on demand
const SalaryCalculator = dynamic(() => import('@/components/SalaryCalculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false,
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'calcPage' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: buildAlternates(locale, '/calculator'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.ogDescription'),
      url: '/calculator',
      type: 'website',
    },
  };
}

export default async function CalculatorPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('calcPage');

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
            {t('title')}
          </h1>
          <p className="text-lg text-black opacity-70">{t('intro')}</p>
        </div>

        {/* Calculator */}
        <div className="mb-12">
          <ErrorBoundary>
            <SalaryCalculator />
          </ErrorBoundary>
        </div>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-3xl font-normal text-black mb-6">{t('howItWorks.heading')}</h2>
          <div className="space-y-4 text-base text-black opacity-90 leading-relaxed">
            <p>{t('howItWorks.p1')}</p>
            <p>{t('howItWorks.p2')}</p>
            <p>{t('howItWorks.p3')}</p>
          </div>
        </section>

        {/* What's included */}
        <section className="mb-12">
          <h2 className="text-3xl font-normal text-black mb-6">{t('whatsIncluded.heading')}</h2>
          <div className="space-y-4 text-base text-black opacity-90 leading-relaxed">
            <p>{t('whatsIncluded.p1')}</p>
            <ul className="list-disc list-inside space-y-2 opacity-90">
              {(t.raw('whatsIncluded.items') as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p>{t('whatsIncluded.p2')}</p>
          </div>
        </section>

        {/* Related links */}
        <section className="border-t border-black border-opacity-10 pt-8">
          <h2 className="text-xl font-normal text-black mb-4">{t('related.heading')}</h2>
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
            <li>
              <Link
                href="/hourly-to-salary"
                className="text-black opacity-70 hover:opacity-100 underline"
              >
                {t('related.hourly')}
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-black opacity-70 hover:opacity-100 underline">
                {t('related.guides')}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
