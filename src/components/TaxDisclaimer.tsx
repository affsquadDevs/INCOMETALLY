/**
 * Tax Disclaimer Component
 * Displays a visible notice that tax calculations are estimates
 * and may not include local/regional taxes (especially for US)
 */

'use client';

import { useTranslations } from 'next-intl';

interface TaxDisclaimerProps {
  countryCode?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export default function TaxDisclaimer({
  countryCode,
  className = '',
  variant = 'default',
}: TaxDisclaimerProps) {
  const t = useTranslations('calculator');
  // Customize message based on country
  const getDisclaimerText = () => {
    if (countryCode?.toUpperCase() === 'US') {
      return t('disclaimer.us');
    }
    return t('disclaimer.default');
  };

  if (variant === 'inline') {
    return (
      <span className={`text-sm text-black opacity-70 ${className}`}>{getDisclaimerText()}</span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-amber-900 leading-relaxed">
            <span className="font-medium">{t('disclaimer.noteLabel')} </span>
            {getDisclaimerText()}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-base font-medium text-amber-900 mb-1">{t('disclaimer.title')}</h3>
          <p className="text-sm text-amber-800 leading-relaxed">{getDisclaimerText()}</p>
        </div>
      </div>
    </div>
  );
}
