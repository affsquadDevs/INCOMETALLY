/**
 * Type definitions for tax calculation engine
 */

import { TaxData, TaxBracket, SocialContribution } from '@/types/tax';

/**
 * Income calculation mode
 */
export type IncomeMode = 'hourly' | 'monthly' | 'yearly';

/**
 * Breakdown item for social contributions
 */
export interface SocialContribBreakdown {
  name: string;
  amount: number;
  rate: number;
  cappedAmount?: number; // The amount that was actually used for calculation (min of gross and cap)
}

/**
 * Social contribution calculation result
 */
export interface SocialContribResult {
  totalAnnual: number;
  breakdown: SocialContribBreakdown[];
}

/**
 * Detailed breakdown for UI charts
 */
export interface TaxBreakdown {
  grossIncome: number;
  allowances: {
    standardDeduction?: number;
    personalAllowance?: number;
    total: number;
  };
  taxableIncome: number;
  incomeTax: number;
  socialContributions: SocialContribResult;
  netIncome: number;
  effectiveTaxRate: number; // (incomeTax + socialContributions) / grossIncome
}

/**
 * Net income calculation result
 */
export interface NetIncomeResult {
  netAnnual: number;
  netMonthly: number;
  netHourly: number;
  effectiveTaxRate: number;
  breakdown: TaxBreakdown;
}

/**
 * Deannualized income result
 */
export interface DeannualizedIncome {
  hourly: number;
  monthly: number;
  yearly: number;
}

