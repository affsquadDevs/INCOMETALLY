import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'netPage' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${siteConfig.domain}/net-salary-calculator`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteConfig.domain}/net-salary-calculator`,
    },
  };
}

export default async function NetSalaryCalculatorPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('netPage');

  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-normal text-black mb-4 tracking-[-0.02em]">
            {t('title')}
          </h1>
          <p className="text-lg text-black opacity-70 mb-8 max-w-2xl mx-auto">{t('intro')}</p>

          <div className="mb-8">
            <Link
              href="/salary-calculator"
              className="inline-block px-6 py-3 bg-black text-white rounded-sm hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              {t('cta')}
            </Link>
          </div>

          <div className="text-left max-w-2xl mx-auto space-y-4 text-base text-black opacity-70">
            <p>{t('breakdownIntro')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('breakdown.gross')}</li>
              <li>{t('breakdown.incomeTax')}</li>
              <li>{t('breakdown.social')}</li>
              <li>{t('breakdown.net')}</li>
              <li>{t('breakdown.effectiveRate')}</li>
            </ul>
            <p className="mt-4">{t('availability')}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-black border-opacity-10">
            <p className="text-sm text-black opacity-60 mb-4">{t('specialized')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/hourly-to-salary"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                {t('links.hourly')}
              </Link>
              <span className="text-black opacity-30">•</span>
              <Link
                href="/salary-calculator/us"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                {t('links.us')}
              </Link>
              <span className="text-black opacity-30">•</span>
              <Link
                href="/salary-calculator/de"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                {t('links.de')}
              </Link>
              <span className="text-black opacity-30">•</span>
              <Link
                href="/salary-calculator/uk"
                className="text-sm text-black opacity-70 hover:opacity-100 underline"
              >
                {t('links.uk')}
              </Link>
            </div>
          </div>
        </div>

        {/* Net salary explainer */}
        <section className="mt-12 bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-12 text-left">
          <h2 className="text-2xl md:text-3xl font-normal text-black mb-4">
            {t('explainer.heading')}
          </h2>
          <div className="space-y-4 text-base text-black opacity-80 leading-relaxed">
            <p>
              {t.rich('explainer.p1', {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich('explainer.p2', {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>{t('explainer.p3')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
