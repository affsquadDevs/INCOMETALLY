import Link from 'next/link';
import type { Metadata } from 'next';
import TypewriterText from '@/components/TypewriterText';
import AnimatedBlock from '@/components/AnimatedBlock';
import FAQAccordion from '@/components/FAQAccordion';
import { generateFAQJsonLd, type FAQ } from '@/lib/seo/faq';
import { countries } from '@/lib/countries';
import { getAllPillars } from '@/data/pillars';
import { getGuideBySlug } from '@/data/guides';

export const metadata: Metadata = {
  title: {
    absolute: 'Net Salary Calculator — Take-Home Pay After Tax for 9 Countries | IncomeTally',
  },
  description:
    'Calculate your net salary after income tax and social contributions. Free, no signup, country-specific estimates for the 2026 tax year across the US, Germany, UK, Poland, France, Spain, Italy, Sweden, and Portugal.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Net Salary Calculator — Take-Home Pay After Tax for 9 Countries | IncomeTally',
    description:
      'Calculate your net salary after income tax and social contributions. Free, no signup, country-specific estimates for the 2026 tax year across 9 countries.',
    url: '/',
    type: 'website',
  },
};

const homeFaqs: FAQ[] = [
  {
    question: 'Is IncomeTally free to use?',
    answer:
      "Yes. Every calculator and guide on IncomeTally is free, and you don't need to create an account. Your inputs are processed in your browser and are not stored on our servers.",
  },
  {
    question: 'Which countries and tax year does the calculator cover?',
    answer:
      'IncomeTally covers nine countries — the United States, Germany, the United Kingdom, Poland, France, Spain, Italy, Sweden, and Portugal — using 2026 income-tax and social-contribution rules. The applicable tax year is shown on each calculator.',
  },
  {
    question: "What's the difference between gross and net salary?",
    answer:
      'Gross salary is your total pay before any deductions. Net salary — your take-home pay — is what remains after income tax and mandatory social contributions are subtracted. IncomeTally shows the full breakdown so you can see exactly what is deducted and why.',
  },
  {
    question: 'How accurate are the results?',
    answer:
      'The calculators use official 2026 brackets, allowances, and contribution rates, but they are estimates. Real take-home pay can vary with personal circumstances such as additional allowances, regional rules, filing status, benefits, and one-off deductions. Treat the results as a well-sourced estimate, not a tax filing.',
  },
  {
    question: 'Can I convert between hourly, monthly, and yearly pay?',
    answer:
      'Yes. Enter your pay in any of those periods and the calculator converts it across all of them, then shows the take-home equivalent. Our Hourly to Salary tool focuses specifically on wage conversions if that is all you need.',
  },
  {
    question: 'Where do your tax figures come from, and does IncomeTally give financial advice?',
    answer:
      "Our figures come from each country's official tax and social-security authorities, such as the IRS and SSA, HMRC, and the German Bundesfinanzministerium, and each country page links the specific sources we used. IncomeTally is an informational tool only: it does not provide financial, tax, or legal advice and is not affiliated with any government or tax authority. For decisions about your taxes or finances, consult a qualified professional.",
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Choose your country',
    body: 'Pick one of nine supported countries so the calculator loads the correct 2026 tax brackets, allowances, and social contribution rates.',
  },
  {
    step: '2',
    title: 'Enter your pay',
    body: 'Type in your gross income as an hourly, monthly, or yearly figure. The calculator converts between pay periods for you, and you can set options like filing status or region where they apply.',
  },
  {
    step: '3',
    title: 'See your breakdown',
    body: 'Get your estimated net pay alongside a line-by-line breakdown of income tax and social contributions, plus your marginal and effective rates.',
  },
];

const tools = [
  {
    title: 'Net Salary Calculator',
    body: 'Convert any gross salary into estimated take-home pay with a full tax and contributions breakdown.',
    href: '/net-salary-calculator',
    cta: 'Calculate net pay →',
  },
  {
    title: 'Salary Calculator Hub',
    body: 'Start from your country and explore 2026 tax rules, brackets, and social contributions.',
    href: '/salary-calculator',
    cta: 'Browse by country →',
  },
  {
    title: 'Hourly to Salary',
    body: 'Turn an hourly rate into weekly, monthly, and annual income — then see it after tax.',
    href: '/hourly-to-salary',
    cta: 'Convert hourly rate →',
  },
];

const sourcesByCountry = [
  { country: 'United States', sources: 'IRS · SSA' },
  { country: 'United Kingdom', sources: 'GOV.UK · HMRC' },
  { country: 'Germany', sources: 'Bundesfinanzministerium' },
  { country: 'Poland', sources: 'podatki.gov.pl · ZUS' },
  { country: 'France', sources: 'service-public.gouv.fr · URSSAF' },
  { country: 'Spain', sources: 'AEAT · Seguridad Social' },
  { country: 'Italy', sources: 'Agenzia delle Entrate · INPS' },
  { country: 'Sweden', sources: 'Skatteverket' },
  { country: 'Portugal', sources: 'Portal das Finanças · Segurança Social' },
];

