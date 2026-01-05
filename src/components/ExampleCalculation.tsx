/**
 * Example calculation block component
 * Shows a sample calculation with pre-computed results
 */

import { TaxData } from '@/types/tax';
import { computeNet, annualizeIncome } from '@/lib/tax/calc';
import { CountryMetadata } from '@/lib/countries';

interface ExampleCalculationProps {
  country: CountryMetadata;
  taxData: TaxData;
}

export default function ExampleCalculation({ country, taxData }: ExampleCalculationProps) {
  // Calculate example
  const grossValue = country.exampleGross;
  const mode = country.exampleMode;
  const hoursPerWeek = 40;
  const weeksPerYear = 52;

  const annualGross = annualizeIncome(mode, grossValue, hoursPerWeek, weeksPerYear);
  const result = computeNet(annualGross, taxData, hoursPerWeek, weeksPerYear);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'hourly': return 'per hour';
      case 'monthly': return 'per month';
      case 'yearly': return 'per year';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 lg:p-8">
      <h3 className="text-2xl font-normal text-black mb-6">
        Example Calculation
      </h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-black border-opacity-10">
          <span className="text-black">Gross Income ({getModeLabel(mode)})</span>
          <span className="font-medium text-black">
            {taxData.metadata.currency} {formatCurrency(grossValue)}
          </span>
        </div>

        {result.breakdown.allowances.total > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-black border-opacity-10">
            <span className="text-black">Allowances</span>
            <span className="text-black">
              -{taxData.metadata.currency} {formatCurrency(result.breakdown.allowances.total)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b border-black border-opacity-10">
          <span className="text-black">Taxable Income</span>
          <span className="text-black">
            {taxData.metadata.currency} {formatCurrency(result.breakdown.taxableIncome)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-black border-opacity-10">
          <span className="text-black font-medium">Income Tax</span>
          <span className="font-medium text-black">
            -{taxData.metadata.currency} {formatCurrency(result.breakdown.incomeTax)}
          </span>
        </div>

        {result.breakdown.socialContributions.breakdown.length > 0 && (
          <>
            {result.breakdown.socialContributions.breakdown.map((contrib, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5"
              >
                <span className="text-sm text-black opacity-80">
                  {contrib.name}
                  {contrib.cappedAmount && (
                    <span className="text-xs opacity-60 ml-2">
                      (on {contrib.cappedAmount.toLocaleString('en-US')})
                    </span>
                  )}
                </span>
                <span className="text-sm text-black opacity-80">
                  -{taxData.metadata.currency} {formatCurrency(contrib.amount)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-b-2 border-black border-opacity-20 font-medium">
              <span className="text-black">Total Social Contributions</span>
              <span className="text-black">
                -{taxData.metadata.currency} {formatCurrency(result.breakdown.socialContributions.totalAnnual)}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between items-center py-4 pt-6 border-t-2 border-black">
          <span className="text-lg font-medium text-black">Net Income (Annual)</span>
          <span className="text-lg font-medium text-black">
            {taxData.metadata.currency} {formatCurrency(result.netAnnual)}
          </span>
        </div>

        <div className="pt-4 border-t border-black border-opacity-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-black opacity-70 mb-1">Net Hourly</p>
              <p className="text-xl font-medium text-black">
                {taxData.metadata.currency} {formatCurrency(result.netHourly)}
              </p>
            </div>
            <div>
              <p className="text-sm text-black opacity-70 mb-1">Net Monthly</p>
              <p className="text-xl font-medium text-black">
                {taxData.metadata.currency} {formatCurrency(result.netMonthly)}
              </p>
            </div>
            <div>
              <p className="text-sm text-black opacity-70 mb-1">Effective Tax Rate</p>
              <p className="text-xl font-medium text-black">
                {(result.effectiveTaxRate * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-black opacity-60 italic">
        Based on {taxData.metadata.currency} {formatCurrency(grossValue)} {getModeLabel(mode)} 
        {mode === 'hourly' && ` (${hoursPerWeek} hours/week, ${weeksPerYear} weeks/year)`}
        {mode === 'monthly' && ' (12 months/year)'}
        {mode === 'yearly' && ''}
        {' '}for {taxData.metadata.year} tax year.
      </p>
    </div>
  );
}

