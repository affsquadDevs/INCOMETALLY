import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import TypewriterText from '@/components/TypewriterText';
import AnimatedBlock from '@/components/AnimatedBlock';
import FAQAccordion from '@/components/FAQAccordion';
import { generateFAQJsonLd, type FAQ } from '@/lib/seo/faq';
import { countries } from '@/lib/countries';
import { getLocalizedCountry, getLocalizedPillars, getLocalizedGuideBySlug } from '@/lib/content';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: { absolute: t('meta.title') },
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: '/',
      type: 'website',
    },
  };
}

// Universal-tool links (text comes from the message catalog, aligned by index).
const toolHrefs = ['/net-salary-calculator', '/salary-calculator', '/hourly-to-salary'];

// Official-source labels per country (proper nouns; the country name is shown
// from country data and will localize when the content layer lands).
const sourcesByCountry = [
  { code: 'US', sources: 'IRS · SSA' },
  { code: 'UK', sources: 'GOV.UK · HMRC' },
  { code: 'DE', sources: 'Bundesfinanzministerium' },
  { code: 'PL', sources: 'podatki.gov.pl · ZUS' },
  { code: 'FR', sources: 'service-public.gouv.fr · URSSAF' },
  { code: 'ES', sources: 'AEAT · Seguridad Social' },
  { code: 'IT', sources: 'Agenzia delle Entrate · INPS' },
  { code: 'SE', sources: 'Skatteverket' },
  { code: 'PT', sources: 'Portal das Finanças · Segurança Social' },
];

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const countryList = Object.values(countries).map((c) => ({
    ...c,
    displayName: getLocalizedCountry(c.code, locale)?.displayName ?? c.displayName,
  }));
  const pillars = getLocalizedPillars(locale).map((pillar) => {
    const guide = getLocalizedGuideBySlug(pillar.cornerstoneSlug, locale);
    return {
      ...pillar,
      flagshipTitle: guide ? guide.title : pillar.title,
      flagshipHref: `/guides/${pillar.cornerstoneSlug}`,
    };
  });

  const faqs = t.raw('faqs') as FAQ[];
  const steps = t.raw('howItWorks.steps') as { title: string; body: string }[];
  const toolsText = t.raw('calculators.tools') as { title: string; body: string; cta: string }[];
  const standards = t.raw('trust.standards') as string[];
  const highlightWords = t.raw('hero.highlightWords') as string[];

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateFAQJsonLd(faqs) }}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 pt-24 pb-10 lg:pt-28 lg:pb-14">
        <h1 className="text-[44px] sm:text-[60px] lg:text-[76px] xl:text-[84px] font-normal text-black leading-[1.05] mb-5 tracking-[-0.03em]">
          <TypewriterText
            text={t('hero.title')}
            highlightWords={highlightWords}
            highlightColor="#0066FF"
            speed={60}
            showImmediately={true}
          />
        </h1>
        <AnimatedBlock delay={0} animationType="fade-slide" showImmediately={true}>
          <p className="text-lg lg:text-xl text-black mb-6 max-w-3xl leading-relaxed opacity-90">
            {t('hero.subtitle')}
          </p>
        </AnimatedBlock>
        <AnimatedBlock delay={0} animationType="fade-slide" showImmediately={true}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/calculator"
              className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F0]"
            >
              {t('hero.getStarted')}
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/guides"
              className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F0]"
            >
              {t('hero.browseGuides')}
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <p className="text-sm text-black opacity-70 mt-4">{t('hero.trustLine')}</p>
        </AnimatedBlock>
      </section>

      {/* What IncomeTally Does / Who it's for */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <h2 className="text-3xl lg:text-4xl font-normal text-black mb-6 tracking-[-0.02em]">
            {t('about.heading')}
          </h2>
          <div className="text-base lg:text-lg text-black leading-relaxed opacity-90 space-y-5 max-w-3xl">
            <p>
              {t.rich('about.p1', {
                calc: (chunks) => (
                  <Link href="/net-salary-calculator" className="text-[#0066FF] hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
            <p>
              {t.rich('about.p2', {
                gross: (chunks) => (
                  <Link
                    href="/guides/gross-income-vs-net-income"
                    className="text-[#0066FF] hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
                social: (chunks) => (
                  <Link
                    href="/guides/how-income-tax-works"
                    className="text-[#0066FF] hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
          <h3 className="text-xl lg:text-2xl font-normal text-black mt-8 mb-3 tracking-[-0.01em]">
            {t('about.whoHeading')}
          </h3>
          <p className="text-base lg:text-lg text-black leading-relaxed opacity-90 max-w-3xl">
            {t('about.whoBody')}
          </p>
        </AnimatedBlock>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h2 className="text-3xl lg:text-4xl font-normal text-black mb-8 lg:mb-12 tracking-[-0.02em]">
          {t('howItWorks.heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-stretch">
          {steps.map((s, index) => (
            <AnimatedBlock
              key={index}
              delay={index * 150}
              animationType="fade-slide"
              className="h-full"
            >
              <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="text-4xl text-[#0066FF] mb-3 font-normal">{index + 1}</div>
                <h3 className="text-xl font-normal text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black opacity-70 leading-relaxed">{s.body}</p>
              </div>
            </AnimatedBlock>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/calculator"
            className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F0]"
          >
            {t('howItWorks.cta')}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Calculators + 9 countries */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Part A: universal tools */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-normal text-black mb-4 tracking-[-0.02em]">
            {t('calculators.heading')}
          </h2>
          <p className="text-base text-black opacity-70 mb-8 max-w-2xl">{t('calculators.intro')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toolsText.map((tool, index) => (
              <Link
                key={toolHrefs[index]}
                href={toolHrefs[index]}
                className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F0]"
              >
                <h3 className="text-xl font-normal text-black mb-2">{tool.title}</h3>
                <p className="text-sm text-black opacity-70 mb-4 flex-grow">{tool.body}</p>
                <span className="text-sm text-black opacity-70 underline">{tool.cta}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Part B: the 9-country grid (single blue anchor block) */}
        <AnimatedBlock delay={0} animationType="fade-slide">
          <div className="bg-[#0066FF] rounded-lg p-8 lg:p-12">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-normal text-white mb-4 tracking-[-0.02em]">
                {t('countries.heading')}
              </h2>
              <p className="text-lg text-white leading-relaxed max-w-2xl">
                {t('countries.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
              {countryList.map((c, index) => (
                <AnimatedBlock
                  key={c.code}
                  delay={index * 75}
                  animationType="fade-slide"
                  className="h-full"
                >
                  <Link
                    href={`/salary-calculator/${c.code.toLowerCase()}`}
                    className="rounded-lg border border-white p-5 lg:p-6 group hover:bg-white transition-all duration-300 h-full flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0066FF]"
                  >
                    <span className="text-3xl mb-3" aria-hidden="true">
                      {c.flag}
                    </span>
                    <h3 className="text-base lg:text-lg font-normal text-white group-hover:text-black group-focus-visible:text-black transition-colors duration-300 tracking-[-0.01em]">
                      {c.displayName} {t('countries.cardSuffix')}
                    </h3>
                    <p className="text-sm mt-1 text-white group-hover:text-black group-focus-visible:text-black transition-colors duration-300">
                      {t('countries.cardMeta', { currency: c.currency })}
                    </p>
                  </Link>
                </AnimatedBlock>
              ))}
            </div>
            <p className="text-sm text-white mt-6 leading-relaxed">{t('countries.note')}</p>
            <div className="mt-4">
              <Link
                href="/salary-calculator"
                className="text-sm text-white underline hover:opacity-80 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0066FF]"
              >
                {t('countries.seeAll')}
              </Link>
            </div>
          </div>
        </AnimatedBlock>
      </section>

      {/* Guide pillars */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h2 className="text-3xl lg:text-4xl font-normal text-black mb-4 tracking-[-0.02em]">
          {t('pillarsSection.heading')}
        </h2>
        <p className="text-base lg:text-lg text-black opacity-90 mb-8 lg:mb-12 max-w-2xl leading-relaxed">
          {t('pillarsSection.intro')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-stretch">
          {pillars.map((pillar, index) => (
            <AnimatedBlock
              key={pillar.id}
              delay={index * 150}
              animationType="fade-slide"
              className="h-full"
            >
              <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 hover:shadow-lg transition-all h-full flex flex-col">
                <h3 className="text-xl font-normal text-black mb-2">{pillar.title}</h3>
                <p className="text-sm text-black opacity-70 mb-4 flex-grow leading-relaxed">
                  {pillar.description}
                </p>
                <Link
                  href={pillar.flagshipHref}
                  className="text-sm text-[#0066FF] hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  {pillar.flagshipTitle} →
                </Link>
              </div>
            </AnimatedBlock>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/guides"
            className="text-black opacity-70 hover:opacity-100 underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F0]"
          >
            {t('pillarsSection.viewAll')}
          </Link>
        </div>
      </section>

      {/* Trust / official data sources */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <div className="bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-12">
            <p className="text-xs tracking-[0.05em] uppercase opacity-70 mb-3 text-black">
              {t('trust.badge')}
            </p>
            <h2 className="text-3xl lg:text-4xl font-normal text-black mb-6 tracking-[-0.02em]">
              {t('trust.heading')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <p className="text-base text-black opacity-90 leading-relaxed mb-6">
                  {t('trust.body')}
                </p>
                <h3 className="text-lg font-medium text-black mb-3">
                  {t('trust.standardsHeading')}
                </h3>
                <ul className="space-y-2 mb-6">
                  {standards.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-black opacity-80">
                      <span className="text-[#0066FF]">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/about-us"
                  className="text-sm text-[#0066FF] hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  {t('trust.aboutLink')}
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-3">{t('trust.sourcesHeading')}</h3>
                <ul className="space-y-2 text-sm">
                  {sourcesByCountry.map((row) => (
                    <li
                      key={row.code}
                      className="flex justify-between gap-4 border-b border-black border-opacity-5 pb-2"
                    >
                      <span className="text-black">
                        {getLocalizedCountry(row.code, locale)?.displayName ?? row.code}
                      </span>
                      <span className="text-black opacity-70 text-right">{row.sources}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-black opacity-70 mt-3">{t('trust.sourcesNote')}</p>
              </div>
            </div>
          </div>
          <div className="border border-black border-opacity-10 rounded-lg p-6 mt-8">
            <p className="text-sm text-black opacity-70 leading-relaxed">
              <span className="font-medium">{t('trust.disclaimerLabel')}</span>{' '}
              {t('trust.disclaimer')}
            </p>
          </div>
        </AnimatedBlock>
      </section>

      {/* Homepage FAQ */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h2 className="text-3xl lg:text-4xl font-normal text-black mb-8 tracking-[-0.02em]">
          {t('faqHeading')}
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  );
}
