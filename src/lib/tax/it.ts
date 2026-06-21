import type { TaxData } from '@/types/tax';
import type { ITOptionsData, ITTaxOptions } from '@/types/it';
import { deannualizeIncome } from './calc';
import type { NetIncomeResult, SocialContribResult, TaxBreakdown } from './types';

function round(value: number, nearestCent: boolean): number {
  return nearestCent ? Math.round(value * 100) / 100 : value;
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function progressive(taxable: number, brackets: ITOptionsData['brackets']): number {
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

// Employee detrazioni for employment income (Art. 13 TUIR), on reddito complessivo.
function lavoroDipendenteDetrazione(reddito: number, d: ITOptionsData['detrazione']): number {
  let det: number;
  if (reddito <= 15000) det = d.upTo15000;
  else if (reddito <= 28000) det = d.band2Base + (d.band2Var * (28000 - reddito)) / d.band2Width;
  else if (reddito <= 50000) det = (d.band3Base * (50000 - reddito)) / d.band3Width;
  else det = 0;
  if (reddito > d.bonus65Low && reddito <= d.bonus65High) det += d.bonus65;
  return Math.max(0, det);
}

// Dependent-spouse credit (coniuge a carico), Art. 12 TUIR (simplified taper).
function spouseCreditAmount(reddito: number, s: ITOptionsData['spouseCredit']): number {
  if (reddito <= s.band1) return Math.max(0, s.base - s.taper * (reddito / s.band1));
  if (reddito <= s.band2) return s.flat;
  if (reddito <= s.band3) return Math.max(0, s.flat * ((s.band3 - reddito) / (s.band3 - s.band2)));
  return 0;
}

export function computeNetItaly(
  annualGross: number,
  table: TaxData,
  options: ITTaxOptions,
  it: ITOptionsData,
  hoursPerWeek = 40,
  weeksPerYear = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }
  const nearest = table.roundingRules.nearestCent;

  // Employee INPS contribution (deductible): 9.19% up to the massimale, +1% above the prima fascia.
  const cappedBase = Math.min(annualGross, it.inps.massimale);
  const inpsAmount =
    cappedBase * it.inps.rate +
    Math.max(0, cappedBase - it.inps.primaFascia) * it.inps.extraRate;

  const base = Math.max(0, annualGross - inpsAmount);

  const irpefGross = progressive(base, it.brackets);
  const det = lavoroDipendenteDetrazione(annualGross, it.detrazione);
  const childCredit = Math.max(0, Math.floor(options.dependentChildren)) * it.dependentChildCredit;
  const spouseCredit = options.dependentSpouse ? spouseCreditAmount(annualGross, it.spouseCredit) : 0;
  const irpefNet = Math.max(0, irpefGross - det - childCredit - spouseCredit);

  const presetRegion = it.regions.find((r) => r.id === options.region);
  const regionalRate =
    options.region === 'custom'
      ? clampNumber(options.customRegionalRate, 0, 10) / 100
      : presetRegion
        ? presetRegion.rate
        : it.regions[0].rate;
  const municipalRate = clampNumber(options.municipalRate, 0, 2) / 100;

  const regionalTax = base * regionalRate;
  const municipalTax = base * municipalRate;
  const incomeTax = irpefNet + regionalTax + municipalTax;

  const socialContributions: SocialContribResult = {
    totalAnnual: round(inpsAmount, nearest),
    breakdown: [
      {
        name: 'INPS pension contribution',
        amount: round(inpsAmount, nearest),
        rate: it.inps.rate,
        cappedAmount: it.inps.massimale < annualGross ? it.inps.massimale : undefined,
      },
    ],
  };

  const netAnnual = annualGross - inpsAmount - incomeTax;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + inpsAmount;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: { total: 0 },
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
