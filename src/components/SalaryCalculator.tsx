'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { computeNet, annualizeIncome, deannualizeIncome } from '@/lib/tax/calc';
import { computeNetGermany } from '@/lib/tax/germany';
import { type IncomeMode } from '@/lib/tax/types';
import { GermanyTaxOptions, GermanyOptionsData } from '@/types/germany';
import { inputToAnnualGross, getModeValue, formatPrecise } from '@/lib/calculator-state';
import { trackModeChange, trackCountryChange, trackCalculate, trackCopyLink, trackCalcStarted, trackCalcFinished } from '@/lib/analytics';
import TaxDisclaimer from './TaxDisclaimer';
import AdSlot from './AdSlot';
import CalculatorForm from './CalculatorForm';
import CustomSelect from './CustomSelect';
import { TaxData } from '@/types/tax';
import {
  hydrateState,
  saveToLocalStorage,
  serializeToQueryParams,
  type CalculatorState,
} from '@/lib/urlState';

interface SalaryCalculatorProps {
  initialCountryCode?: string;
  initialYear?: number;
  initialMode?: IncomeMode;
  initialValue?: number;
}

// Validation bounds
const VALIDATION_BOUNDS = {
  hourly: { min: 0, max: 500 },
  monthly: { min: 0, max: 500000 },
  yearly: { min: 0, max: 5000000 },
  hoursPerWeek: { min: 1, max: 168 },
  weeksPerYear: { min: 1, max: 52 },
};

