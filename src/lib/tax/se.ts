import type { TaxData } from '@/types/tax';
import type { SEOptionsData, SETaxOptions } from '@/types/se';
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

// Grundavdrag (basic allowance), under 66, per Skatteverket SKV 433.
// FI rounded down to nearest 100; result rounded up to nearest 100; never exceeds FI.
function grundavdrag(fiRaw: number, pbb: number): number {
  const fi = Math.floor(fiRaw / 100) * 100;
  let ga: number;
  if (fi <= 0.99 * pbb) ga = 0.423 * pbb;
  else if (fi <= 2.72 * pbb) ga = 0.423 * pbb + 0.2 * (fi - 0.99 * pbb);
  else if (fi <= 3.11 * pbb) ga = 0.77 * pbb;
  else if (fi <= 7.88 * pbb) ga = 0.77 * pbb - 0.1 * (fi - 3.11 * pbb);
  else ga = 0.293 * pbb;
  ga = Math.ceil(ga / 100) * 100;
  return Math.min(ga, fi);
}

// Jobbskatteavdrag (earned income tax credit), under 66, per Skatteverket SKV 433 2026.
// Reduces municipal income tax only. ki = municipal rate (decimal).
function jobbskatteavdrag(aiRaw: number, ga: number, ki: number, pbb: number): number {
  const ai = Math.floor(aiRaw / 100) * 100;
  let basis: number;
  if (ai <= 0.91 * pbb) basis = ai - ga;
  else if (ai <= 3.24 * pbb) basis = 0.91 * pbb + 0.3874 * (ai - 0.91 * pbb) - ga;
  else if (ai <= 8.08 * pbb) basis = 1.813 * pbb + 0.251 * (ai - 3.24 * pbb) - ga;
  else basis = 3.027 * pbb - ga;
  return Math.floor(Math.max(0, basis) * ki);
}

export function computeNetSweden(
  annualGross: number,
  table: TaxData,
  options: SETaxOptions,
  se: SEOptionsData,
  hoursPerWeek = 40,
  weeksPerYear = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  const nearest = table.roundingRules.nearestCent;

  const preset = se.municipalities.find((m) => m.id === options.municipality);
  const municipalRate =
    options.municipality === 'custom'
      ? clampNumber(options.customMunicipalRate, 0, 100) / 100
      : preset
        ? preset.rate
        : se.municipalities[0].rate;

  const ga = grundavdrag(annualGross, se.pbb);
  const taxable = Math.max(0, Math.floor(annualGross / 100) * 100 - ga);

  const municipalTax = taxable * municipalRate;
  const stateTax = Math.max(0, taxable - se.skiktgrans) * se.stateRate;
  const jsa = jobbskatteavdrag(annualGross, ga, municipalRate, se.pbb);
  const jsaApplied = Math.min(jsa, municipalTax);
  const incomeTax = municipalTax + stateTax - jsaApplied;

  const churchFee = options.churchMember ? taxable * se.churchFeeRate : 0;

  const socialBreakdown: SocialContribBreakdown[] = [];
  if (churchFee > 0) {
    socialBreakdown.push({
      name: 'Church fee (kyrkoavgift)',
      amount: round(churchFee, nearest),
      rate: se.churchFeeRate,
    });
  }
  const socialContributions: SocialContribResult = {
    totalAnnual: round(churchFee, nearest),
    breakdown: socialBreakdown,
  };

  const netAnnual = annualGross - incomeTax - churchFee;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + churchFee;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      total: round(ga, nearest),
    },
    taxableIncome: taxable,
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
