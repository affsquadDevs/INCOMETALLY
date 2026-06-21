import type { TaxData } from '@/types/tax';
import type { PTBracket, PTOptionsData, PTTaxOptions } from '@/types/pt';
import { deannualizeIncome } from './calc';
import type { NetIncomeResult, SocialContribResult, TaxBreakdown } from './types';

function round(value: number, nearestCent: boolean): number {
  return nearestCent ? Math.round(value * 100) / 100 : value;
}

// Progressive tax over marginal brackets, applying a per-bracket rate reduction
// (used for Azores / Madeira regional reductions).
function progressive(taxable: number, brackets: PTBracket[], reduction: number[]): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (let i = 0; i < brackets.length; i++) {
    const cap = brackets[i].to === null ? Infinity : (brackets[i].to as number);
    const upper = Math.min(taxable, cap);
    const slice = Math.max(0, upper - prev);
    const rate = brackets[i].rate * (1 - (reduction[i] ?? 0));
    tax += slice * rate;
    prev = cap;
    if (taxable <= cap) break;
  }
  return tax;
}

export function computeNetPortugal(
  annualGross: number,
  table: TaxData,
  options: PTTaxOptions,
  pt: PTOptionsData,
  hoursPerWeek = 40,
  weeksPerYear = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  const nearest = table.roundingRules.nearestCent;

  // Employee Social Security (11%, no ceiling).
  const socialSecurity = annualGross * pt.ssRate;

  // Specific deduction for employment income = max(8.54 x IAS, actual SS).
  const specificDeduction = Math.max(pt.specificDeduction, socialSecurity);

  const base = Math.max(0, annualGross - specificDeduction);
  const reduction = pt.regionalReduction[options.region] ?? pt.regionalReduction.mainland;

  const incomeTaxBeforeCredits =
    options.filingStatus === 'joint'
      ? 2 * progressive(base / 2, pt.brackets, reduction)
      : progressive(base, pt.brackets, reduction);

  const dependantCredit = Math.max(0, Math.floor(options.dependants)) * pt.dependantCredit;
  const incomeTax = Math.max(0, incomeTaxBeforeCredits - dependantCredit);

  const socialContributions: SocialContribResult = {
    totalAnnual: round(socialSecurity, nearest),
    breakdown: [
      {
        name: 'Social Security (Seguranca Social)',
        amount: round(socialSecurity, nearest),
        rate: pt.ssRate,
      },
    ],
  };

  const netAnnual = annualGross - socialSecurity - incomeTax;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + socialSecurity;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      total: round(specificDeduction, nearest),
    },
    taxableIncome: base,
    incomeTax: round(incomeTax, nearest),
    socialContributions,
    netIncome: netAnnual,
    effectiveTaxRate,
  };

  return {
    netAnnual: round(netAnnual, nearest),
    netMonthly: round(deannualized.monthly, nearest),
    netHourly: round(deannualized.hourly, nearest),
    effectiveTaxRate: Math.round(effectiveTaxRate * 1000000) / 1000000,
    breakdown,
  };
}