export default function SalaryCalculator({
  initialCountryCode = 'US',
  initialYear = 2026,
  initialMode = 'yearly',
  initialValue = 50000,
}: SalaryCalculatorProps) {
  // Track if component has mounted to avoid SSR issues
  const [isMounted, setIsMounted] = useState(false);
  const isInitialMount = useRef(true);
  const calcStartedFired = useRef(false);
  
  // Default state values
  const defaults = {
    country: initialCountryCode,
    mode: initialMode,
    gross: initialValue,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    year: initialYear,
  };

  // Hydrate initial state from query params > localStorage > defaults
  const getInitialState = (): CalculatorState => {
    if (typeof window === 'undefined') {
      return {
        country: defaults.country,
        mode: defaults.mode,
        gross: defaults.gross.toString(),
        hoursPerWeek: defaults.hoursPerWeek.toString(),
        weeksPerYear: defaults.weeksPerYear.toString(),
        year: defaults.year,
      };
    }
    return hydrateState(window.location.search, defaults);
  };

  const initialState = getInitialState();
  const [countryCode, setCountryCode] = useState<string>(initialState.country);
  const [year, setYear] = useState<number>(initialState.year);
  const [incomeMode, setIncomeMode] = useState<IncomeMode>(initialState.mode);
  const [hoursPerWeek, setHoursPerWeek] = useState<string>(initialState.hoursPerWeek);
  const [weeksPerYear, setWeeksPerYear] = useState<string>(initialState.weeksPerYear);
  
  // Single source of truth: annualGross
  // All mode values are derived from this to prevent circular updates and precision loss
  const [annualGross, setAnnualGross] = useState<number>(() => {
    const initialValue = parseFloat(initialState.gross) || defaults.gross;
    const hours = parseFloat(initialState.hoursPerWeek) || defaults.hoursPerWeek;
    const weeks = parseFloat(initialState.weeksPerYear) || defaults.weeksPerYear;
    return annualizeIncome(initialState.mode, initialValue, hours, weeks);
  });

  // Derived: current mode value (displayed in input)
  const incomeValue = formatPrecise(
    getModeValue(
      annualGross,
      incomeMode,
      parseFloat(hoursPerWeek) || 40,
      parseFloat(weeksPerYear) || 52
    ),
    incomeMode === 'hourly' ? 2 : 0
  );
  
  const [taxTable, setTaxTable] = useState<TaxData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Germany-specific state
  const [germanyOptions, setGermanyOptions] = useState<GermanyOptionsData | null>(null);
  const [germanyTaxClass, setGermanyTaxClass] = useState<'1' | '2' | '3' | '4' | '5' | '6'>('1');
  const [germanyHealthInsurance, setGermanyHealthInsurance] = useState<'public' | 'private-without' | 'private-with'>('public');
  const [germanyState, setGermanyState] = useState<string>('BW');
  const [germanyInChurch, setGermanyInChurch] = useState<boolean>(false);
  // Children is derived from tax class (class 2 = single parent = has children)

  // Mark as mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load tax table when country or year changes
  useEffect(() => {
    const loadTaxTable = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tax?countryCode=${countryCode}&year=${year}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load tax data');
        }
        const table = await response.json();
        setTaxTable(table);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tax data');
        setTaxTable(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadTaxTable();
  }, [countryCode, year]);

  // Load Germany options when country is DE
  useEffect(() => {
    if (countryCode === 'DE' && !germanyOptions) {
      const loadGermanyOptions = async () => {
        try {
          const response = await fetch('/api/germany-options');
          if (response.ok) {
            const data = await response.json();
            setGermanyOptions(data);
            // Set default state if not set
            if (data.states.length > 0) {
              setGermanyState(data.states[0].id);
            }
          }
        } catch (err) {
          console.error('Failed to load Germany options:', err);
        }
      };
      loadGermanyOptions();
    }
  }, [countryCode, germanyOptions]);

  // Derive children from tax class for Germany (field removed from UI)
  // Tax class 2 = "Single parent" means children = true, otherwise false
  const germanyChildrenDerived = countryCode === 'DE' ? germanyTaxClass === '2' : false;

  // Validate inputs based on annualGross (single source of truth)
  const validateInputs = useCallback(() => {
    const errors: Record<string, string> = {};
    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;
    
    // Get current mode value from annualGross
    const currentValue = getModeValue(annualGross, incomeMode, hours, weeks);

    // Validate income for current mode
    if (annualGross < 0) {
      errors.income = 'Income must be a positive number';
    } else {
      const bounds = VALIDATION_BOUNDS[incomeMode];
      if (currentValue > bounds.max) {
        errors.income = `Income cannot exceed ${bounds.max.toLocaleString()} (${incomeMode})`;
      }
    }

    // Validate hours per week
    if (isNaN(hours) || hours < VALIDATION_BOUNDS.hoursPerWeek.min) {
      errors.hoursPerWeek = `Hours must be at least ${VALIDATION_BOUNDS.hoursPerWeek.min}`;
    } else if (hours > VALIDATION_BOUNDS.hoursPerWeek.max) {
      errors.hoursPerWeek = `Hours cannot exceed ${VALIDATION_BOUNDS.hoursPerWeek.max}`;
    }

    // Validate weeks per year
    if (isNaN(weeks) || weeks < VALIDATION_BOUNDS.weeksPerYear.min) {
      errors.weeksPerYear = `Weeks must be at least ${VALIDATION_BOUNDS.weeksPerYear.min}`;
    } else if (weeks > VALIDATION_BOUNDS.weeksPerYear.max) {
      errors.weeksPerYear = `Weeks cannot exceed ${VALIDATION_BOUNDS.weeksPerYear.max}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [annualGross, incomeMode, hoursPerWeek, weeksPerYear]);

  // Calculate when annualGross or tax table changes
  // Using annualGross as single source of truth prevents circular updates
  useEffect(() => {
    if (!taxTable || isLoading) return;

    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;

    // Validate hours/weeks
    if (hours < 1 || hours > 168 || weeks < 1 || weeks > 52) {
      setResult(null);
      return;
    }

    try {
      let calculationResult;
      if (countryCode === 'DE' && germanyOptions) {
        const germanyOptionsParams: GermanyTaxOptions = {
          taxClass: germanyTaxClass,
          healthInsurance: germanyHealthInsurance,
          state: germanyState,
          inChurch: germanyInChurch,
          children: germanyChildrenDerived,
        };
        calculationResult = computeNetGermany(annualGross, taxTable, germanyOptionsParams, germanyOptions, hours, weeks);
      } else {
        calculationResult = computeNet(annualGross, taxTable, hours, weeks);
      }
      setResult(calculationResult);
      setError(null);
      // Track successful calculation
      trackCalculate(countryCode, incomeMode);
      // Track calc_finished event to dataLayer
      trackCalcFinished(countryCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  }, [taxTable, annualGross, hoursPerWeek, weeksPerYear, isLoading, countryCode, incomeMode, germanyOptions, germanyTaxClass, germanyHealthInsurance, germanyState, germanyInChurch, germanyChildrenDerived]);

  // Save to localStorage whenever state changes (but not on initial mount)
  useEffect(() => {
    if (!isMounted || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Get current mode value from annualGross for storage
    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;
    const currentGrossValue = getModeValue(annualGross, incomeMode, hours, weeks);

    const state: CalculatorState = {
      country: countryCode,
      mode: incomeMode,
      gross: currentGrossValue.toString(),
      hoursPerWeek,
      weeksPerYear,
      year,
    };

    saveToLocalStorage(state);
  }, [countryCode, year, incomeMode, annualGross, hoursPerWeek, weeksPerYear, isMounted]);

  // Copy share link
  const copyShareLink = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Get current mode value from annualGross for share URL
    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;
    const currentGrossValue = getModeValue(annualGross, incomeMode, hours, weeks);

    const state: CalculatorState = {
      country: countryCode,
      mode: incomeMode,
      gross: currentGrossValue.toString(),
      hoursPerWeek,
      weeksPerYear,
      year,
    };

    const queryString = serializeToQueryParams(state);
    const shareUrl = `${window.location.origin}${window.location.pathname}?${queryString}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Track copy link event
      trackCopyLink(countryCode);
      // Show temporary feedback
      const button = document.getElementById('share-link-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          if (button) button.textContent = originalText;
        }, 2000);
      }
    }).catch(() => {
      // Fallback: show URL in alert
      alert(`Share link: ${shareUrl}`);
    });
  }, [countryCode, year, incomeMode, annualGross, hoursPerWeek, weeksPerYear]);

  const formatCurrency = (value: number) => {
    if (!taxTable) return value.toLocaleString();
    return value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getModeLabel = (mode: IncomeMode) => {
    switch (mode) {
      case 'hourly': return 'Hourly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progressive Enhancement: No-JS Fallback Form */}
      <CalculatorForm
        initialCountryCode={initialCountryCode}
        initialYear={initialYear}
        initialMode={initialMode}
        initialValue={initialValue}
      />

      {/* Mode Toggle - Only Monthly/Yearly for Germany */}
      {countryCode === 'DE' && (
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            Salary Period
          </label>
          <div className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1" role="tablist" aria-label="Salary period selection">
            {(['monthly', 'yearly'] as IncomeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={incomeMode === mode}
              onClick={() => {
                // When mode changes, keep annualGross the same
                // Only update the displayed mode - value will be recalculated from annualGross
                setIncomeMode(mode);
                trackModeChange(mode, countryCode);
                // No need to update annualGross - it stays the same
                // The input value will automatically update via the derived incomeValue
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                incomeMode === mode
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-black hover:bg-opacity-5'
              }`}
            >
              {getModeLabel(mode)}
            </button>
          ))}
          </div>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Income Input */}
        <div>
          <label 
            htmlFor="income-input"
            className="block text-sm font-medium text-black mb-2"
          >
            Gross Salary (€)
          </label>
          <input
            id="income-input"
            type="number"
            value={incomeValue}
            onChange={(e) => {
              // Update annualGross based on new input value
              // This is the single source of truth - prevents circular updates
              const newValue = parseFloat(e.target.value) || 0;
              // For Germany, only monthly/yearly modes are available
              const hours = 40; // Default, not used for monthly/yearly
              const weeks = 52; // Default, not used for monthly/yearly
              const newAnnualGross = annualizeIncome(incomeMode, newValue, hours, weeks);
              setAnnualGross(newAnnualGross);
            }}
            onBlur={(e) => {
              // Track calc_started when user finishes the first field
              const value = parseFloat(e.target.value) || 0;
              if (value > 0 && !calcStartedFired.current) {
                trackCalcStarted();
                calcStartedFired.current = true;
              }
            }}
            min="0"
            step="1"
            aria-invalid={!!validationErrors.income}
            aria-describedby={validationErrors.income ? 'income-error' : undefined}
            className={`w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent ${
              validationErrors.income 
                ? 'border-red-500' 
                : 'border-black border-opacity-20'
            }`}
          />
          {validationErrors.income && (
            <p id="income-error" className="mt-1 text-sm text-red-600" role="alert">
              {validationErrors.income}
            </p>
          )}
        </div>

        {/* Country Selection */}
        <CustomSelect
          id="country-select"
          label="Country"
          value={countryCode}
          onChange={(value) => {
            const newCountry = value.toString();
            setCountryCode(newCountry);
            trackCountryChange(newCountry);
          }}
          options={[
            { value: 'US', label: 'United States (Federal Only)' },
            { value: 'DE', label: 'Germany' },
            { value: 'UK', label: 'United Kingdom' },
          ]}
        />

        {/* Hours per Week - REMOVED (only monthly/yearly for Germany) */}
        {false && incomeMode === 'hourly' && (
          <div>
            <label 
              htmlFor="hours-input"
              className="block text-sm font-medium text-black mb-2"
            >
              Hours per Week
            </label>
            <input
              id="hours-input"
              type="number"
              value={hoursPerWeek}
              onChange={(e) => {
                const newHours = e.target.value;
                setHoursPerWeek(newHours);
                // Recalculate annualGross when hours change (if in hourly mode)
                if (incomeMode === 'hourly') {
                  const hours = parseFloat(newHours) || 40;
                  const weeks = parseFloat(weeksPerYear) || 52;
                  const currentValue = parseFloat(incomeValue) || 0;
                  const newAnnualGross = annualizeIncome('hourly', currentValue, hours, weeks);
                  setAnnualGross(newAnnualGross);
                }
              }}
              min="1"
              max="168"
              aria-invalid={!!validationErrors.hoursPerWeek}
              aria-describedby={validationErrors.hoursPerWeek ? 'hours-error' : undefined}
              className={`w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent ${
                validationErrors.hoursPerWeek 
                  ? 'border-red-500' 
                  : 'border-black border-opacity-20'
              }`}
            />
            {validationErrors.hoursPerWeek && (
              <p id="hours-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.hoursPerWeek}
              </p>
            )}
          </div>
        )}

        {/* Weeks per Year - REMOVED (only monthly/yearly for Germany) */}
        {false && incomeMode === 'hourly' && (
          <div>
            <label 
              htmlFor="weeks-input"
              className="block text-sm font-medium text-black mb-2"
            >
              Weeks per Year
            </label>
            <input
              id="weeks-input"
              type="number"
              value={weeksPerYear}
              onChange={(e) => {
                const newWeeks = e.target.value;
                setWeeksPerYear(newWeeks);
                // Recalculate annualGross when weeks change (if in hourly mode)
                if (incomeMode === 'hourly') {
                  const hours = parseFloat(hoursPerWeek) || 40;
                  const weeks = parseFloat(newWeeks) || 52;
                  const currentValue = parseFloat(incomeValue) || 0;
                  const newAnnualGross = annualizeIncome('hourly', currentValue, hours, weeks);
                  setAnnualGross(newAnnualGross);
                }
              }}
              min="1"
              max="52"
              aria-invalid={!!validationErrors.weeksPerYear}
              aria-describedby={validationErrors.weeksPerYear ? 'weeks-error' : undefined}
              className={`w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent ${
                validationErrors.weeksPerYear 
                  ? 'border-red-500' 
                  : 'border-black border-opacity-20'
              }`}
            />
            {validationErrors.weeksPerYear && (
              <p id="weeks-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.weeksPerYear}
              </p>
            )}
          </div>
        )}

        {/* Tax Year - REMOVED for Germany calculator */}

        {/* Germany-specific fields */}
        {countryCode === 'DE' && germanyOptions && (
          <>
            {/* Tax Class */}
            <CustomSelect
              id="germany-tax-class"
              label="Tax Class"
              value={germanyTaxClass}
              onChange={(value) => setGermanyTaxClass(value.toString() as '1' | '2' | '3' | '4' | '5' | '6')}
              options={germanyOptions.taxClasses.map(tc => ({
                value: tc.id,
                label: tc.name,
              }))}
            />

            {/* Health Insurance */}
            <CustomSelect
              id="germany-health-insurance"
              label="Health Insurance"
              value={germanyHealthInsurance}
              onChange={(value) => setGermanyHealthInsurance(value.toString() as 'public' | 'private-without' | 'private-with')}
              options={germanyOptions.healthInsuranceTypes.map(hi => ({
                value: hi.id,
                label: hi.name,
              }))}
            />

            {/* Total Contribution for Private Health Insurance (only for private) */}
            {(germanyHealthInsurance === 'private-without' || germanyHealthInsurance === 'private-with') && (
              <div>
                <label 
                  htmlFor="private-health-contribution"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Total Contribution for Private Health Insurance (€)
                </label>
                <input
                  id="private-health-contribution"
                  type="number"
                  value={0}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
                  readOnly
                  disabled
                />
              </div>
            )}

            {/* State */}
            <CustomSelect
              id="germany-state"
              label="Your State"
              value={germanyState}
              onChange={(value) => setGermanyState(value.toString())}
              options={germanyOptions.states.map(s => ({
                value: s.id,
                label: s.name,
              }))}
            />

            {/* In Church */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                In the Church?
              </label>
              <div className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1" role="radiogroup" aria-label="Church membership selection">
                <button
                  type="button"
                  role="radio"
                  aria-checked={germanyInChurch === true}
                  onClick={() => setGermanyInChurch(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    germanyInChurch === true
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={germanyInChurch === false}
                  onClick={() => setGermanyInChurch(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    germanyInChurch === false
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Children - REMOVED for simplified calculator */}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          id="share-link-button"
          type="button"
          onClick={copyShareLink}
          className="px-4 py-2 bg-white border border-black border-opacity-20 rounded-sm text-black hover:bg-black hover:bg-opacity-5 transition-all focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
        >
          Copy Share Link
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center text-black opacity-70">
          <p>Loading tax data...</p>
        </div>
      )}

      {/* Results Section */}
      {result && taxTable && (
        <div 
          className="space-y-6"
          role="region"
          aria-live="polite"
          aria-label="Calculation results"
        >
          {/* Net Income Summary */}
          <div className="bg-[#0066FF] rounded-lg p-6 lg:p-8 text-white">
            <h2 className="text-2xl font-normal mb-6">Net Income</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm opacity-90 mb-1">Net Hourly</p>
                <p className="text-3xl font-normal">
                  {taxTable.metadata.currency} {formatCurrency(result.netHourly)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Net Monthly</p>
                <p className="text-3xl font-normal">
                  {taxTable.metadata.currency} {formatCurrency(result.netMonthly)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Net Yearly</p>
                <p className="text-3xl font-normal">
                  {taxTable.metadata.currency} {formatCurrency(result.netAnnual)}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white border-opacity-20">
              <p className="text-sm opacity-90 mb-1">Effective Tax Rate</p>
              <p className="text-2xl font-normal">
                {(result.effectiveTaxRate * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-lg border border-black border-opacity-10 overflow-hidden">
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-normal text-black mb-6">Breakdown</h2>
              
              <div className="space-y-4">
                {/* Gross Income */}
                <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                  <span className="text-black">Gross Income</span>
                  <span className="font-medium text-black">
                    {taxTable.metadata.currency} {formatCurrency(result.breakdown.grossIncome)}
                  </span>
                </div>

                {/* Allowances */}
                {result.breakdown.allowances.total > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">Allowances</span>
                    <span className="text-black">
                      -{taxTable.metadata.currency} {formatCurrency(result.breakdown.allowances.total)}
                    </span>
                  </div>
                )}

                {/* Taxable Income */}
                <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                  <span className="text-black">Taxable Income</span>
                  <span className="text-black">
                    {taxTable.metadata.currency} {formatCurrency(result.breakdown.taxableIncome)}
                  </span>
                </div>

                {/* Income Tax */}
                <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                  <span className="text-black font-medium">Income Tax</span>
                  <span className="font-medium text-black">
                    -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTax)}
                  </span>
                </div>

                {/* Social Contributions */}
                {result.breakdown.socialContributions.breakdown.length > 0 && (
                  <>
                    {result.breakdown.socialContributions.breakdown.map((contrib: any, index: number) => (
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
                          -{taxTable.metadata.currency} {formatCurrency(contrib.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                      <span className="text-black">Total Social Contributions</span>
                      <span className="text-black">
                        -{taxTable.metadata.currency} {formatCurrency(result.breakdown.socialContributions.totalAnnual)}
                      </span>
                    </div>
                  </>
                )}

                {/* Total Deductions */}
                <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                  <span className="text-black">Total Deductions</span>
                  <span className="text-black">
                    -{taxTable.metadata.currency} {formatCurrency(
                      result.breakdown.incomeTax + result.breakdown.socialContributions.totalAnnual
                    )}
                  </span>
                </div>

                {/* Net Income */}
                <div className="flex justify-between items-center py-4 pt-6">
                  <span className="text-lg font-medium text-black">Net Income</span>
                  <span className="text-lg font-medium text-black">
                    {taxTable.metadata.currency} {formatCurrency(result.breakdown.netIncome)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <TaxDisclaimer countryCode={countryCode} />
        </div>
      )}

      {/* Ad Slot - Below Results Section */}
      {/* 
        AdSense Policy Compliance:
        - Placed below results section, well away from form controls (inputs, buttons)
        - Minimum 150px spacing from interactive elements maintained
        - Clear visual separation from calculator functionality
      */}
 

      {!result && !error && !isLoading && taxTable && (
        <div className="bg-white rounded-lg border border-black border-opacity-10 p-6 text-center">
          <p className="text-black opacity-70">Enter your income to see calculations</p>
        </div>
      )}
    </div>
  );
}

