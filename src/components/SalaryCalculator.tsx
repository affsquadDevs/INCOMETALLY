'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback, useRef } from 'react';
import { computeNet, annualizeIncome, deannualizeIncome } from '@/lib/tax/calc';
import { computeNetGermany } from '@/lib/tax/germany';
import { computeNetUS } from '@/lib/tax/us';
import { computeNetUK } from '@/lib/tax/uk';
import { computeNetPoland } from '@/lib/tax/pl';
import { computeNetPortugal } from '@/lib/tax/pt';
import { computeNetSweden } from '@/lib/tax/se';
import { computeNetItaly } from '@/lib/tax/it';
import { computeNetSpain } from '@/lib/tax/es';
import { computeNetFrance } from '@/lib/tax/fr';
import { type IncomeMode } from '@/lib/tax/types';
import { GermanyTaxOptions, GermanyOptionsData } from '@/types/germany';
import {
  type USOptionsData,
  type USTaxOptions,
  type USFilingStatus,
  type USEmploymentType,
  type USDeductionMethod,
} from '@/types/us';
import { type UKOptionsData, type UKTaxOptions } from '@/types/uk';
import { type PLOptionsData, type PLTaxOptions } from '@/types/pl';
import { type PTOptionsData, type PTTaxOptions } from '@/types/pt';
import { type SEOptionsData, type SETaxOptions } from '@/types/se';
import { type ITOptionsData, type ITTaxOptions } from '@/types/it';
import { type ESOptionsData, type ESTaxOptions } from '@/types/es';
import { type FROptionsData, type FRTaxOptions } from '@/types/fr';
import {
  inputToAnnualGross,
  getModeValue,
  formatPrecise,
  normalizeToAnnual,
} from '@/lib/calculator-state';
import {
  trackModeChange,
  trackCountryChange,
  trackCalculate,
  trackCopyLink,
  trackCalcStarted,
  trackCalcFinished,
} from '@/lib/analytics';
import TaxDisclaimer from './TaxDisclaimer';
import AdSlot from './AdSlot';
import CalculatorForm from './CalculatorForm';
import CustomSelect from './CustomSelect';
import { TaxData } from '@/types/tax';
import { parseQueryParams, serializeToQueryParams, type CalculatorState } from '@/lib/urlState';
import { contribKey } from '@/lib/contribKey';

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
  const t = useTranslations('calculator');
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
  const [germanyHealthInsurance, setGermanyHealthInsurance] = useState<
    'public' | 'private-without' | 'private-with'
  >('public');
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
  const [ukStudentLoanPlan, setUkStudentLoanPlan] = useState<'none' | 'plan2' | 'plan4' | 'plan5'>(
    'none'
  );
  const [ukRegion, setUkRegion] = useState<'england' | 'wales' | 'scotland' | 'ni'>('england');
  const [ukMarriageAllowance, setUkMarriageAllowance] = useState<boolean>(false);
  const [ukChildren, setUkChildren] = useState<string>('0');

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

  // Italy-specific state
  const [itOptions, setItOptions] = useState<ITOptionsData | null>(null);
  const [itRegion, setItRegion] = useState<string>('avg');
  const [itCustomRegionalRate, setItCustomRegionalRate] = useState<string>('1.70');
  const [itMunicipalRate, setItMunicipalRate] = useState<string>('0.80');
  const [itDependentChildren, setItDependentChildren] = useState<string>('0');
  const [itDependentSpouse, setItDependentSpouse] = useState<boolean>(false);

  // Spain-specific state
  const [esOptions, setEsOptions] = useState<ESOptionsData | null>(null);
  const [esCommunity, setEsCommunity] = useState<string>('default');
  const [esFilingStatus, setEsFilingStatus] = useState<'single' | 'joint'>('single');
  const [esChildren, setEsChildren] = useState<string>('0');

  // France-specific state
  const [frOptions, setFrOptions] = useState<FROptionsData | null>(null);
  const [frFilingStatus, setFrFilingStatus] = useState<'single' | 'married'>('single');
  const [frChildren, setFrChildren] = useState<string>('0');

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

  // Load Italy options when country is IT
  useEffect(() => {
    if (countryCode === 'IT' && !itOptions) {
      const loadItOptions = async () => {
        try {
          const response = await fetch(`/api/it-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setItOptions(data);
          }
        } catch (err) {
          console.error('Failed to load Italy options:', err);
        }
      };
      loadItOptions();
    }
  }, [countryCode, itOptions, year]);

  // Load Spain options when country is ES
  useEffect(() => {
    if (countryCode === 'ES' && !esOptions) {
      const loadEsOptions = async () => {
        try {
          const response = await fetch(`/api/es-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setEsOptions(data);
          }
        } catch (err) {
          console.error('Failed to load Spain options:', err);
        }
      };
      loadEsOptions();
    }
  }, [countryCode, esOptions, year]);

  // Load France options when country is FR
  useEffect(() => {
    if (countryCode === 'FR' && !frOptions) {
      const loadFrOptions = async () => {
        try {
          const response = await fetch(`/api/fr-options?year=${year}`);
          if (response.ok) {
            const data = await response.json();
            setFrOptions(data);
          }
        } catch (err) {
          console.error('Failed to load France options:', err);
        }
      };
      loadFrOptions();
    }
  }, [countryCode, frOptions, year]);

  // Tax class II implies children; keep the toggle but force it on for class II.
  const germanyChildrenEffective =
    countryCode === 'DE' ? (germanyTaxClass === '2' ? true : germanyHasChildren) : false;

  // Validate inputs based on annualGross (single source of truth)
  const validateInputs = useCallback(() => {
    const errors: Record<string, string> = {};
    const hours = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;

    // Get current mode value from annualGross
    const currentValue = getModeValue(annualGross, incomeMode, hours, weeks);

    // Validate income for current mode
    if (annualGross < 0) {
      errors.income = t('validation.incomePositive');
    } else {
      const bounds = VALIDATION_BOUNDS[incomeMode];
      if (currentValue > bounds.max) {
        errors.income = t('validation.incomeMax', {
          max: bounds.max.toLocaleString(),
          mode: incomeMode,
        });
      }
    }

    // Validate hours per week
    if (isNaN(hours) || hours < VALIDATION_BOUNDS.hoursPerWeek.min) {
      errors.hoursPerWeek = t('validation.hoursMin', { min: VALIDATION_BOUNDS.hoursPerWeek.min });
    } else if (hours > VALIDATION_BOUNDS.hoursPerWeek.max) {
      errors.hoursPerWeek = t('validation.hoursMax', { max: VALIDATION_BOUNDS.hoursPerWeek.max });
    }

    // Validate weeks per year
    if (isNaN(weeks) || weeks < VALIDATION_BOUNDS.weeksPerYear.min) {
      errors.weeksPerYear = t('validation.weeksMin', { min: VALIDATION_BOUNDS.weeksPerYear.min });
    } else if (weeks > VALIDATION_BOUNDS.weeksPerYear.max) {
      errors.weeksPerYear = t('validation.weeksMax', { max: VALIDATION_BOUNDS.weeksPerYear.max });
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
        calculationResult = computeNetGermany(
          annualGross,
          taxTable,
          germanyOptionsParams,
          germanyOptions,
          hours,
          weeks
        );
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
          marriageAllowance: ukMarriageAllowance,
          children: parseInt(ukChildren, 10) || 0,
        };
        calculationResult = computeNetUK(annualGross, taxTable, ukParams, ukOptions, hours, weeks);
      } else if (countryCode === 'PL' && plOptions) {
        const plParams: PLTaxOptions = {
          filingStatus: plFilingStatus,
          under26: plUnder26,
          children: parseInt(plChildren, 10) || 0,
          preTaxDeductible: normalizeToAnnual(parseFloat(plPreTax) || 0, incomeMode, hours, weeks),
        };
        calculationResult = computeNetPoland(
          annualGross,
          taxTable,
          plParams,
          plOptions,
          hours,
          weeks
        );
      } else if (countryCode === 'PT' && ptOptions) {
        const ptParams: PTTaxOptions = {
          region: ptRegion,
          filingStatus: ptFilingStatus,
          dependants: parseInt(ptDependants, 10) || 0,
        };
        calculationResult = computeNetPortugal(
          annualGross,
          taxTable,
          ptParams,
          ptOptions,
          hours,
          weeks
        );
      } else if (countryCode === 'SE' && seOptions) {
        const seParams: SETaxOptions = {
          municipality: seMunicipality,
          customMunicipalRate: parseFloat(seCustomRate) || 0,
          churchMember: seChurchMember,
        };
        calculationResult = computeNetSweden(
          annualGross,
          taxTable,
          seParams,
          seOptions,
          hours,
          weeks
        );
      } else if (countryCode === 'IT' && itOptions) {
        const itParams: ITTaxOptions = {
          region: itRegion,
          customRegionalRate: parseFloat(itCustomRegionalRate) || 0,
          municipalRate: parseFloat(itMunicipalRate) || 0,
          dependentChildren: parseInt(itDependentChildren, 10) || 0,
          dependentSpouse: itDependentSpouse,
        };
        calculationResult = computeNetItaly(
          annualGross,
          taxTable,
          itParams,
          itOptions,
          hours,
          weeks
        );
      } else if (countryCode === 'ES' && esOptions) {
        const esParams: ESTaxOptions = {
          community: esCommunity,
          filingStatus: esFilingStatus,
          children: parseInt(esChildren, 10) || 0,
        };
        calculationResult = computeNetSpain(
          annualGross,
          taxTable,
          esParams,
          esOptions,
          hours,
          weeks
        );
      } else if (countryCode === 'FR' && frOptions) {
        const frParams: FRTaxOptions = {
          filingStatus: frFilingStatus,
          children: parseInt(frChildren, 10) || 0,
        };
        calculationResult = computeNetFrance(
          annualGross,
          taxTable,
          frParams,
          frOptions,
          hours,
          weeks
        );
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
    ukMarriageAllowance,
    ukChildren,
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
    itOptions,
    itRegion,
    itCustomRegionalRate,
    itMunicipalRate,
    itDependentChildren,
    itDependentSpouse,
    esOptions,
    esCommunity,
    esFilingStatus,
    esChildren,
    frOptions,
    frFilingStatus,
    frChildren,
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

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // Track copy link event
        trackCopyLink(countryCode);
        // Show temporary feedback
        const button = document.getElementById('share-link-button');
        if (button) {
          const originalText = button.textContent;
          button.textContent = t('actions.copied');
          setTimeout(() => {
            if (button) button.textContent = originalText;
          }, 2000);
        }
      })
      .catch(() => {
        // Fallback: show URL in alert
        alert(`${t('actions.shareLinkPrefix')} ${shareUrl}`);
      });
  }, [countryCode, year, incomeMode, annualGross, hoursPerWeek, weeksPerYear]);

  const formatCurrency = (value: number) => {
    if (!taxTable) return value.toLocaleString();
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getModeLabel = (mode: IncomeMode) => {
    switch (mode) {
      case 'hourly':
        return t('mode.hourly');
      case 'monthly':
        return t('mode.monthly');
      case 'yearly':
        return t('mode.yearly');
    }
  };

  // Per-period suffix used in monetary input labels (monthly/hourly/annual).
  const getPeriodLabel = () =>
    incomeMode === 'monthly'
      ? t('period.monthly')
      : incomeMode === 'hourly'
        ? t('period.hourly')
        : t('period.annual');

  const availableModes: IncomeMode[] =
    countryCode === 'DE'
      ? (['monthly', 'yearly'] as IncomeMode[])
      : (['hourly', 'monthly', 'yearly'] as IncomeMode[]);

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
              {t('countrySelect.label')}
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
                { value: 'US', label: `🇺🇸 ${t('country.USFederalOnly')}` },
                { value: 'DE', label: `🇩🇪 ${t('country.DE')}` },
                { value: 'UK', label: `🇬🇧 ${t('country.UK')}` },
                { value: 'PL', label: `🇵🇱 ${t('country.PL')}` },
                { value: 'FR', label: `🇫🇷 ${t('country.FR')}` },
                { value: 'ES', label: `🇪🇸 ${t('country.ES')}` },
                { value: 'IT', label: `🇮🇹 ${t('country.IT')}` },
                { value: 'SE', label: `🇸🇪 ${t('country.SE')}` },
                { value: 'PT', label: `🇵🇹 ${t('country.PT')}` },
              ]}
              buttonClassName="text-base py-3 font-medium border-2 border-[#0066FF] border-opacity-40 bg-white hover:border-opacity-60 shadow-sm"
            />
            <p className="mt-2 text-sm text-gray-600">{t('countrySelect.helper')}</p>
          </div>
        </div>
      )}

      {/* Mode Toggle - Germany: Monthly/Yearly; others: Hourly/Monthly/Yearly */}
      <div>
        <label className="block text-sm font-medium text-black mb-3">
          {t('form.salaryPeriod')}
        </label>
        <div
          className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
          role="tablist"
          aria-label={t('form.salaryPeriodAria')}
        >
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
          <label htmlFor="income-input" className="block text-sm font-medium text-black mb-2">
            {t('form.grossIncome')} (
            {taxTable?.metadata.currency ?? (countryCode === 'DE' ? 'EUR' : 'USD')})
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
              validationErrors.income ? 'border-red-500' : 'border-black border-opacity-20'
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
            <label htmlFor="hours-input" className="block text-sm font-medium text-black mb-2">
              {t('form.hoursPerWeek')}
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
                validationErrors.hoursPerWeek ? 'border-red-500' : 'border-black border-opacity-20'
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
            <label htmlFor="weeks-input" className="block text-sm font-medium text-black mb-2">
              {t('form.weeksPerYear')}
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
                validationErrors.weeksPerYear ? 'border-red-500' : 'border-black border-opacity-20'
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
              label={t('de.taxClass')}
              value={germanyTaxClass}
              onChange={(value) =>
                setGermanyTaxClass(value.toString() as '1' | '2' | '3' | '4' | '5' | '6')
              }
              options={germanyOptions.taxClasses.map((tc) => ({
                value: tc.id,
                label: t.has(`opt.deTaxClass.${tc.id}`) ? t(`opt.deTaxClass.${tc.id}`) : tc.name,
              }))}
            />

            {/* Health Insurance */}
            <CustomSelect
              id="germany-health-insurance"
              label={t('de.healthInsurance')}
              value={germanyHealthInsurance}
              onChange={(value) =>
                setGermanyHealthInsurance(
                  value.toString() as 'public' | 'private-without' | 'private-with'
                )
              }
              options={germanyOptions.healthInsuranceTypes.map((hi) => ({
                value: hi.id,
                label: t.has(`opt.deHealthInsurance.${hi.id}`)
                  ? t(`opt.deHealthInsurance.${hi.id}`)
                  : hi.name,
              }))}
            />

            {/* Private Health Insurance Note (only for private) */}
            {(germanyHealthInsurance === 'private-without' ||
              germanyHealthInsurance === 'private-with') && (
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                <p className="text-sm text-gray-700">
                  <strong>{t('de.privateNoteLabel')}</strong> {t('de.privateNoteBody')}
                </p>
              </div>
            )}

            {/* State */}
            <CustomSelect
              id="germany-state"
              label={t('de.state')}
              value={germanyState}
              onChange={(value) => setGermanyState(value.toString())}
              options={germanyOptions.states.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
            />

            {/* In Church */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                {t('de.inChurch')}
              </label>
              <div
                className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
                role="radiogroup"
                aria-label={t('de.churchAria')}
              >
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
                  {t('yesNo.yes')}
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
                  {t('yesNo.no')}
                </button>
              </div>
            </div>

            {/* Children (affects Pflegeversicherung childless surcharge) */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                {t('de.haveChildren')}
              </label>
              <div
                className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
                role="radiogroup"
                aria-label={t('de.childrenAria')}
              >
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
                  {t('yesNo.yes')}
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
                  {t('yesNo.no')}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">{t('de.childrenNote')}</p>
            </div>
          </>
        )}

        {/* US-specific fields */}
        {countryCode === 'US' && usOptions && (
          <>
            <CustomSelect
              id="us-filing-status"
              label={t('us.filingStatus')}
              value={usFilingStatus}
              onChange={(value) => setUsFilingStatus(value.toString() as USFilingStatus)}
              options={usOptions.filingStatuses.map((s) => ({
                value: s.id,
                label: t.has(`opt.usFilingStatus.${s.id}`)
                  ? t(`opt.usFilingStatus.${s.id}`)
                  : s.name,
              }))}
            />

            <CustomSelect
              id="us-employment-type"
              label={t('us.employmentType')}
              value={usEmploymentType}
              onChange={(value) => setUsEmploymentType(value.toString() as USEmploymentType)}
              options={[
                { value: 'employee', label: t('opt.usEmploymentType.employee') },
                { value: 'selfEmployed', label: t('opt.usEmploymentType.selfEmployed') },
              ]}
            />

            <CustomSelect
              id="us-deduction-method"
              label={t('us.deductionMethod')}
              value={usDeductionMethod}
              onChange={(value) => setUsDeductionMethod(value.toString() as USDeductionMethod)}
              options={[
                { value: 'auto', label: t('opt.usDeductionMethod.auto') },
                { value: 'standard', label: t('opt.usDeductionMethod.standard') },
                { value: 'itemized', label: t('opt.usDeductionMethod.itemized') },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('us.itemizedDeductions')} ({getPeriodLabel()})
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
                {t('us.childrenUnder17')}
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
                {t('us.otherDependents')}
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
                {t('us.taxpayerOver65')}
              </label>
              <label className="flex items-center gap-2 text-sm text-black">
                <input
                  type="checkbox"
                  checked={usTaxpayerBlind}
                  onChange={(e) => setUsTaxpayerBlind(e.target.checked)}
                />
                {t('us.taxpayerBlind')}
              </label>
              {(usFilingStatus === 'mfj' || usFilingStatus === 'mfs') && (
                <>
                  <label className="flex items-center gap-2 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={usSpouseOver65}
                      onChange={(e) => setUsSpouseOver65(e.target.checked)}
                    />
                    {t('us.spouseOver65')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={usSpouseBlind}
                      onChange={(e) => setUsSpouseBlind(e.target.checked)}
                    />
                    {t('us.spouseBlind')}
                  </label>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('us.preTax401k')} ({getPeriodLabel()})
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
                {t('us.preTaxHSA')} ({getPeriodLabel()})
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
                {t('us.otherPreTax')} ({getPeriodLabel()})
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
                {t('us.stateTaxRate')}
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
                {t('us.localTaxRate')}
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
              label={t('uk.region')}
              value={ukRegion}
              onChange={(value) =>
                setUkRegion(value.toString() as 'england' | 'wales' | 'scotland' | 'ni')
              }
              options={[
                { value: 'england', label: t('opt.ukRegion.england') },
                { value: 'wales', label: t('opt.ukRegion.wales') },
                { value: 'ni', label: t('opt.ukRegion.ni') },
                { value: 'scotland', label: t('opt.ukRegion.scotland') },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('uk.preTaxPension')} ({getPeriodLabel()})
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
                {t('uk.preTaxOther')} ({getPeriodLabel()})
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
              label={t('uk.studentLoanPlan')}
              value={ukStudentLoanPlan}
              onChange={(value) =>
                setUkStudentLoanPlan(value.toString() as 'none' | 'plan2' | 'plan4' | 'plan5')
              }
              options={[
                { value: 'none', label: t('opt.ukStudentLoan.none') },
                ...(ukOptions
                  ? [
                      {
                        value: 'plan2',
                        label: t('opt.ukStudentLoan.plan2', {
                          threshold: ukOptions.studentLoan.plan2.threshold.toLocaleString('en-GB'),
                        }),
                      },
                      {
                        value: 'plan4',
                        label: t('opt.ukStudentLoan.plan4', {
                          threshold: ukOptions.studentLoan.plan4.threshold.toLocaleString('en-GB'),
                        }),
                      },
                      {
                        value: 'plan5',
                        label: t('opt.ukStudentLoan.plan5', {
                          threshold: ukOptions.studentLoan.plan5.threshold.toLocaleString('en-GB'),
                        }),
                      },
                    ]
                  : [
                      {
                        value: 'plan2',
                        label: t('opt.ukStudentLoan.plan2', { threshold: '27,295' }),
                      },
                      {
                        value: 'plan4',
                        label: t('opt.ukStudentLoan.plan4', { threshold: '25,000' }),
                      },
                      {
                        value: 'plan5',
                        label: t('opt.ukStudentLoan.plan5', { threshold: '25,000' }),
                      },
                    ]),
              ]}
            />
            {ukOptions && <p className="text-xs text-gray-600 mt-1">{t('uk.studentLoanNote')}</p>}

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                {t('uk.marriageAllowance')}
              </label>
              <div
                className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
                role="radiogroup"
                aria-label={t('uk.marriageAllowanceAria')}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={ukMarriageAllowance === true}
                  onClick={() => setUkMarriageAllowance(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    ukMarriageAllowance === true
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.yes')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={ukMarriageAllowance === false}
                  onClick={() => setUkMarriageAllowance(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    ukMarriageAllowance === false
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.no')}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">{t('uk.marriageAllowanceNote')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('uk.children')}
              </label>
              <input
                type="number"
                value={ukChildren}
                onChange={(e) => setUkChildren(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
              <p className="mt-2 text-xs text-gray-600">{t('uk.childrenNote')}</p>
            </div>
          </>
        )}

        {/* Poland-specific fields */}
        {countryCode === 'PL' && plOptions && (
          <>
            <CustomSelect
              id="pl-filing-status"
              label={t('pl.filingStatus')}
              value={plFilingStatus}
              onChange={(value) => setPlFilingStatus(value.toString() as 'single' | 'joint')}
              options={[
                { value: 'single', label: t('opt.plFilingStatus.single') },
                { value: 'joint', label: t('opt.plFilingStatus.joint') },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('pl.children')}
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
                {t('pl.preTax')} ({getPeriodLabel()})
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
              <label className="block text-sm font-medium text-black mb-3">{t('pl.under26')}</label>
              <div
                className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
                role="radiogroup"
                aria-label={t('pl.under26Aria')}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={plUnder26 === true}
                  onClick={() => setPlUnder26(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    plUnder26 === true
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.yes')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={plUnder26 === false}
                  onClick={() => setPlUnder26(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    plUnder26 === false
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.no')}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">{t('pl.under26Note')}</p>
            </div>
          </>
        )}

        {/* Portugal-specific fields */}
        {countryCode === 'PT' && ptOptions && (
          <>
            <CustomSelect
              id="pt-region"
              label={t('pt.region')}
              value={ptRegion}
              onChange={(value) =>
                setPtRegion(value.toString() as 'mainland' | 'azores' | 'madeira')
              }
              options={[
                { value: 'mainland', label: t('opt.ptRegion.mainland') },
                { value: 'azores', label: t('opt.ptRegion.azores') },
                { value: 'madeira', label: t('opt.ptRegion.madeira') },
              ]}
            />

            <CustomSelect
              id="pt-filing-status"
              label={t('pt.filingStatus')}
              value={ptFilingStatus}
              onChange={(value) => setPtFilingStatus(value.toString() as 'single' | 'joint')}
              options={[
                { value: 'single', label: t('opt.ptFilingStatus.single') },
                { value: 'joint', label: t('opt.ptFilingStatus.joint') },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('pt.dependants')}
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
              label={t('se.municipality')}
              value={seMunicipality}
              onChange={(value) => setSeMunicipality(value.toString())}
              options={seOptions.municipalities.map((m) => ({ value: m.id, label: m.name }))}
            />

            {seMunicipality === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('se.customRate')}
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
                {t('se.churchMember')}
              </label>
              <div
                className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
                role="radiogroup"
                aria-label={t('se.churchAria')}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={seChurchMember === true}
                  onClick={() => setSeChurchMember(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    seChurchMember === true
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.yes')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={seChurchMember === false}
                  onClick={() => setSeChurchMember(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    seChurchMember === false
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.no')}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">{t('se.churchNote')}</p>
            </div>
          </>
        )}

        {/* Italy-specific fields */}
        {countryCode === 'IT' && itOptions && (
          <>
            <CustomSelect
              id="it-region"
              label={t('it.region')}
              value={itRegion}
              onChange={(value) => setItRegion(value.toString())}
              options={itOptions.regions.map((r) => ({ value: r.id, label: r.name }))}
            />

            {itRegion === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('it.customRegionalRate')}
                </label>
                <input
                  type="number"
                  value={itCustomRegionalRate}
                  onChange={(e) => setItCustomRegionalRate(e.target.value)}
                  min="0"
                  max="5"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('it.municipalRate')}
              </label>
              <input
                type="number"
                value={itMunicipalRate}
                onChange={(e) => setItMunicipalRate(e.target.value)}
                min="0"
                max="2"
                step="0.01"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('it.dependentChildren')}
              </label>
              <input
                type="number"
                value={itDependentChildren}
                onChange={(e) => setItDependentChildren(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
              <p className="mt-2 text-xs text-gray-600">{t('it.dependentChildrenNote')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                {t('it.dependentSpouse')}
              </label>
              <div
                className="inline-flex rounded-lg border border-black border-opacity-20 bg-white p-1"
                role="radiogroup"
                aria-label={t('it.dependentSpouseAria')}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={itDependentSpouse === true}
                  onClick={() => setItDependentSpouse(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    itDependentSpouse === true
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.yes')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={itDependentSpouse === false}
                  onClick={() => setItDependentSpouse(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    itDependentSpouse === false
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black hover:bg-opacity-5'
                  }`}
                >
                  {t('yesNo.no')}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">{t('it.dependentSpouseNote')}</p>
            </div>
          </>
        )}

        {/* Spain-specific fields */}
        {countryCode === 'ES' && esOptions && (
          <>
            <CustomSelect
              id="es-community"
              label={t('es.community')}
              value={esCommunity}
              onChange={(value) => setEsCommunity(value.toString())}
              options={esOptions.communities.map((c) => ({ value: c.id, label: c.name }))}
            />

            <CustomSelect
              id="es-filing-status"
              label={t('es.filingStatus')}
              value={esFilingStatus}
              onChange={(value) => setEsFilingStatus(value.toString() as 'single' | 'joint')}
              options={[
                { value: 'single', label: t('opt.esFilingStatus.single') },
                { value: 'joint', label: t('opt.esFilingStatus.joint') },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('es.children')}
              </label>
              <input
                type="number"
                value={esChildren}
                onChange={(e) => setEsChildren(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
              <p className="mt-2 text-xs text-gray-600">{t('es.childrenNote')}</p>
            </div>
          </>
        )}

        {/* France-specific fields */}
        {countryCode === 'FR' && frOptions && (
          <>
            <CustomSelect
              id="fr-filing-status"
              label={t('fr.household')}
              value={frFilingStatus}
              onChange={(value) => setFrFilingStatus(value.toString() as 'single' | 'married')}
              options={[
                { value: 'single', label: t('opt.frFilingStatus.single') },
                { value: 'married', label: t('opt.frFilingStatus.married') },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {t('fr.children')}
              </label>
              <input
                type="number"
                value={frChildren}
                onChange={(e) => setFrChildren(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent border-black border-opacity-20"
              />
              <p className="mt-2 text-xs text-gray-600">{t('fr.childrenNote')}</p>
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
          {t('actions.copyShareLink')}
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
          <p>{t('status.loading')}</p>
        </div>
      )}

      {/* Results Section */}
      {result && taxTable && (
        <div
          className="space-y-6"
          role="region"
          aria-live="polite"
          aria-label={t('results.regionAria')}
        >
          {/* Net Income Summary */}
          <div className="bg-[#0066FF] rounded-lg p-6 lg:p-8 text-white">
            <h2 className="text-2xl font-normal mb-6">{t('results.netIncome')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm opacity-90 mb-1">
                  {countryCode === 'UK' &&
                  result.breakdown.preTaxDeductions &&
                  result.breakdown.preTaxDeductions.applied > 0
                    ? t('results.netHourlyAfterSacrifice')
                    : t('results.netHourly')}
                </p>
                <p className="text-3xl font-normal">
                  {taxTable.metadata.currency} {formatCurrency(result.netHourly)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">{t('results.netMonthly')}</p>
                <p className="text-3xl font-normal">
                  {taxTable.metadata.currency} {formatCurrency(result.netMonthly)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">{t('results.netYearly')}</p>
                <p className="text-3xl font-normal">
                  {taxTable.metadata.currency} {formatCurrency(result.netAnnual)}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white border-opacity-20">
              {countryCode === 'UK' &&
              result.breakdown.preTaxDeductions &&
              result.breakdown.preTaxDeductions.applied > 0 ? (
                <>
                  {/* UK: Show 3 separate metrics when salary sacrifice exists */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">{t('results.taxAndNiRate')}</p>
                      <p className="text-2xl font-normal">
                        {(result.effectiveTaxRate * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">{t('results.salarySacrificeRate')}</p>
                      <p className="text-2xl font-normal">
                        {(
                          (result.breakdown.preTaxDeductions.applied /
                            result.breakdown.grossIncome) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">{t('results.totalNonCashShare')}</p>
                      <p className="text-2xl font-normal">
                        {(
                          (1 - result.breakdown.netIncome / result.breakdown.grossIncome) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm opacity-90 mb-1">{t('results.effectiveTaxRate')}</p>
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
              <h2 className="text-2xl font-normal text-black mb-6">{t('results.breakdown')}</h2>

              <div className="space-y-4">
                {/* Gross Income */}
                <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                  <span className="text-black">{t('results.grossIncome')}</span>
                  <span className="font-medium text-black">
                    {taxTable.metadata.currency} {formatCurrency(result.breakdown.grossIncome)}
                  </span>
                </div>

                {/* US: Pre-tax Deductions (entered vs applied) */}
                {countryCode === 'US' &&
                  result.breakdown.preTaxDeductions &&
                  result.breakdown.preTaxDeductions.entered > 0 && (
                    <>
                      {result.breakdown.preTaxDeductions.entered !==
                      result.breakdown.preTaxDeductions.applied ? (
                        <>
                          <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                            <span className="text-sm text-black opacity-80">
                              {t('results.preTaxDeductionsEntered')}
                            </span>
                            <span className="text-sm text-black opacity-80">
                              -{taxTable.metadata.currency}{' '}
                              {formatCurrency(result.breakdown.preTaxDeductions.entered)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                            <span className="text-black">
                              {t('results.preTaxDeductionsAppliedCapped')}
                            </span>
                            <span className="text-black">
                              -{taxTable.metadata.currency}{' '}
                              {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                          <span className="text-black">{t('results.preTaxDeductions')}</span>
                          <span className="text-black">
                            -{taxTable.metadata.currency}{' '}
                            {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                {/* US: AGI (can be negative) */}
                {countryCode === 'US' && result.breakdown.adjustedGrossIncome !== undefined && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">{t('results.adjustedGrossIncome')}</span>
                    <span
                      className={`text-black ${result.breakdown.adjustedGrossIncome < 0 ? 'opacity-70' : ''}`}
                    >
                      {taxTable.metadata.currency}{' '}
                      {formatCurrency(result.breakdown.adjustedGrossIncome)}
                    </span>
                  </div>
                )}

                {/* UK: Salary Sacrifice (Pre-tax Deductions) */}
                {countryCode === 'UK' &&
                  result.breakdown.preTaxDeductions &&
                  result.breakdown.preTaxDeductions.applied > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                      <span className="text-black">{t('results.salarySacrifice')}</span>
                      <span className="text-black">
                        -{taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                      </span>
                    </div>
                  )}

                {/* UK: Adjusted Income (after pre-tax deductions) */}
                {countryCode === 'UK' &&
                  result.breakdown.adjustedGrossIncome !== undefined &&
                  result.breakdown.grossIncome > result.breakdown.adjustedGrossIncome && (
                    <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                      <span className="text-black">
                        {t('results.adjustedIncomeAfterSacrifice')}
                      </span>
                      <span className="text-black">
                        {taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.adjustedGrossIncome)}
                      </span>
                    </div>
                  )}

                {/* Pre-tax deductions (non US/UK/DE countries) */}
                {countryCode !== 'US' &&
                  countryCode !== 'UK' &&
                  countryCode !== 'DE' &&
                  result.breakdown.preTaxDeductions &&
                  result.breakdown.preTaxDeductions.applied > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                      <span className="text-black">{t('results.preTaxContributions')}</span>
                      <span className="text-black">
                        -{taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.preTaxDeductions.applied)}
                      </span>
                    </div>
                  )}

                {/* Standard/Itemized Deduction (US) or Allowances (other countries) */}
                {result.breakdown.allowances.total > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                    <span className="text-black">
                      {countryCode === 'US'
                        ? result.breakdown.allowances.standardDeduction !== undefined
                          ? t('results.standardDeduction')
                          : t('results.itemizedDeduction')
                        : t('results.allowances')}
                    </span>
                    <span className="text-black">
                      -{taxTable.metadata.currency}{' '}
                      {formatCurrency(result.breakdown.allowances.total)}
                    </span>
                  </div>
                )}

                {/* Taxable Income */}
                <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                  <span className="text-black">{t('results.taxableIncome')}</span>
                  <span className="text-black">
                    {taxTable.metadata.currency} {formatCurrency(result.breakdown.taxableIncome)}
                  </span>
                </div>

                {/* Income Tax */}
                <div className="flex justify-between items-center py-3 border-b border-black border-opacity-10">
                  <span className="text-black font-medium">
                    {countryCode === 'DE'
                      ? t('results.incomeTaxDE')
                      : countryCode === 'US'
                        ? t('results.incomeTaxUS')
                        : countryCode === 'UK'
                          ? t('results.incomeTax')
                          : t('results.incomeTax')}
                  </span>
                  <span className="font-medium text-black">
                    -{taxTable.metadata.currency} {formatCurrency(result.breakdown.incomeTax)}
                  </span>
                </div>

                {/* UK: Student Loan */}
                {countryCode === 'UK' &&
                  result.breakdown.incomeTaxComponents?.studentLoan !== undefined &&
                  result.breakdown.incomeTaxComponents.studentLoan > 0 && (
                    <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                      <span className="text-sm text-black opacity-80">
                        {t('results.studentLoan')} (
                        {ukStudentLoanPlan === 'plan2'
                          ? t('results.plan2')
                          : ukStudentLoanPlan === 'plan4'
                            ? t('results.plan4')
                            : t('results.plan5')}
                        )
                      </span>
                      <span className="text-sm text-black opacity-80">
                        -{taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.incomeTaxComponents.studentLoan)}
                      </span>
                    </div>
                  )}

                {/* UK: Marriage Allowance relief */}
                {countryCode === 'UK' &&
                  result.breakdown.incomeTaxComponents?.marriageAllowance !== undefined &&
                  result.breakdown.incomeTaxComponents.marriageAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                      <span className="text-sm text-black opacity-80">
                        {t('results.marriageAllowanceRelief')}
                      </span>
                      <span className="text-sm text-black opacity-80">
                        +{taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.incomeTaxComponents.marriageAllowance)}
                      </span>
                    </div>
                  )}

                {/* UK: High Income Child Benefit Charge */}
                {countryCode === 'UK' &&
                  result.breakdown.incomeTaxComponents?.highIncomeChildBenefitCharge !==
                    undefined &&
                  result.breakdown.incomeTaxComponents.highIncomeChildBenefitCharge > 0 && (
                    <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                      <span className="text-sm text-black opacity-80">{t('results.hicbc')}</span>
                      <span className="text-sm text-black opacity-80">
                        -{taxTable.metadata.currency}{' '}
                        {formatCurrency(
                          result.breakdown.incomeTaxComponents.highIncomeChildBenefitCharge
                        )}
                      </span>
                    </div>
                  )}

                {/* Country-specific income tax components */}
                {countryCode === 'DE' && result.breakdown.incomeTaxComponents && (
                  <>
                    <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                      <span className="text-sm text-black opacity-80">
                        {t('results.einkommensteuer')}
                      </span>
                      <span className="text-sm text-black opacity-80">
                        -{taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.incomeTaxComponents.baseIncomeTax)}
                      </span>
                    </div>
                    {(result.breakdown.incomeTaxComponents.solidaritySurcharge ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.solidaritySurcharge')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency}{' '}
                          {formatCurrency(
                            result.breakdown.incomeTaxComponents.solidaritySurcharge!
                          )}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.churchTax ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.churchTax')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency}{' '}
                          {formatCurrency(result.breakdown.incomeTaxComponents.churchTax!)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {countryCode === 'US' && result.breakdown.incomeTaxComponents && (
                  <>
                    {typeof result.breakdown.incomeTaxComponents.federalIncomeTaxBeforeCredits ===
                      'number' && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.federalIncomeTaxBeforeCredits')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency}{' '}
                          {formatCurrency(
                            result.breakdown.incomeTaxComponents.federalIncomeTaxBeforeCredits
                          )}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.taxCredits ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.taxCreditsApplied')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          +{taxTable.metadata.currency}{' '}
                          {formatCurrency(result.breakdown.incomeTaxComponents.taxCredits!)}
                        </span>
                      </div>
                    )}
                    {typeof result.breakdown.incomeTaxComponents.federalIncomeTaxAfterCredits ===
                      'number' && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.federalIncomeTaxAfterCredits')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency}{' '}
                          {formatCurrency(
                            result.breakdown.incomeTaxComponents.federalIncomeTaxAfterCredits
                          )}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.stateIncomeTax ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.stateIncomeTax')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency}{' '}
                          {formatCurrency(result.breakdown.incomeTaxComponents.stateIncomeTax!)}
                        </span>
                      </div>
                    )}
                    {(result.breakdown.incomeTaxComponents.localIncomeTax ?? 0) > 0 && (
                      <div className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5">
                        <span className="text-sm text-black opacity-80">
                          {t('results.localIncomeTax')}
                        </span>
                        <span className="text-sm text-black opacity-80">
                          -{taxTable.metadata.currency}{' '}
                          {formatCurrency(result.breakdown.incomeTaxComponents.localIncomeTax!)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Social Contributions */}
                {result.breakdown.socialContributions.breakdown.length > 0 && (
                  <>
                    {result.breakdown.socialContributions.breakdown.map(
                      (contrib: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 pl-4 border-b border-black border-opacity-5"
                        >
                          <span className="text-sm text-black opacity-80">
                            {t.has(`contrib.${contribKey(contrib.name)}`)
                              ? t(`contrib.${contribKey(contrib.name)}`)
                              : contrib.name}
                            {typeof contrib.rate === 'number' && (
                              <span className="text-xs opacity-60 ml-2">
                                ({(contrib.rate * 100).toFixed(2)}%)
                                {countryCode === 'DE' &&
                                contrib.name === 'Long-term Care Insurance' &&
                                germanyState === 'SN'
                                  ? ` ${t('results.saxonySplit')}`
                                  : ''}
                              </span>
                            )}
                            {contrib.cappedAmount && (
                              <span className="text-xs opacity-60 ml-2">
                                ({t('results.cappedOn')}{' '}
                                {contrib.cappedAmount.toLocaleString('en-US')})
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-black opacity-80">
                            -{taxTable.metadata.currency} {formatCurrency(contrib.amount)}
                          </span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                      <span className="text-black">{t('results.totalSocialContributions')}</span>
                      <span className="text-black">
                        -{taxTable.metadata.currency}{' '}
                        {formatCurrency(result.breakdown.socialContributions.totalAnnual)}
                      </span>
                    </div>
                  </>
                )}

                {/* Taxes & NI */}
                <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                  <span className="text-black">{t('results.taxesAndNi')}</span>
                  <span className="text-black">
                    -{taxTable.metadata.currency}{' '}
                    {formatCurrency(
                      countryCode === 'UK' && result.breakdown.incomeTaxComponents?.studentLoan
                        ? result.breakdown.incomeTax +
                            result.breakdown.socialContributions.totalAnnual +
                            result.breakdown.incomeTaxComponents.studentLoan
                        : result.breakdown.incomeTax +
                            result.breakdown.socialContributions.totalAnnual
                    )}
                  </span>
                </div>

                {/* UK: Cash in Hand (separate from salary sacrifice) */}
                {countryCode === 'UK' &&
                  result.breakdown.preTaxDeductions &&
                  result.breakdown.preTaxDeductions.applied > 0 && (
                    <div className="flex justify-between items-center py-3 border-b-2 border-black border-opacity-20 font-medium">
                      <span className="text-black">{t('results.cashInHand')}</span>
                      <span className="text-black font-bold">
                        {taxTable.metadata.currency} {formatCurrency(result.breakdown.netIncome)}
                      </span>
                    </div>
                  )}

                {/* Net Income */}
                <div className="flex justify-between items-center py-4 pt-6">
                  <span className="text-lg font-medium text-black">{t('results.netIncome')}</span>
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
          <p className="text-black opacity-70">{t('status.empty')}</p>
        </div>
      )}
    </div>
  );
}
