import { TaxData, TaxBracket, SocialContribution } from '@/types/tax';

export type IncomeMode = 'hourly' | 'monthly' | 'yearly';

export interface SocialContribBreakdown {
  name: string;
  amount: number;
  rate: number;
  cappedAmount?: number;
}

export interface SocialContribResult {
  totalAnnual: number;
  breakdown: SocialContribBreakdown[];
}

export interface TaxBreakdown {
  grossIncome: number;
  allowances: {
    standardDeduction?: number;
    personalAllowance?: number;
    total: number;
  };
  adjustedGrossIncome?: number;
  taxableIncome: number;
  preTaxDeductions?: {
    entered: number;
    applied: number;
  };
  incomeTax: number;
  incomeTaxComponents?: {
    baseIncomeTax: number;
    solidaritySurcharge?: number;
    churchTax?: number;
    federalIncomeTaxBeforeCredits?: number;
    taxCredits?: number;
    federalIncomeTaxAfterCredits?: number;
    stateIncomeTax?: number;
    localIncomeTax?: number;
    studentLoan?: number;
    marriageAllowance?: number;
    highIncomeChildBenefitCharge?: number;
  };
  socialContributions: SocialContribResult;
  netIncome: number;
  effectiveTaxRate: number;
}

export interface NetIncomeResult {
  netAnnual: number;
  netMonthly: number;
  netHourly: number;
  effectiveTaxRate: number;
  breakdown: TaxBreakdown;
}

export interface DeannualizedIncome {
  hourly: number;
  monthly: number;
  yearly: number;
}
