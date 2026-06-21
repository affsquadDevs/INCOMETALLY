import type { TaxData } from '@/types/tax';
import type { PLOptionsData, PLTaxOptions } from '@/types/pl';
import { deannualizeIncome } from './calc';
import type {
  NetIncomeResult,
  SocialContribBreakdown,
  SocialContribResult,
  TaxBreakdown,
} from './types';

function round(value: number, nearestCent: boolean): number {
  return nearestCent ? Math.round(value * 100) / 100 : value;
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

// PIT scale with the tax-reducing amount (kwota wolna realized via the 3,600 credit).
function scaleTax(base: number, pl: PLOptionsData): number {
  if (base <= 0) return 0;
  const raw =
    base <= pl.threshold
      ? base * pl.rateLow
      : pl.threshold * pl.rateLow + (base - pl.threshold) * pl.rateHigh;
  return Math.max(0, raw - pl.taxReducingAmount);
}

function childReliefAmount(children: number, pl: PLOptionsData): number {
  const n = Math.max(0, Math.floor(children));
  if (n === 0) return 0;
  let credit = 0;
  if (n >= 1) credit += pl.childRelief.first;
  if (n >= 2) credit += pl.childRelief.second;
  if (n >= 3) credit += pl.childRelief.third;
  if (n >= 4) credit += (n - 3) * pl.childRelief.fourthPlus;
  return credit;
}

export function computeNetPoland(
  annualGross: number,
  table: TaxData,
  options: PLTaxOptions,
  pl: PLOptionsData,
  hoursPerWeek = 40,
  weeksPerYear = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  const nearest = table.roundingRules.nearestCent;
  const preTax = clampNumber(options.preTaxDeductible, 0, annualGross);

  // Employee ZUS social contributions (deductible from the PIT base).
  const cappedBase = Math.min(annualGross, pl.zus.annualCap);
  const pension = cappedBase * pl.zus.pension;
  const disability = cappedBase * pl.zus.disability;
  const sickness = annualGross * pl.zus.sickness; // uncapped
  const zusTotal = pension + disability + sickness;

  // Health contribution: base = gross minus ZUS; NOT tax-deductible.
  const healthBase = Math.max(0, annualGross - zusTotal);
  const health = healthBase * pl.health.rate;

  // Relief for the young (under 26): exempts employment income up to the limit.
  const exemptYoung = options.under26
    ? Math.min(annualGross, pl.under26ExemptLimit)
    : 0;

  // PIT base = gross - exempt income - deductible ZUS - deductible contributions.
  const base = Math.max(0, annualGross - exemptYoung - zusTotal - preTax);

  const incomeTaxBeforeCredits =
    options.filingStatus === 'joint'
      ? 2 * scaleTax(base / 2, pl)
      : scaleTax(base, pl);

  // Child relief is a tax credit; floored at 0 here (Poland refunds unused credit
  // up to ZUS/health paid, which we do not model).
  const childCredit = childReliefAmount(options.children, pl);
  const incomeTax = Math.max(0, incomeTaxBeforeCredits - childCredit);

  const capShown = pl.zus.annualCap < annualGross ? pl.zus.annualCap : undefined;
  const breakdownContribs: SocialContribBreakdown[] = [
    { name: 'Pension insurance (Emerytalne)', amount: round(pension, nearest), rate: pl.zus.pension, cappedAmount: capShown },
    { name: 'Disability insurance (Rentowe)', amount: round(disability, nearest), rate: pl.zus.disability, cappedAmount: capShown },
    { name: 'Sickness insurance (Chorobowe)', amount: round(sickness, nearest), rate: pl.zus.sickness },
    { name: 'Health insurance (Zdrowotne)', amount: round(health, nearest), rate: pl.health.rate },
  ];
  const socialTotal = pension + disability + sickness + health;
  const socialContributions: SocialContribResult = {
    totalAnnual: round(socialTotal, nearest),
    breakdown: breakdownContribs,
  };

  const adjusted = annualGross - preTax;
  const netAnnual = adjusted - zusTotal - health - incomeTax;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + zusTotal + health;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: { total: 0 },
    adjustedGrossIncome: preTax > 0 ? adjusted : undefined,
    taxableIncome: base,
    incomeTax: round(incomeTax, nearest),
    socialContributions,
    netIncome: netAnnual,
    effectiveTaxRate,
    preTaxDeductions: preTax > 0 ? { entered: preTax, applied: preTax } : undefined,
  };

  return {
    netAnnual: round(netAnnual, nearest),
    netMonthly: round(deannualized.monthly, nearest),
    netHourly: round(deannualized.hourly, nearest),
    effectiveTaxRate: Math.round(effectiveTaxRate * 1000000) / 1000000,
    breakdown,
  };
}
