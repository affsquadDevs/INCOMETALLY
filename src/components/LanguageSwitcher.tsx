'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/routing';

/**
 * Switches the active locale while keeping the user on the same page.
 * next-intl's usePathname returns the locale-stripped pathname, and
 * router.replace(pathname, { locale }) re-routes it under the chosen locale
 * (the default locale stays unprefixed).
 */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label={t('selectLanguage')}
      value={locale}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as Locale;
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
      className={`bg-transparent text-black text-xs tracking-[0.05em] uppercase border border-black border-opacity-20 rounded-sm px-2 py-1.5 cursor-pointer hover:border-opacity-40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F0] disabled:opacity-50 ${className}`}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeNames[l]}
        </option>
      ))}
    </select>
  );
}
