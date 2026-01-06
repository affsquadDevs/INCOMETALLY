import type { TaxBracket } from '@/types/tax';

export type USFilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';
export type USEmploymentType = 'employee' | 'selfEmployed';
export type USDeductionMethod = 'auto' | 'standard' | 'itemized';

export interface USTaxOptions {
  filingStatus: USFilingStatus;
  employmentType: USEmploymentType;

  deductionMethod: USDeductionMethod;
  itemizedDeductions: number; // annual amount

  // Dependents / credits
  childrenUnder17: number;
  otherDependents: number;

  // Additional standard deduction flags (65+ and/or blind)
  taxpayerOver65: boolean;
  taxpayerBlind: boolean;
  spouseOver65: boolean; // only relevant for MFJ/MFS, ignored otherwise
  spouseBlind: boolean;  // only relevant for MFJ/MFS, ignored otherwise

  // Above-the-line / pre-tax deductions (simplified inputs)
  preTax401k: number; // employee elective deferrals (traditional) / self-employed SEP/Solo 401k (simplified)
  preTaxHSA: number;
  otherPreTaxDeductions: number;

  // Optional state/local (flat estimate rates, applied to taxable income)
  stateTaxRate: number; // 0..1
  localTaxRate: number; // 0..1
}

export interface USOptionsData {
  metadata: {
    countryCode: 'US';
    year: number;
    notes: string;
    sources?: {
      irsNewsReleaseUrl?: string;
      revenueProcedurePdfUrl?: string;
      extractedAt?: string; // ISO date
    };
  };
  filingStatuses: Array<{ id: USFilingStatus; name: string }>;
  standardDeduction: Record<USFilingStatus, number>;
  additionalStandardDeduction: {
    singleOrHoh: number;
    marriedOrMfs: number;
  };
  federalBrackets: Record<USFilingStatus, TaxBracket[]>;
  payroll: {
    employee: {
      socialSecurityRate: number;
      socialSecurityWageBase: number;
      medicareRate: number;
      additionalMedicareRate: number;
      additionalMedicareThreshold: Record<USFilingStatus, number>;
    };
    selfEmployed: {
      seEarningsMultiplier: number;
      socialSecurityRate: number;
      socialSecurityWageBase: number;
      medicareRate: number;
      additionalMedicareRate: number;
      additionalMedicareThreshold: Record<USFilingStatus, number>;
    };
  };
  credits: {
    childTaxCredit: {
      amountPerChildUnder17: number;
      phaseoutStart: Record<USFilingStatus, number>;
      phaseoutReductionPer1000: number;
    };
    otherDependentCredit: {
      amountPerDependent: number;
      phaseoutStart: Record<USFilingStatus, number>;
      phaseoutReductionPer1000: number;
    };
  };
}


