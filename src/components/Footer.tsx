import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';

const sections = [
  {
    title: 'productTitle',
    links: [
      { href: '/', key: 'home' },
      { href: '/calculator', key: 'calculator' },
    ],
  },
  {
    title: 'legalTitle',
    links: [
      { href: '/privacy', key: 'privacyPolicy' },
      { href: '/terms', key: 'termsOfService' },
    ],
  },
  {
    title: 'resourcesTitle',
    links: [
      { href: '/salary-calculator', key: 'salaryCalculatorHub' },
      { href: '/hourly-to-salary', key: 'hourlyToSalary' },
      { href: '/guides', key: 'guides' },
    ],
  },
] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();
  const { logo, name } = siteConfig;

  return (
    <footer className="bg-[#0066FF] text-white mx-4 mb-4 rounded-xl">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12 ">
        {/* Logo and Site Name */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Image
              src={logo.image}
              alt={logo.linkText}
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <span className="text-base font-normal text-white tracking-[-0.01em]">
              {logo.linkText.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-normal mb-4 text-white uppercase text-xs tracking-[0.05em]">
                {t(section.title)}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white hover:opacity-70 transition-opacity text-sm leading-relaxed"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer Section */}
        <div className="mb-8">
          <div className="border-t border-white border-opacity-20 mb-6"></div>
          <div className="text-sm text-white opacity-90 leading-relaxed">
            <span className="font-normal">{t('disclaimerLabel')} </span>
            <span>{t('disclaimer')}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white border-opacity-20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white opacity-90">
              © {currentYear} {name}. {t('rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
