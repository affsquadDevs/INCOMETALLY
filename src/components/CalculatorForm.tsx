/**
 * Progressive Enhancement: No-JS Fallback Form
 *
 * This component provides a basic HTML form that works without JavaScript.
 * When JS is enabled, the SalaryCalculator component enhances this form.
 */

'use client';

import { useTranslations } from 'next-intl';
import { calculateSalary } from '@/app/actions/calculate';

interface CalculatorFormProps {
  initialCountryCode?: string;
  initialYear?: number;
  initialMode?: 'hourly' | 'monthly' | 'yearly';
  initialValue?: number;
}

export default function CalculatorForm({
  initialCountryCode = 'US',
  initialYear = 2026,
  initialMode = 'yearly',
  initialValue = 50000,
}: CalculatorFormProps) {
  const t = useTranslations('calculator');
  // Wrapper to satisfy TypeScript form action type
  const handleSubmit = async (formData: FormData) => {
    await calculateSalary(formData);
  };

  return (
    <noscript>
      <form action={handleSubmit} method="post" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nojs-mode" className="block text-sm font-medium text-black mb-2">
              {t('form.incomeMode')}
            </label>
            <select
              id="nojs-mode"
              name="mode"
              defaultValue={initialMode}
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
              required
            >
              <option value="hourly">{t('mode.hourly')}</option>
              <option value="monthly">{t('mode.monthly')}</option>
              <option value="yearly">{t('mode.yearly')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="nojs-value" className="block text-sm font-medium text-black mb-2">
              {t('form.grossIncome')}
            </label>
            <input
              id="nojs-value"
              type="number"
              name="value"
              defaultValue={initialValue}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="nojs-country" className="block text-sm font-medium text-black mb-2">
              {t('form.country')}
            </label>
            <select
              id="nojs-country"
              name="countryCode"
              defaultValue={initialCountryCode}
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
              required
            >
              <option value="US">{t('country.US')}</option>
              <option value="DE">{t('country.DE')}</option>
              <option value="UK">{t('country.UK')}</option>
              <option value="PL">{t('country.PL')}</option>
              <option value="FR">{t('country.FR')}</option>
              <option value="ES">{t('country.ES')}</option>
              <option value="IT">{t('country.IT')}</option>
              <option value="SE">{t('country.SE')}</option>
              <option value="PT">{t('country.PT')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="nojs-year" className="block text-sm font-medium text-black mb-2">
              {t('form.taxYear')}
            </label>
            <select
              id="nojs-year"
              name="year"
              defaultValue={initialYear}
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
              required
            >
              <option value="2026">2026</option>
            </select>
          </div>

          <div>
            <label htmlFor="nojs-hours" className="block text-sm font-medium text-black mb-2">
              {t('form.hoursPerWeek')}
            </label>
            <input
              id="nojs-hours"
              type="number"
              name="hoursPerWeek"
              defaultValue="40"
              min="1"
              max="168"
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
            />
          </div>

          <div>
            <label htmlFor="nojs-weeks" className="block text-sm font-medium text-black mb-2">
              {t('form.weeksPerYear')}
            </label>
            <input
              id="nojs-weeks"
              type="number"
              name="weeksPerYear"
              defaultValue="52"
              min="1"
              max="52"
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-sm hover:bg-opacity-90 transition-all"
        >
          {t('form.calculateNetIncome')}
        </button>
      </form>
    </noscript>
  );
}
