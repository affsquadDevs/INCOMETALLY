'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { computeNet, annualizeIncome, deannualizeIncome } from '@/lib/tax/calc';
import { computeNetGermany } from '@/lib/tax/germany';
import { computeNetUS } from '@/lib/tax/us';
import { computeNetUK } from '@/lib/tax/uk';
import { computeNetPoland } from '@/lib/tax/pl';
import { computeNetPortugal } from '@/lib/tax/pt';
import { computeNetSweden } from '@/lib/tax/se';
import { type IncomeMode } from '@/lib/tax/types';
import { GermanyTaxOptions, GermanyOptionsData } from '@/types/germany';
import { type USOptionsData, type USTaxOptions, type USFilingStatus, type USEmploymentType, type USDeductionMethod } from '@/types/us';
import { type UKOptionsData, type UKTaxOptions } from '@/types/uk';
import { type PLOptionsData, type PLTaxOptions } from '@/types/pl';
import { type PTOptionsData, type PTTaxOptions } from '@/types/pt';
import { type SEOptionsData, type SETaxOptions } from '@/types/se';
import { inputToAnnualGross, getModeValue, formatPrecise, normalizeToAnnual } from '@/lib/calculator-state';
import { trackModeChange, trackCountryChange, trackCalculate, trackCopyLink, trackCalcStarted, trackCalcFinished } from '@/lib/analytics';
import TaxDisclaimer from './TaxDisclaimer';
import AdSlot from './AdSlot';
import CalculatorForm from './CalculatorForm';
import CustomSelect from './CustomSelect';
import { TaxData } from '@/types/tax';
import {
  parseQueryParams,
  serializeToQueryParams,
  type CalculatorState,
} from '@/lib/urlState';

