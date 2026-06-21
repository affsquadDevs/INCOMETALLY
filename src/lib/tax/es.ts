import type { TaxData } from '@/types/tax';
import type { ESBracket, ESOptionsData, ESTaxOptions } from '@/types/es';
import { deannualizeIncome } from './calc';
import type { NetIncomeResult, SocialContribResult, TaxBreakdown } from './types';

function round(value: number, nearestCent: boolean): number {
  return nearestCent ? Math.round(value * 100) / 100 : value;
}

function progressive(taxable: number, brackets: ESBracket[]): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    const cap = b.to === null ? Infinity : b.to;
    const upper = Math.min(taxable, cap);
    const slice = Math.max(0, upper - prev);
    tax += slice * b.rate;
    prev = cap;
    if (taxable <= cap) break;
  }
  return tax;
}

function descendantMinimum(children: number, amounts: number[]): number {
  const n = Math.max(0, Math.floor(children));
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += amounts[Math.min(i, amounts.length) - 1];
  }
  return sum;
}

export function computeNetSpain(
  annualGross: number,
  table: TaxData,
  options: ESTaxOptions,
  es: ESOptionsData,
  hoursPerWeek = 40,
  weeksPerYear = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }
  const nearest = table.roundingRules.nearestCent;

  // Employee Social Security (deductible from work income), capped at the maximum base.
  const ss = Math.min(annualGross, es.ss.baseMaxima) * es.ss.rate;

  const jointReduction = options.filingStatus === 'joint' ? es.jointReduction : 0;
  // Base liquidable = gross - SS - standard work-expense deduction - joint reduction.
  const base = Math.max(0, annualGross - ss - es.otrosGastos - jointReduction);

  // Personal + family minimum is taxed at the first brackets and subtracted from the quota.
  const minimum = es.personalMinimum + descendantMinimum(options.children, es.descendantMinimums);

  const regional = es.regionalScales[options.community] ?? es.regionalScales.default;

  const stateTax = progressive(base, es.stateBrackets) - progressive(minimum, es.stateBrackets);
  const regionalTax = progressive(base, regional) - progressive(minimum, regional);
  const incomeTax = Math.max(0, stateTax + regionalTax);

  const socialContributions: SocialContribResult = {
    totalAnnual: round(ss, nearest),
    breakdown: [
      {
        name: 'Social Security (Seguridad Social)',
        amount: round(ss, nearest),
        rate: es.ss.rate,
        cappedAmount: es.ss.baseMaxima < annualGross ? es.ss.baseMaxima : undefined,
      },
    ],
  };

  const netAnnual = annualGross - ss - incomeTax;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + ss;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: { total: round(es.otrosGastos + jointReduction, nearest) },
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
