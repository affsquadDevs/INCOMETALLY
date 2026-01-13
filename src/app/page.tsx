import Link from 'next/link';
import { siteConfig } from '@/config/site';
import TypewriterText from '@/components/TypewriterText';
import AnimatedBlock from '@/components/AnimatedBlock';
import MetricCard from '@/components/MetricCard';

export default function Home() {
  const { home } = siteConfig;

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      {/* Hero Section */}
      <section className="max-w-[1920px] mx-auto px-4 lg:px-12 pt-24 pb-16 lg:pt-32 lg:pb-32">
        <div className="max-w-[1200px] relative">
          <div>
            <h1 className="text-[72px] lg:text-[96px] xl:text-[120px] font-normal text-black leading-[1.05] mb-6 lg:mb-10 tracking-[-0.03em]">
              <TypewriterText
                text={home.hero.title}
                highlightWords={['Salary', 'Calculator']}
                highlightColor="#0066FF"
                speed={60}
                showImmediately={true}
              />
            </h1>
            <AnimatedBlock delay={0} animationType="fade-slide" showImmediately={true}>
              <p className="text-lg lg:text-xl text-black mb-8 lg:mb-12 max-w-[600px] leading-relaxed opacity-90">
                {home.hero.subtitle}
              </p>
            </AnimatedBlock>
            <AnimatedBlock delay={0} animationType="fade-slide" showImmediately={true}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/calculator"
                  className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0]"
                >
                  {home.hero.ctaPrimary}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="/salary-calculator"
                  className="px-8 py-3 bg-transparent text-black rounded-sm font-normal hover:opacity-70 transition-all duration-300 border border-black inline-flex items-center justify-center gap-2 text-sm tracking-wide hover:bg-black hover:text-[#F5F5F0]"
                >
                  {home.hero.ctaSecondary}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </AnimatedBlock>
          </div>
          
          {/* Metric Card - appears after all animations, positioned bottom right */}
          {/* <div className="mt-6 lg:mt-0 lg:absolute lg:bottom-0 lg:right-0">
            <AnimatedBlock delay={3000} animationType="fade-slide">
              <MetricCard
                // label={home.metric.label}
                value={home.metric.value}
                change={home.metric.change}
                subtitle={home.metric.subtitle}
                chartData={home.metric.chartData}
                startAnimation={true}
              />
            </AnimatedBlock>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[1920px] mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <div className="bg-[#0066FF] rounded-lg p-8 lg:p-16">
            {/* Title and Subtitle */}
            <div className="mb-8 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-normal text-white mb-4 tracking-[-0.02em]">
                {home.features.title}
              </h2>
              <p className="text-lg lg:text-xl text-white opacity-90 leading-relaxed max-w-2xl">
                {home.features.subtitle}
              </p>
            </div>

            {/* Three Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-stretch">
              {home.features.items.map((feature, index) => (
                <AnimatedBlock 
                  key={index} 
                  delay={index * 150} 
                  animationType="fade-slide"
                  className="h-full"
                >
                  <div className="rounded-lg border border-white p-6 lg:p-10 relative hover:bg-gray-50 transition-all duration-300 h-full flex flex-col group cursor-pointer">
                    {/* Icon in top right */}
                    <div className="absolute top-6 right-6">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                        <path d="M5 15L15 5M15 5H5M15 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-normal text-[#fff] mb-4 tracking-[-0.01em] pr-8 group-hover:text-[#000] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-base lg:text-lg text-[#fff] leading-relaxed flex-grow group-hover:text-[#000] transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedBlock>
              ))}
            </div>
          </div>
        </AnimatedBlock>
      </section>

      {/* Salary Calculator Links Section */}
      <section className="max-w-[1920px] mx-auto px-4 lg:px-12 py-12 lg:py-16">
        <AnimatedBlock delay={0} animationType="fade-slide">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-normal text-black mb-4 tracking-[-0.02em] text-center">
              Salary Tax Calculators
            </h2>
            <p className="text-lg text-black opacity-70 mb-8 text-center max-w-2xl mx-auto">
              Calculate your net income after taxes and social contributions. Free calculators for multiple countries with detailed breakdowns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/salary-calculator"
                className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-normal text-black mb-2">
                  Calculator Hub
                </h3>
                <p className="text-sm text-black opacity-70 mb-4">
                  Access salary calculators for US, Germany, UK, and more. Calculate net income with detailed tax breakdowns.
                </p>
                <span className="text-sm text-black opacity-70 underline">
                  View All Calculators →
                </span>
              </Link>
              <Link
                href="/hourly-to-salary"
                className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-normal text-black mb-2">
                  Hourly to Salary
                </h3>
                <p className="text-sm text-black opacity-70 mb-4">
                  Convert hourly wage to annual, monthly, and weekly salary. Perfect for job negotiations and comparisons.
                </p>
                <span className="text-sm text-black opacity-70 underline">
                  Convert Hourly Rate →
                </span>
              </Link>
              <Link
                href="/salary-calculator/us"
                className="bg-white rounded-lg border border-black border-opacity-10 p-6 hover:border-opacity-30 transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-normal text-black mb-2">
                  🇺🇸 US Calculator
                </h3>
                <p className="text-sm text-black opacity-70 mb-4">
                  Calculate net income for United States. Includes federal taxes, Social Security, and Medicare.
                </p>
                <span className="text-sm text-black opacity-70 underline">
                  Calculate US Salary →
                </span>
              </Link>
            </div>
          </div>
        </AnimatedBlock>
      </section>

  
    </div>
  );
}