const standards = [
  'Official sources',
  'Plain language',
  'Reviewed annually',
  'Estimates, not advice',
];

export default function Home() {
  const countryList = Object.values(countries);
  const pillars = getAllPillars().map((pillar) => {
    const guide = getGuideBySlug(pillar.cornerstoneSlug);
    return {
      ...pillar,
      flagshipTitle: guide ? guide.title : pillar.title,
      flagshipHref: `/guides/${pillar.cornerstoneSlug}`,
    };
  });

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateFAQJsonLd(homeFaqs) }}
      />

      {/* Hero */}
      <section className="max-w-[1920px] mx-auto px-4 lg:px-12 pt-24 pb-16 lg:pt-32 lg:pb-28">
        <div className="max-w-[1200px]">
          <h1 className="text-[56px] sm:text-[72px] lg:text-[96px] xl:text-[112px] font-normal text-black leading-[1.05] mb-6 lg:mb-8 tracking-[-0.03em]">
            <TypewriterText
              text="Free Net Salary Calculator"
              highlightWords={['Net', 'Salary', 'Calculator']}
              highlightColor="#0066FF"
              speed={60}
              showImmediately={true}
            />
          </h1>
          <AnimatedBlock delay={0} animationType="fade-slide" showImmediately={true}>
            <p className="text-lg lg:text-xl text-black mb-8 lg:mb-10 max-w-[640px] leading-relaxed opacity-90">
              {
                'Enter your gross pay and see your estimated take-home pay after income tax and social contributions — for the 2026 tax year, across 9 countries. No signup, and your inputs stay in your browser.'
              }
            </p>
          </AnimatedBlock>
          <AnimatedBlock delay={0} animationType="fade-slide" showImmediately={true}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0]"
              >
                Get Started
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
                className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0]"
              >
                Browse Guides
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
            <p className="text-sm text-black opacity-70 mt-4">
              Free · No signup · Your inputs stay in your browser.
            </p>
          </AnimatedBlock>
        </div>
      </section>

      {/* What IncomeTally Does / Who it's for */}
      <section className="max-w-4xl mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <h2 className="text-3xl lg:text-4xl font-normal text-black mb-6 tracking-[-0.02em]">
            What IncomeTally Does
          </h2>
          <div className="text-base lg:text-lg text-black leading-relaxed opacity-90 space-y-5">
            <p>
              {'IncomeTally is a free, browser-based '}
              <Link href="/net-salary-calculator" className="text-[#0066FF] hover:underline">
                net salary calculator
              </Link>
              {
                " that turns a gross salary into an estimate of your net, take-home pay. You enter what you earn — hourly, monthly, or yearly — choose your country, and we apply that country's 2026 income-tax brackets and mandatory social contributions to show what actually lands in your account. With JavaScript enabled, the calculation runs in your browser and your income figures aren't sent to our servers — only your country and the tax year are requested to load the right rates. You don't need to create an account."
              }
            </p>
            <p>
              {'The gap between your '}
              <Link
                href="/guides/gross-income-vs-net-income"
                className="text-[#0066FF] hover:underline"
              >
                gross salary and your net pay
              </Link>
              {
                ' is rarely obvious. Progressive tax systems apply higher rates only to income above each bracket threshold, so your marginal rate — the rate on your last euro or dollar earned — is almost always higher than your effective rate, the share of your whole salary that goes to tax. On top of income tax, most countries deduct '
              }
              <Link href="/guides/how-income-tax-works" className="text-[#0066FF] hover:underline">
                social contributions
              </Link>
              {
                ' for pensions, health, and unemployment cover. IncomeTally separates these line by line, so you see where your money goes, not just the final total.'
              }
            </p>
          </div>
          <h3 className="text-xl lg:text-2xl font-normal text-black mt-8 mb-3 tracking-[-0.01em]">
            {"Who it's for"}
          </h3>
          <p className="text-base lg:text-lg text-black leading-relaxed opacity-90">
            {
              "It's built for employees checking whether a payslip looks right, job-seekers comparing two offers in real take-home terms, freelancers estimating what to set aside, and anyone weighing a move between countries. If you've ever wondered why a raise felt smaller than the headline number, this is the tool that explains it."
            }
          </p>
        </AnimatedBlock>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <h2 className="text-3xl lg:text-4xl font-normal text-black mb-8 lg:mb-12 tracking-[-0.02em] text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-stretch">
          {howItWorks.map((s, index) => (
            <AnimatedBlock
              key={s.step}
              delay={index * 150}
              animationType="fade-slide"
              className="h-full"
            >
              <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="text-4xl text-[#0066FF] mb-3 font-normal">{s.step}</div>
                <h3 className="text-xl font-normal text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black opacity-70 leading-relaxed">{s.body}</p>
              </div>
            </AnimatedBlock>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/calculator"
            className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0]"
          >
            Open the Calculator
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
      <section className="max-w-[1920px] mx-auto px-4 lg:px-12 py-12 lg:py-16">
        {/* Part A: universal tools */}
        <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-normal text-black mb-4 tracking-[-0.02em] text-center">
            Calculators
          </h2>
          <p className="text-base text-black opacity-70 mb-8 max-w-2xl mx-auto text-center">
            Start with a general tool, or jump straight to your country below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg flex flex-col"
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
          <div className="bg-[#0066FF] rounded-lg p-8 lg:p-16">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-normal text-white mb-4 tracking-[-0.02em]">
                Salary Calculators by Country
              </h2>
              <p className="text-lg text-white leading-relaxed max-w-2xl">
                2026 tax-year estimates using each country&apos;s official income-tax brackets and
                social contributions.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
              {countryList.map((c, index) => (
                <AnimatedBlock
                  key={c.code}
                  delay={index * 75}
                  animationType="fade-slide"
                  className="h-full"
                >
                  <Link
                    href={`/salary-calculator/${c.code.toLowerCase()}`}
                    className="rounded-lg border border-white p-5 lg:p-6 group hover:bg-white transition-all duration-300 h-full flex flex-col cursor-pointer"
                  >
                    <span className="text-3xl mb-3" aria-hidden="true">
                      {c.flag}
                    </span>
                    <h3 className="text-base lg:text-lg font-normal text-white group-hover:text-black transition-colors duration-300 tracking-[-0.01em]">
                      {c.displayName} Salary Calculator
                    </h3>
                  </Link>
                </AnimatedBlock>
              ))}
            </div>
            <p className="text-sm text-white mt-6 leading-relaxed">
              Most calculators let you set options like filing status or region where they apply;
              the available options differ by country. See each country page for the inputs it
              offers and its official sources.
            </p>
            <div className="mt-4">
              <Link
                href="/salary-calculator"
                className="text-sm text-white underline hover:opacity-80"
              >
                See all calculators →
              </Link>
            </div>
          </div>
        </AnimatedBlock>
      </section>

      {/* Guide pillars */}
      <section className="max-w-4xl mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <h2 className="text-3xl lg:text-4xl font-normal text-black mb-4 tracking-[-0.02em]">
          Learn How Your Pay Is Calculated
        </h2>
        <p className="text-base lg:text-lg text-black opacity-90 mb-8 lg:mb-12 max-w-2xl leading-relaxed">
          Plain-language guides on income, tax, and salary planning — written and reviewed in-house,
          with sources and last-updated dates.
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
                <Link href={pillar.flagshipHref} className="text-sm text-[#0066FF] hover:underline">
                  {pillar.flagshipTitle} →
                </Link>
              </div>
            </AnimatedBlock>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/guides" className="text-black opacity-70 hover:opacity-100 underline">
            View all guides →
          </Link>
        </div>
      </section>

      {/* Trust / official data sources */}
      <section className="max-w-4xl mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <div className="bg-white rounded-lg border border-black border-opacity-10 p-8 lg:p-16">
            <p className="text-xs tracking-[0.05em] uppercase opacity-70 mb-3 text-black">
              Data current for the 2026 tax year · Last reviewed June 2026
            </p>
            <h2 className="text-3xl lg:text-4xl font-normal text-black mb-6 tracking-[-0.02em]">
              Where Our Numbers Come From
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <p className="text-base text-black opacity-90 leading-relaxed mb-6">
                  {
                    "IncomeTally's calculators and guides are maintained by the IncomeTally Editorial Team. We build each country's tax logic from publicly available figures published by official tax and social-security authorities, explain the concepts in plain language with worked examples, and review the data against each year's official rates. Every country calculator shows its specific sources and the tax year it covers."
                  }
                </p>
                <h3 className="text-lg font-medium text-black mb-3">Our standards</h3>
                <ul className="space-y-2 mb-6">
                  {standards.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-black opacity-80">
                      <span className="text-[#0066FF]">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/about-us" className="text-sm text-[#0066FF] hover:underline">
                  Read about us and our editorial standards →
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Official sources by country</h3>
                <ul className="space-y-2 text-sm">
                  {sourcesByCountry.map((row) => (
                    <li
                      key={row.country}
                      className="flex justify-between gap-4 border-b border-black border-opacity-5 pb-2"
                    >
                      <span className="text-black">{row.country}</span>
                      <span className="text-black opacity-70 text-right">{row.sources}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-black opacity-70 mt-3">
                  Each country page links the specific sources we used for its figures.
                </p>
              </div>
            </div>
          </div>
          <div className="border border-black border-opacity-10 rounded-lg p-6 mt-8">
            <p className="text-sm text-black opacity-70 leading-relaxed">
              <span className="font-medium">Estimates, not advice.</span> IncomeTally provides
              income and tax calculators for informational and educational purposes only. Results
              are estimates and may not reflect your actual tax obligations or financial outcomes.
              This website is not affiliated with any government or tax authority and does not
              provide financial, tax, or legal advice. Always consult a qualified professional for
              personalized guidance.
            </p>
          </div>
        </AnimatedBlock>
      </section>

      {/* Homepage FAQ */}
      <section className="max-w-4xl mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <h2 className="text-3xl lg:text-4xl font-normal text-black mb-8 tracking-[-0.02em]">
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={homeFaqs} />
      </section>
    </div>
  );
}