interface SalaryCalculatorProps {
  initialCountryCode?: string;
  initialYear?: number;
  initialMode?: IncomeMode;
  initialValue?: number;
  hideCountrySelect?: boolean;
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
  hideCountrySelect = false,
}: SalaryCalculatorProps) {
  // Track if component has mounted to avoid SSR issues
  const [isMounted, setIsMounted] = useState(false);
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

  // Hydrate initial state from query params > defaults (no localStorage)
  const getInitialState = (): CalculatorState => {
    // Start with defaults (from props)
    const state: CalculatorState = {
      country: defaults.country,
      mode: defaults.mode,
      gross: defaults.gross.toString(),
      hoursPerWeek: defaults.hoursPerWeek.toString(),
      weeksPerYear: defaults.weeksPerYear.toString(),
      year: defaults.year,
    };

    // Apply query params if available (client-side only)
    // But don't override country if hideCountrySelect is true (specific country page)
    if (typeof window !== 'undefined') {
      const query = parseQueryParams(window.location.search);
      // Only apply country from query params if country selector is visible
      if (query.country && !hideCountrySelect) {
        state.country = query.country;
      }
      if (query.mode) state.mode = query.mode;
      if (query.gross) state.gross = query.gross;
      if (query.hoursPerWeek) state.hoursPerWeek = query.hoursPerWeek;
      if (query.weeksPerYear) state.weeksPerYear = query.weeksPerYear;
      if (query.year) state.year = query.year;
    }

    return state;
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
  const [germanyHasChildren, setGermanyHasChildren] = useState<boolean>(false);

  // US-specific state
  const [usOptions, setUsOptions] = useState<USOptionsData | null>(null);
  const [usFilingStatus, setUsFilingStatus] = useState<USFilingStatus>('single');
  const [usEmploymentType, setUsEmploymentType] = useState<USEmploymentType>('employee');
  const [usDeductionMethod, setUsDeductionMethod] = useState<USDeductionMethod>('auto');
  const [usItemizedDeductions, setUsItemizedDeductions] = useState<string>('0');
  const [usChildrenUnder17, setUsChildrenUnder17] = useState<string>('0');
  const [usOtherDependents, setUsOtherDependents] = useState<string>('0');
  const [usTaxpayerOver65, setUsTaxpayerOver65] = useState<boolean>(false);
  const [usTaxpayerBlind, setUsTaxpayerBlind] = useState<boolean>(false);
  const [usSpouseOver65, setUsSpouseOver65] = useState<boolean>(false);
  const [usSpouseBlind, setUsSpouseBlind] = useState<boolean>(false);
  const [usPreTax401k, setUsPreTax401k] = useState<string>('0');
  const [usPreTaxHSA, setUsPreTaxHSA] = useState<string>('0');
  const [usOtherPreTax, setUsOtherPreTax] = useState<string>('0');
  const [usStateTaxRatePct, setUsStateTaxRatePct] = useState<string>('0');
  const [usLocalTaxRatePct, setUsLocalTaxRatePct] = useState<string>('0');

  // UK-specific state
  const [ukOptions, setUkOptions] = useState<UKOptionsData | null>(null);
  const [ukPreTaxPension, setUkPreTaxPension] = useState<string>('0');
  const [ukPreTaxOther, setUkPreTaxOther] = useState<string>('0');
  const [ukStudentLoanPlan, setUkStudentLoanPlan] = useState<'none' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [ukRegion, setUkRegion] = useState<'england' | 'wales' | 'scotland' | 'ni'>('england');

  // Poland-specific state
  const [plOptions, setPlOptions] = useState<PLOptionsData | null>(null);
  const [plFilingStatus, setPlFilingStatus] = useState<'single' | 'joint'>('single');
  const [plUnder26, setPlUnder26] = useState<boolean>(false);
  const [plChildren, setPlChildren] = useState<string>('0');
  const [plPreTax, setPlPreTax] = useState<string>('0');

  // Portugal-specific state
  const [ptOptions, setPtOptions] = useState<PTOptionsData | null>(null);
  const [ptRegion, setPtRegion] = useState<'mainland' | 'azores' | 'madeira'>('mainland');
  const [ptFilingStatus, setPtFilingStatus] = useState<'single' | 'joint'>('single');
  const [ptDependants, setPtDependants] = useState<string>('0');

  // Sweden-specific state
  const [seOptions, setSeOptions] = useState<SEOptionsData | null>(null);
  const [seMunicipality, setSeMunicipality] = useState<string>('avg');
  const [seCustomRate, setSeCustomRate] = useState<string>('32.38');
  const [seChurchMember, setSeChurchMember] = useState<boolean>(false);

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

  // Load US options when country is US
  useEffect(() => {
    if (countryCode === 'US' && !usOptions) {
      const loadUsOptions = async () => {
        try {
          const response = await fetch(`/api/us-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setUsOptions(data);
          }
        } catch (err) {
          console.error('Failed to load US options:', err);
        }
      };
      loadUsOptions();
    }
  }, [countryCode, usOptions, year]);

  // Load UK options when country is UK
  useEffect(() => {
    if (countryCode === 'UK' && !ukOptions) {
      const loadUkOptions = async () => {
        try {
          const response = await fetch(`/api/uk-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setUkOptions(data);
          }
        } catch (err) {
          console.error('Failed to load UK options:', err);
        }
      };
      loadUkOptions();
    }
  }, [countryCode, ukOptions, year]);

  // Load Poland options when country is PL
  useEffect(() => {
    if (countryCode === 'PL' && !plOptions) {
      const loadPlOptions = async () => {
        try {
          const response = await fetch(`/api/pl-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setPlOptions(data);
          }
        } catch (err) {
          console.error('Failed to load Poland options:', err);
        }
      };
      loadPlOptions();
    }
  }, [countryCode, plOptions, year]);

  // Load Portugal options when country is PT
  useEffect(() => {
    if (countryCode === 'PT' && !ptOptions) {
      const loadPtOptions = async () => {
        try {
          const response = await fetch(`/api/pt-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setPtOptions(data);
          }
        } catch (err) {
          console.error('Failed to load Portugal options:', err);
        }
      };
      loadPtOptions();
    }
  }, [countryCode, ptOptions, year]);

  // Load Sweden options when country is SE
  useEffect(() => {
    if (countryCode === 'SE' && !seOptions) {
      const loadSeOptions = async () => {
        try {
          const response = await fetch(`/api/se-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setSeOptions(data);
          }
        } catch (err) {
          console.error('Failed to load Sweden options:', err);
        }
      };
      loadSeOptions();
    }
  }, [countryCode, seOptions, year]);

  // Tax class II implies children; keep the toggle but force it on for class II.
  const germanyChildrenEffective = countryCode === 'DE' ? (germanyTaxClass === '2' ? true : germanyHasChildren) : false;

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
          children: germanyChildrenEffective,
        };
        calculationResult = computeNetGermany(annualGross, taxTable, germanyOptionsParams, germanyOptions, hours, weeks);
      } else if (countryCode === 'US' && usOptions) {
        // Normalize all monetary inputs to annual based on income mode
        // This ensures pre-tax deductions and itemized deductions are correctly converted
        // from monthly/hourly to yearly if needed
        const preTax401kInput = parseFloat(usPreTax401k) || 0;
        const preTaxHSAInput = parseFloat(usPreTaxHSA) || 0;
        const otherPreTaxInput = parseFloat(usOtherPreTax) || 0;
        const itemizedInput = parseFloat(usItemizedDeductions) || 0;
        
        const preTax401kAnnual = normalizeToAnnual(preTax401kInput, incomeMode, hours, weeks);
        const preTaxHSAAnnual = normalizeToAnnual(preTaxHSAInput, incomeMode, hours, weeks);
        const otherPreTaxAnnual = normalizeToAnnual(otherPreTaxInput, incomeMode, hours, weeks);
        const itemizedAnnual = normalizeToAnnual(itemizedInput, incomeMode, hours, weeks);
        
        const usParams: USTaxOptions = {
          filingStatus: usFilingStatus,
          employmentType: usEmploymentType,
          deductionMethod: usDeductionMethod,
          itemizedDeductions: itemizedAnnual,
          childrenUnder17: parseInt(usChildrenUnder17, 10) || 0,
          otherDependents: parseInt(usOtherDependents, 10) || 0,
          taxpayerOver65: usTaxpayerOver65,
          taxpayerBlind: usTaxpayerBlind,
          spouseOver65: usSpouseOver65,
          spouseBlind: usSpouseBlind,
          preTax401k: preTax401kAnnual,
          preTaxHSA: preTaxHSAAnnual,
          otherPreTaxDeductions: otherPreTaxAnnual,
          stateTaxRate: (parseFloat(usStateTaxRatePct) || 0) / 100,
          localTaxRate: (parseFloat(usLocalTaxRatePct) || 0) / 100,
        };
        calculationResult = computeNetUS(annualGross, taxTable, usParams, usOptions, hours, weeks);
      } else if (countryCode === 'UK' && ukOptions) {
        // Normalize all monetary inputs to annual based on income mode
        const preTaxPensionInput = parseFloat(ukPreTaxPension) || 0;
        const preTaxOtherInput = parseFloat(ukPreTaxOther) || 0;
        
        const preTaxPensionAnnual = normalizeToAnnual(preTaxPensionInput, incomeMode, hours, weeks);
        const preTaxOtherAnnual = normalizeToAnnual(preTaxOtherInput, incomeMode, hours, weeks);
        
        const ukParams: UKTaxOptions = {
          preTaxPension: preTaxPensionAnnual,
          preTaxOther: preTaxOtherAnnual,
          studentLoanPlan: ukStudentLoanPlan,
          region: ukRegion,
        };
        calculationResult = computeNetUK(annualGross, taxTable, ukParams, ukOptions, hours, weeks);
      } else if (countryCode === 'PL' && plOptions) {
        const plParams: PLTaxOptions = {
          filingStatus: plFilingStatus,
          under26: plUnder26,
          children: parseInt(plChildren, 10) || 0,
          preTaxDeductible: normalizeToAnnual(parseFloat(plPreTax) || 0, incomeMode, hours, weeks),
        };
        calculationResult = computeNetPoland(annualGross, taxTable, plParams, plOptions, hours, weeks);
      } else if (countryCode === 'PT' && ptOptions) {
        const ptParams: PTTaxOptions = {
          region: ptRegion,
          filingStatus: ptFilingStatus,
          dependants: parseInt(ptDependants, 10) || 0,
        };
        calculationResult = computeNetPortugal(annualGross, taxTable, ptParams, ptOptions, hours, weeks);
      } else if (countryCode === 'SE' && seOptions) {
        const seParams: SETaxOptions = {
          municipality: seMunicipality,
          customMunicipalRate: parseFloat(seCustomRate) || 0,
          churchMember: seChurchMember,
        };
        calculationResult = computeNetSweden(annualGross, taxTable, seParams, seOptions, hours, weeks);
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
  }, [
    taxTable,
    annualGross,
    hoursPerWeek,
    weeksPerYear,
    isLoading,
    countryCode,
    incomeMode,
    germanyOptions,
    germanyTaxClass,
    germanyHealthInsurance,
    germanyState,
    germanyInChurch,
    germanyChildrenEffective,
    usOptions,
    ukOptions,
    ukPreTaxPension,
    ukPreTaxOther,
    ukStudentLoanPlan,
    ukRegion,
    usFilingStatus,
    usEmploymentType,
    usDeductionMethod,
    usItemizedDeductions,
    usChildrenUnder17,
    usOtherDependents,
    usTaxpayerOver65,
    usTaxpayerBlind,
    usSpouseOver65,
    usSpouseBlind,
    usPreTax401k,
    usPreTaxHSA,
    usOtherPreTax,
    usStateTaxRatePct,
    usLocalTaxRatePct,
    plOptions,
    plFilingStatus,
    plUnder26,
    plChildren,
    plPreTax,
    ptOptions,
    ptRegion,
    ptFilingStatus,
    ptDependants,
    seOptions,
    seMunicipality,
    seCustomRate,
    seChurchMember,
  ]);


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

  const availableModes: IncomeMode[] =
    countryCode === 'DE' ? (['monthly', 'yearly'] as IncomeMode[]) : (['hourly', 'monthly', 'yearly'] as IncomeMode[]);

  return (
    <div className="space-y-6">
      {/* Progressive Enhancement: No-JS Fallback Form */}
      <CalculatorForm
        initialCountryCode={initialCountryCode}
        initialYear={initialYear}
        initialMode={initialMode}
        initialValue={initialValue}
      />

      {/* Country Selection - Prominent Display */}
      {!hideCountrySelect && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#0066FF] border-opacity-30 rounded-lg p-6 mb-6 shadow-sm">
          <div className="max-w-md">
            <label 
              htmlFor="country-select"
              className="block text-base font-semibold text-black mb-3 flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5 text-[#0066FF]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Select Country
            </label>
            <CustomSelect
              id="country-select"
              value={countryCode}
              onChange={(value) => {
                const newCountry = value.toString();
                setCountryCode(newCountry);
                trackCountryChange(newCountry);
              }}
              options={[
                { value: 'US', label: '🇺🇸 United States (Federal Only)' },
                { value: 'DE', label: '🇩🇪 Germany' },
                { value: 'UK', label: '🇬🇧 United Kingdom' },
                { value: 'PL', label: '🇵🇱 Poland' },
                { value: 'FR', label: '🇫🇷 France' },
                { value: 'ES', label: '🇪🇸 Spain' },
                { value: 'IT', label: '🇮🇹 Italy' },
                { value: 'SE', label: '🇸🇪 Sweden' },
                { value: 'PT', label: '🇵🇹 Portugal' },
              ]}
              buttonClassName="text-base py-3 font-medium border-2 border-[#0066FF] border-opacity-40 bg-white hover:border-opacity-60 shadow-sm"
            />
            <p className="mt-2 text-sm text-gray-600">
              Choose your country to calculate taxes accordingly
            </p>
          </div>
        </div>
      )}

      {/* Mode Toggle - Germany: Monthly/Yearly; others: Hourly/Monthly/Yearly */}
      <div>
          <label className="block text-sm font-medium text-black mb-3">
            Salary Period
          </label>
          <div className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1" role="tablist" aria-label="Salary period selection">
            {availableModes.map((mode) => (
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

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Income Input */}
        <div>
          <label 
            htmlFor="income-input"
            className="block text-sm font-medium text-black mb-2"
          >
            Gross Income ({taxTable?.metadata.currency ?? (countryCode === 'DE' ? 'EUR' : 'USD')})
          </label>
          <input
            id="income-input"
            type="number"
            value={incomeValue}
            onChange={(e) => {
              // Update annualGross based on new input value
              // This is the single source of truth - prevents circular updates
              const newValue = parseFloat(e.target.value) || 0;
              const hours = parseFloat(hoursPerWeek) || 40;
              const weeks = parseFloat(weeksPerYear) || 52;
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

        {/* Hours per Week (hourly mode only; hidden for Germany) */}
        {countryCode !== 'DE' && incomeMode === 'hourly' && (
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

        {/* Weeks per Year (hourly mode only; hidden for Germany) */}
        {countryCode !== 'DE' && incomeMode === 'hourly' && (
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

            {/* Private Health Insurance Note (only for private) */}
            {(germanyHealthInsurance === 'private-without' || germanyHealthInsurance === 'private-with') && (
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Private health insurance is paid separately and is not deducted from your salary. 
                  The net income shown above does not include private insurance costs, which you pay directly to your insurance provider.
                </p>
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

            {/* Children (affects Pflegeversicherung childless surcharge) */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Have children?
              </label>
              <div className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1" role="radiogroup" aria-label="Children selection">
                <button
                  type="button"
                  role="radio"
                  aria-checked={germanyChildrenEffective === true}
                  onClick={() => {
                    if (germanyTaxClass !== '2') setGermanyHasChildren(true);
                  }}
                  disabled={germanyTaxClass === '2'}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    germanyChildrenEffective === true
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  } ${germanyTaxClass === '2' ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={germanyChildrenEffective === false}
                  onClick={() => setGermanyHasChildren(false)}
                  disabled={germanyTaxClass === '2'}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    germanyChildrenEffective === false
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  } ${germanyTaxClass === '2' ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  No
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Used for long-term care insurance (Pflegeversicherung). For 2026 this means: with children ~1.80% employee share (most states), without children ~2.40% (includes the childless surcharge). Saxony uses a different split.
              </p>
            </div>
          </>
        )}

        {/* US-specific fields */}
        {countryCode === 'US' && usOptions && (
          <>
            <CustomSelect
              id="us-filing-status"
              label="Filing Status"
              value={usFilingStatus}
              onChange={(value) => setUsFilingStatus(value.toString() as USFilingStatus)}
              options={usOptions.filingStatuses.map((s) => ({ value: s.id, label: s.name }))}
            />

            <CustomSelect
              id="us-employment-type"
              label="Employment Type"
              value={usEmploymentType}
              onChange={(value) => setUsEmploymentType(value.toString() as USEmploymentType)}
              options={[
                { value: 'employee', label: 'Employee (W-2)' },
                { value: 'selfEmployed', label: 'Self-employed (SE tax estimate)' },
              ]}
            />

            <CustomSelect
              id="us-deduction-method"
              label="Deduction Method"
              value={usDeductionMethod}
              onChange={(value) => setUsDeductionMethod(value.toString() as USDeductionMethod)}
              options={[
                { value: 'auto', label: 'Auto (max of standard vs itemized)' },
                { value: 'standard', label: 'Standard deduction' },
                { value: 'itemized', label: 'Itemized deductions' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Itemized Deductions ({incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={usItemizedDeductions}
                onChange={(e) => setUsItemizedDeductions(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Children (under 17)
              </label>
              <input
                type="number"
                value={usChildrenUnder17}
                onChange={(e) => setUsChildrenUnder17(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Other Dependents
              </label>
              <input
                type="number"
                value={usOtherDependents}
                onChange={(e) => setUsOtherDependents(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm text-black">
                <input
                  type="checkbox"
                  checked={usTaxpayerOver65}
                  onChange={(e) => setUsTaxpayerOver65(e.target.checked)}
                />
                Taxpayer 65+
              </label>
              <label className="flex items-center gap-2 text-sm text-black">
                <input
                  type="checkbox"
                  checked={usTaxpayerBlind}
                  onChange={(e) => setUsTaxpayerBlind(e.target.checked)}
                />
                Taxpayer blind
              </label>
              {(usFilingStatus === 'mfj' || usFilingStatus === 'mfs') && (
                <>
                  <label className="flex items-center gap-2 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={usSpouseOver65}
                      onChange={(e) => setUsSpouseOver65(e.target.checked)}
                    />
                    Spouse 65+
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={usSpouseBlind}
                      onChange={(e) => setUsSpouseBlind(e.target.checked)}
                    />
                    Spouse blind
                  </label>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Pre-tax 401(k) / retirement ({incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={usPreTax401k}
                onChange={(e) => setUsPreTax401k(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Pre-tax HSA ({incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={usPreTaxHSA}
                onChange={(e) => setUsPreTaxHSA(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Other pre-tax deductions ({incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={usOtherPreTax}
                onChange={(e) => setUsOtherPreTax(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                State tax rate (estimate, %)
              </label>
              <input
                type="number"
                value={usStateTaxRatePct}
                onChange={(e) => setUsStateTaxRatePct(e.target.value)}
                min="0"
                max="20"
                step="0.01"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Local tax rate (estimate, %)
              </label>
              <input
                type="number"
                value={usLocalTaxRatePct}
                onChange={(e) => setUsLocalTaxRatePct(e.target.value)}
                min="0"
                max="10"
                step="0.01"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>
          </>
        )}

        {/* UK-specific fields */}
        {countryCode === 'UK' && ukOptions && (
          <>
            <CustomSelect
              id="uk-region"
              label="Region"
              value={ukRegion}
              onChange={(value) => setUkRegion(value.toString() as 'england' | 'wales' | 'scotland' | 'ni')}
              options={[
                { value: 'england', label: 'England' },
                { value: 'wales', label: 'Wales' },
                { value: 'ni', label: 'Northern Ireland' },
                { value: 'scotland', label: 'Scotland (not yet supported)' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Pre-tax Pension Contributions ({incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={ukPreTaxPension}
                onChange={(e) => setUkPreTaxPension(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Other Pre-tax Deductions ({incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={ukPreTaxOther}
                onChange={(e) => setUkPreTaxOther(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <CustomSelect
              id="uk-student-loan"
              label="Student Loan Plan"
              value={ukStudentLoanPlan}
              onChange={(value) => setUkStudentLoanPlan(value.toString() as 'none' | 'plan2' | 'plan4' | 'plan5')}
              options={[
                { value: 'none', label: 'None' },
                ...(ukOptions ? [
                  { 
                    value: 'plan2', 
                    label: `Plan 2 (9% over £${ukOptions.studentLoan.plan2.threshold.toLocaleString('en-GB')})` 
                  },
                  { 
                    value: 'plan4', 
                    label: `Plan 4 (9% over £${ukOptions.studentLoan.plan4.threshold.toLocaleString('en-GB')})` 
                  },
                  { 
                    value: 'plan5', 
                    label: `Plan 5 (9% over £${ukOptions.studentLoan.plan5.threshold.toLocaleString('en-GB')})` 
                  },
                ] : [
                  { value: 'plan2', label: 'Plan 2 (9% over £27,295)' },
                  { value: 'plan4', label: 'Plan 4 (9% over £25,000)' },
                  { value: 'plan5', label: 'Plan 5 (9% over £25,000)' },
                ])
              ]}
            />
            {ukOptions && (
              <p className="text-xs text-gray-600 mt-1">
                Note: Plan depends on where/when you studied, not where you work.
              </p>
            )}
          </>
        )}

        {/* Poland-specific fields */}
        {countryCode === 'PL' && plOptions && (
          <>
            <CustomSelect
              id="pl-filing-status"
              label="Filing Status"
              value={plFilingStatus}
              onChange={(value) => setPlFilingStatus(value.toString() as 'single' | 'joint')}
              options={[
                { value: 'single', label: 'Single' },
                { value: 'joint', label: 'Married — joint assessment (sole earner)' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Children (for child relief)
              </label>
              <input
                type="number"
                value={plChildren}
                onChange={(e) => setPlChildren(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tax-deductible contributions (e.g. IKZE, {incomeMode === 'monthly' ? 'monthly' : incomeMode === 'hourly' ? 'hourly' : 'annual'})
              </label>
              <input
                type="number"
                value={plPreTax}
                onChange={(e) => setPlPreTax(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Relief for the young (under 26)?
              </label>
              <div className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1" role="radiogroup" aria-label="Under-26 relief selection">
                <button
                  type="button"
                  role="radio"
                  aria-checked={plUnder26 === true}
                  onClick={() => setPlUnder26(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    plUnder26 === true ? 'bg-black text-white' : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={plUnder26 === false}
                  onClick={() => setPlUnder26(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    plUnder26 === false ? 'bg-black text-white' : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  No
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Exempts employment income up to 85,528 PLN from income tax (ZUS and health still apply).
              </p>
            </div>
          </>
        )}

        {/* Portugal-specific fields */}
        {countryCode === 'PT' && ptOptions && (
          <>
            <CustomSelect
              id="pt-region"
              label="Region"
              value={ptRegion}
              onChange={(value) => setPtRegion(value.toString() as 'mainland' | 'azores' | 'madeira')}
              options={[
                { value: 'mainland', label: 'Mainland (Continente)' },
                { value: 'azores', label: 'Azores (Açores)' },
                { value: 'madeira', label: 'Madeira' },
              ]}
            />

            <CustomSelect
              id="pt-filing-status"
              label="Filing Status"
              value={ptFilingStatus}
              onChange={(value) => setPtFilingStatus(value.toString() as 'single' | 'joint')}
              options={[
                { value: 'single', label: 'Single' },
                { value: 'joint', label: 'Married — joint taxation (sole earner)' },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Dependants
              </label>
              <input
                type="number"
                value={ptDependants}
                onChange={(e) => setPtDependants(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>
          </>
        )}

        {/* Sweden-specific fields */}
        {countryCode === 'SE' && seOptions && (
          <>
            <CustomSelect
              id="se-municipality"
              label="Municipality"
              value={seMunicipality}
              onChange={(value) => setSeMunicipality(value.toString())}
              options={seOptions.municipalities.map((m) => ({ value: m.id, label: m.name }))}
            />

            {seMunicipality === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Municipal tax rate (%)
                </label>
                <input
                  type="number"
                  value={seCustomRate}
                  onChange={(e) => setSeCustomRate(e.target.value)}
                  min="0"
                  max="40"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Member of the Church of Sweden?
              </label>
              <div className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1" role="radiogroup" aria-label="Church membership selection">
                <button
                  type="button"
                  role="radio"
                  aria-checked={seChurchMember === true}
                  onClick={() => setSeChurchMember(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    seChurchMember === true ? 'bg-black text-white' : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={seChurchMember === false}
                  onClick={() => setSeChurchMember(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    seChurchMember === false ? 'bg-black text-white' : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  No
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Adds the church fee (kyrkoavgift). Income tax already reflects the basic allowance and the jobbskatteavdrag credit (under 66).
              </p>
            </div>
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
                <p className="text-sm opacity-90 mb-1">
                  {countryCode === 'UK' && result.breakdown.preTaxDeductions && result.breakdown.preTaxDeductions.applied > 0
                    ? 'Net Hourly (after salary sacrifice)'
                    : 'Net Hourly'}
                </p>
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
              {countryCode === 'UK' && result.breakdown.preTaxDeductions && result.breakdown.preTaxDeductions.applied > 0 ? (
                <>
                  {/* UK: Show 3 separate metrics when salary sacrifice exists */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Tax & NI Rate</p>
                      <p className="text-2xl font-normal">
                        {(result.effectiveTaxRate * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">Salary Sacrifice Rate</p>
                      <p className="text-2xl font-normal">
                        {((result.breakdown.preTaxDeductions.applied / result.breakdown.grossIncome) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">Total Non-Cash Share</p>
                      <p className="text-2xl font-normal">
                        {((1 - (result.breakdown.netIncome / result.breakdown.grossIncome)) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm opacity-90 mb-1">Effective Tax Rate</p>
                  <p className="text-2xl font-normal">
                    {(result.effectiveTaxRate * 100).toFixed(2)}%
                  </p>
                </>
              )}
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

                {/* US: Pre-tax Deductions (entered vs applied) */}
                {countryCode === 'US' && result.breakdown.preTaxDeductions && result.breakdown.preTaxDeductions.entered > 0 && (
                  <>
                    {result.breakdown.preTaxDeductions.entered !== result.breakdown.preTaxDeductions.applied ? (
                      <>
                        <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                          <span className="text-sm text-black opacity-80">Pre-tax Deductions (entered)</span>
                          <span className="text-sm text-black opacity-80">
                            -{taxTable.metadata.currency} {formatCurrency(result.breakdown.preTaxDeductions.entered)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                          <span className="text-black">Pre-tax Deductions (applied, capped)</span>
                          <span className="text-black">
                            -{taxTable.metadata.currency} {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                        <span className="text-black">Pre-tax Deductions</span>
                        <span className="text-black">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* US: AGI (can be negative) */}
                {countryCode === 'US' && result.breakdown.adjustedGrossIncome !== undefined && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">Adjusted Gross Income (AGI)</span>
                    <span className={`text-black ${result.breakdown.adjustedGrossIncome < 0 ? 'opacity-70' : ''}`}>
                      {taxTable.metadata.currency} {formatCurrency(result.breakdown.adjustedGrossIncome)}
                    </span>
                  </div>
                )}

                {/* UK: Salary Sacrifice (Pre-tax Deductions) */}
                {countryCode === 'UK' && result.breakdown.preTaxDeductions && result.breakdown.preTaxDeductions.applied > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">Salary Sacrifice (Pension & Pre-tax)</span>
                    <span className="text-black">
                      -{taxTable.metadata.currency} {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                    </span>
                  </div>
                )}

                {/* UK: Adjusted Income (after pre-tax deductions) */}
                {countryCode === 'UK' && result.breakdown.adjustedGrossIncome !== undefined && 
                 result.breakdown.grossIncome > result.breakdown.adjustedGrossIncome && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">Adjusted Income (after salary sacrifice)</span>
                    <span className="text-black">
                      {taxTable.metadata.currency} {formatCurrency(result.breakdown.adjustedGrossIncome)}
                    </span>
                  </div>
                )}

                {/* Pre-tax deductions (non US/UK/DE countries) */}
                {countryCode !== 'US' && countryCode !== 'UK' && countryCode !== 'DE' && result.breakdown.preTaxDeductions && result.breakdown.preTaxDeductions.applied > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">Pre-tax Contributions</span>
                    <span className="text-black">
                      -{taxTable.metadata.currency} {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                    </span>
                  </div>
                )}

                {/* Standard/Itemized Deduction (US) or Allowances (other countries) */}
                {result.breakdown.allowances.total > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">
                      {countryCode === 'US' 
                        ? (result.breakdown.allowances.standardDeduction !== undefined ? 'Standard Deduction' : 'Itemized Deduction')
                        : 'Allowances'}
                    </span>
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
                  <span className="text-black font-medium">
                    {countryCode === 'DE'
                      ? 'Total Income Tax (ESt + Soli + Church)'
                      : countryCode === 'US'
                        ? 'Income Tax (Federal + State + Local)'
                        : countryCode === 'UK'
                          ? 'Income Tax'
                          : 'Income Tax'}
                  </span>
                  <span className="font-medium text-black">
                    -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTax)}
                  </span>
                </div>

                {/* UK: Student Loan */}
                {countryCode === 'UK' && result.breakdown.incomeTaxComponents?.studentLoan !== undefined && 
                 result.breakdown.incomeTaxComponents.studentLoan > 0 && (
                  <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                    <span className="text-sm text-black opacity-80">
                      Student Loan ({ukStudentLoanPlan === 'plan2' ? 'Plan 2' : ukStudentLoanPlan === 'plan4' ? 'Plan 4' : 'Plan 5'})
                    </span>
                    <span className="text-sm text-black opacity-80">
                      -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.studentLoan)}
                    </span>
                  </div>
                )}

                {/* Country-specific income tax components */}
                {countryCode === 'DE' && result.breakdown.incomeTaxComponents && (
                  <>
                    <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                      <span className="text-sm text-black opacity-80">Einkommensteuer (ESt)</span>
                      <span className="text-sm text-black opacity-80">
                        -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.baseIncomeTax)}
                      </span>
                    </div>
                    {(result.breakdown.incomeTaxComponents.solidaritySurcharge ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">Solidarity Surcharge (Soli)</span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.solidaritySurcharge!)}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.churchTax ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">Church Tax (Kirchensteuer)</span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.churchTax!)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {countryCode === 'US' && result.breakdown.incomeTaxComponents && (
                  <>
                    {typeof result.breakdown.incomeTaxComponents.federalIncomeTaxBeforeCredits === 'number' && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">Federal income tax (before credits)</span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.federalIncomeTaxBeforeCredits)}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.taxCredits ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">Tax credits (applied)</span>
                        <span className="text-sm text-black opacity-80">
                          +{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.taxCredits!)}
                        </span>
                      </div>
                    )}
                    {typeof result.breakdown.incomeTaxComponents.federalIncomeTaxAfterCredits === 'number' && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">Federal income tax (after credits)</span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.federalIncomeTaxAfterCredits)}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.stateIncomeTax ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">State income tax (estimate)</span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.stateIncomeTax!)}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.localIncomeTax ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">Local income tax (estimate)</span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTaxComponents.localIncomeTax!)}
                        </span>
                      </div>
                    )}
                  </>
                )}

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
                          {typeof contrib.rate === 'number' && (
                            <span className="text-xs opacity-60 ml-2">
                              ({(contrib.rate * 100).toFixed(2)}%)
                              {countryCode === 'DE' && contrib.name === 'Long-term Care Insurance' && germanyState === 'SN'
                                ? ' (Saxony split)'
                                : ''}
                            </span>
                          )}
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

                {/* Taxes & NI */}
                <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                  <span className="text-black">Taxes & NI</span>
                  <span className="text-black">
                    -{taxTable.metadata.currency} {formatCurrency(
                      countryCode === 'UK' && result.breakdown.incomeTaxComponents?.studentLoan
                        ? result.breakdown.incomeTax + result.breakdown.socialContributions.totalAnnual + result.breakdown.incomeTaxComponents.studentLoan
                        : result.breakdown.incomeTax + result.breakdown.socialContributions.totalAnnual
                    )}
                  </span>
                </div>

                {/* UK: Cash in Hand (separate from salary sacrifice) */}
                {countryCode === 'UK' && result.breakdown.preTaxDeductions && result.breakdown.preTaxDeductions.applied > 0 && (
                  <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                    <span className="text-black">Cash in Hand</span>
                    <span className="text-black font-bold">
                      {taxTable.metadata.currency} {formatCurrency(result.breakdown.netIncome)}
                    </span>
                  </div>
                )}

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

