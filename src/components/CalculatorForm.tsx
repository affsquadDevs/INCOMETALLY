/**
 * Progressive Enhancement: No-JS Fallback Form
 * 
 * This component provides a basic HTML form that works without JavaScript.
 * When JS is enabled, the SalaryCalculator component enhances this form.
 */

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
              Income Mode
            </label>
            <select
              id="nojs-mode"
              name="mode"
              defaultValue={initialMode}
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
              required
            >
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label htmlFor="nojs-value" className="block text-sm font-medium text-black mb-2">
              Gross Income
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
              Country
            </label>
            <select
              id="nojs-country"
              name="countryCode"
              defaultValue={initialCountryCode}
              className="w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black"
              required
            >
              <option value="US">United States</option>
              <option value="DE">Germany</option>
              <option value="UK">United Kingdom</option>
              <option value="PL">Poland</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="SE">Sweden</option>
              <option value="PT">Portugal</option>
            </select>
          </div>

          <div>
            <label htmlFor="nojs-year" className="block text-sm font-medium text-black mb-2">
              Tax Year
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
              Hours per Week
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
              Weeks per Year
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
          Calculate Net Income
        </button>
      </form>
    </noscript>
  );
}

