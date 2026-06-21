import type { TaxData } from '@/types/tax';
import type { FRBracket, FROptionsData, FRTaxOptions } from '@/types/fr';
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

function bareme(quotient: number, brackets: FRBracket[]): number {
  if (quotient <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    const cap = b.to === null ? Infinity : b.to;
    const upper = Math.min(quotient, cap);
    const slice = Math.max(0, upper - prev);
    tax += slice * b.rate;
    prev = cap;
    if (quotient <= cap) break;
  }
  return tax;
}

function computeParts(filingStatus: FRTaxOptions['filingStatus'], children: number) {
  const baseParts = filingStatus === 'married' ? 2 : 1;
  const n = Math.max(0, Math.floor(children));
  let childParts = 0;
  if (n >= 1) childParts += 0.5;
  if (n >= 2) childParts += 0.5;
  if (n >= 3) childParts += (n - 2) * 1.0;
  return { parts: baseParts + childParts, baseParts };
}

export function computeNetFrance(
  annualGross: number,
  table: TaxData,
  options: FRTaxOptions,
  fr: FROptionsData,
  hoursPerWeek = 40,
  weeksPerYear = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }
  const nearest = table.roundingRules.nearestCent;
  const c = fr.cotisations;
  const P = fr.pass;

  const t1 = Math.min(annualGross, P);
  const t2 = Math.max(0, Math.min(annualGross, 8 * P) - P);

  const vieillessePlaf = c.vieillessePlaf * t1;
  const vieillesseDeplaf = c.vieillesseDeplaf * annualGross;
  const agirc = c.agircT1 * t1 + c.agircT2 * t2;

  const csgBase =
    c.csgBaseRate * Math.min(annualGross, c.csgBaseCapPassMultiple * P) +
    Math.max(0, annualGross - c.csgBaseCapPassMultiple * P);
  const csgDeductible = c.csgDeductibleRate * csgBase;
  const csgNonDeductible = c.csgNonDeductibleRate * csgBase;
  const crds = c.crdsRate * csgBase;

  const pensionTotal = vieillessePlaf + vieillesseDeplaf + agirc;
  const deductibleCotisations = pensionTotal + csgDeductible;
  const nonDeductibleCotisations = csgNonDeductible + crds;
  const totalCotisations = deductibleCotisations + nonDeductibleCotisations;

  // Taxable salary = gross - deductible cotisations - 10% professional deduction.
  const afterCotis = Math.max(0, annualGross - deductibleCotisations);
  const deduction10 = Math.min(
    Math.max(afterCotis * fr.deduction10.rate, fr.deduction10.min),
    fr.deduction10.max
  );
  const revenuImposable = Math.max(0, afterCotis - deduction10);

  // Income tax via the family quotient, with plafonnement.
  const { parts, baseParts } = computeParts(options.filingStatus, options.children);
  const taxWithParts = bareme(revenuImposable / parts, fr.brackets) * parts;
  const taxWithBaseParts = bareme(revenuImposable / baseParts, fr.brackets) * baseParts;
  const advantage = taxWithBaseParts - taxWithParts;
  const maxAdvantage = ((parts - baseParts) / 0.5) * fr.halfPartCap;
  let tax = advantage > maxAdvantage ? taxWithBaseParts - maxAdvantage : taxWithParts;

  // Decote (low-income reduction).
  const isCouple = options.filingStatus === 'married';
  const threshold = isCouple ? fr.decote.coupleThreshold : fr.decote.singleThreshold;
  const amount = isCouple ? fr.decote.coupleAmount : fr.decote.singleAmount;
  if (tax <= threshold) {
    const decote = Math.max(0, amount - fr.decote.rate * tax);
    tax = Math.max(0, tax - decote);
  }
  const incomeTax = Math.max(0, tax);

  const breakdownContribs: SocialContribBreakdown[] = [
    {
      name: 'Pension (vieillesse + Agirc-Arrco)',
      amount: round(pensionTotal, nearest),
      rate: annualGross > 0 ? pensionTotal / annualGross : 0,
    },
    {
      name: 'CSG',
      amount: round(csgDeductible + csgNonDeductible, nearest),
      rate: annualGross > 0 ? (csgDeductible + csgNonDeductible) / annualGross : 0,
    },
    {
      name: 'CRDS',
      amount: round(crds, nearest),
      rate: annualGross > 0 ? crds / annualGross : 0,
    },
  ];
  const socialContributions: SocialContribResult = {
    totalAnnual: round(totalCotisations, nearest),
    breakdown: breakdownContribs,
  };

  const netAnnual = annualGross - totalCotisations - incomeTax;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + totalCotisations;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: { total: round(deduction10, nearest) },
    taxableIncome: revenuImposable,
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
