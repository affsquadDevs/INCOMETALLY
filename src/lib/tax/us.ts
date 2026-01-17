import type { TaxData } from '@/types/tax';
import type { TaxBracket } from '@/types/tax';
import type { USOptionsData, USTaxOptions, USFilingStatus } from '@/types/us';
import { deannualizeIncome } from './calc';
import type { NetIncomeResult, SocialContribBreakdown, SocialContribResult, TaxBreakdown } from './types';

function round(value: number, nearestCent: boolean): number {
  if (nearestCent) return Math.round(value * 100) / 100;
  return value;
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function computeProgressiveTax(taxableIncome: number, brackets: TaxBracket[]): number {
  if (taxableIncome <= 0) return 0;

  let totalTax = 0;
  let previousCap = 0;

  for (const bracket of brackets) {
    const cap = bracket.to === null ? Infinity : bracket.to;
    const upper = cap === Infinity ? taxableIncome : Math.min(taxableIncome, cap);

    const incomeInBracket = Math.max(0, upper - previousCap);
    if (incomeInBracket > 0) {
      totalTax += incomeInBracket * bracket.rate;
    }

    previousCap = cap === Infinity ? taxableIncome : cap;
    if (taxableIncome <= cap) break;
  }

  return totalTax;
}

function additionalStandardDeductionAmount(
  filingStatus: USFilingStatus,
  options: USTaxOptions,
  us: USOptionsData
): number {
  const isMarried = filingStatus === 'mfj' || filingStatus === 'mfs';
  const perUnit = isMarried ? us.additionalStandardDeduction.marriedOrMfs : us.additionalStandardDeduction.singleOrHoh;

  const taxpayerUnits = (options.taxpayerOver65 ? 1 : 0) + (options.taxpayerBlind ? 1 : 0);
  const spouseUnits = isMarried ? ((options.spouseOver65 ? 1 : 0) + (options.spouseBlind ? 1 : 0)) : 0;

  return (taxpayerUnits + spouseUnits) * perUnit;
}

function computeCreditsNonRefundable(
  adjustedGrossIncome: number,
  options: USTaxOptions,
  us: USOptionsData
): { creditsAfterPhaseout: number; creditsBeforePhaseout: number; phaseoutReduction: number } {
  const children = Math.max(0, Math.floor(options.childrenUnder17));
  const otherDeps = Math.max(0, Math.floor(options.otherDependents));

  const ctc = children * us.credits.childTaxCredit.amountPerChildUnder17;
  const odc = otherDeps * us.credits.otherDependentCredit.amountPerDependent;
  const creditsBeforePhaseout = ctc + odc;

  const startCtc = us.credits.childTaxCredit.phaseoutStart[options.filingStatus];
  const startOdc = us.credits.otherDependentCredit.phaseoutStart[options.filingStatus];
  const start = Math.min(startCtc, startOdc);

  const reductionPer1000 = Math.max(
    us.credits.childTaxCredit.phaseoutReductionPer1000,
    us.credits.otherDependentCredit.phaseoutReductionPer1000
  );

  const excess = Math.max(0, adjustedGrossIncome - start);
  const steps = excess <= 0 ? 0 : Math.ceil(excess / 1000);
  const phaseoutReduction = steps * reductionPer1000;

  return {
    creditsBeforePhaseout,
    phaseoutReduction,
    creditsAfterPhaseout: Math.max(0, creditsBeforePhaseout - phaseoutReduction),
  };
}

function computePayrollTaxes(
  annualGross: number,
  options: USTaxOptions,
  us: USOptionsData,
  roundingRules: TaxData['roundingRules']
): { socialContrib: SocialContribResult; seHalfDeduction: number } {
  const breakdown: SocialContribBreakdown[] = [];
  let totalAnnual = 0;

  if (options.employmentType === 'selfEmployed') {
    const p = us.payroll.selfEmployed;
    // Step 1: Calculate net earnings from self-employment
    // Net earnings = Gross × 92.35%
    const seEarnings = annualGross * p.seEarningsMultiplier;
    
    // Step 2: Calculate SE tax components
    // Social Security: 12.4% on net earnings up to wage base
    const ssTaxBase = Math.min(seEarnings, p.socialSecurityWageBase);
    const ss = ssTaxBase * p.socialSecurityRate; // 12.4%
    
    // Medicare: 2.9% on all net earnings
    const medicare = seEarnings * p.medicareRate; // 2.9%
    
    // Total SE tax = SS + Medicare = 15.3% (up to wage base for SS)
    const seTaxBase = ss + medicare;
    
    // Additional Medicare Tax: 0.9% on net earnings above threshold
    const threshold = p.additionalMedicareThreshold[options.filingStatus];
    const addl = Math.max(0, seEarnings - threshold) * p.additionalMedicareRate;

    breakdown.push(
      {
        name: 'Self-Employment Tax (Social Security)',
        amount: round(ss, roundingRules.nearestCent),
        rate: p.socialSecurityRate,
        cappedAmount: ssTaxBase,
      },
      {
        name: 'Self-Employment Tax (Medicare)',
        amount: round(medicare, roundingRules.nearestCent),
        rate: p.medicareRate,
        cappedAmount: seEarnings,
      }
    );

    if (addl > 0) {
      breakdown.push({
        name: 'Additional Medicare Tax',
        amount: round(addl, roundingRules.nearestCent),
        rate: p.additionalMedicareRate,
        cappedAmount: seEarnings,
      });
    }

    totalAnnual = ss + medicare + addl;

    // Step 3: Deductible part of SE tax (50% of SE tax, excluding Additional Medicare)
    // This reduces AGI (above-the-line deduction)
    // IRS allows deduction of 50% of SE tax (SS + Medicare portion, not Additional Medicare)
    const seHalfDeduction = 0.5 * seTaxBase; // Half of (SS + Medicare), not including Additional Medicare

    return {
      socialContrib: { totalAnnual: round(totalAnnual, roundingRules.nearestCent), breakdown },
      seHalfDeduction: round(seHalfDeduction, roundingRules.nearestCent),
    };
  }

  // Employee (W-2) payroll taxes
  const p = us.payroll.employee;
  const ssBase = Math.min(annualGross, p.socialSecurityWageBase);
  const ss = ssBase * p.socialSecurityRate;
  const medicare = annualGross * p.medicareRate;
  const threshold = p.additionalMedicareThreshold[options.filingStatus];
  const addl = Math.max(0, annualGross - threshold) * p.additionalMedicareRate;

  breakdown.push(
    {
      name: 'Social Security',
      amount: round(ss, roundingRules.nearestCent),
      rate: p.socialSecurityRate,
      cappedAmount: ssBase,
    },
    {
      name: 'Medicare',
      amount: round(medicare, roundingRules.nearestCent),
      rate: p.medicareRate,
      cappedAmount: annualGross,
    }
  );

  if (addl > 0) {
    breakdown.push({
      name: 'Additional Medicare Tax',
      amount: round(addl, roundingRules.nearestCent),
      rate: p.additionalMedicareRate,
      cappedAmount: annualGross,
    });
  }

  totalAnnual = ss + medicare + addl;
  return {
    socialContrib: { totalAnnual: round(totalAnnual, roundingRules.nearestCent), breakdown },
    seHalfDeduction: 0,
  };
}

export function computeNetUS(
  annualGross: number,
  table: TaxData,
  options: USTaxOptions,
  us: USOptionsData,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  // Normalize/sanitize user inputs (avoid NaN, negative, extreme values).
  // Store original values for breakdown display
  const preTax401kEntered = Math.max(0, options.preTax401k);
  const preTaxHSAEntered = Math.max(0, options.preTaxHSA);
  const otherPreTaxEntered = Math.max(0, options.otherPreTaxDeductions);
  const preTaxEnteredTotal = preTax401kEntered + preTaxHSAEntered + otherPreTaxEntered;
  
  // Apply caps: pre-tax deductions cannot exceed gross income
  const preTax401kApplied = Math.min(preTax401kEntered, annualGross);
  const preTaxHSAApplied = Math.min(preTaxHSAEntered, annualGross - preTax401kApplied);
  const otherPreTaxApplied = Math.min(otherPreTaxEntered, annualGross - preTax401kApplied - preTaxHSAApplied);
  const preTaxAppliedTotal = preTax401kApplied + preTaxHSAApplied + otherPreTaxApplied;
  
  const normalized: USTaxOptions = {
    ...options,
    itemizedDeductions: clampNumber(options.itemizedDeductions, 0, 1_000_000_000),
    childrenUnder17: Math.max(0, Math.floor(options.childrenUnder17)),
    otherDependents: Math.max(0, Math.floor(options.otherDependents)),
    preTax401k: preTax401kApplied,
    preTaxHSA: preTaxHSAApplied,
    otherPreTaxDeductions: otherPreTaxApplied,
    stateTaxRate: clampNumber(options.stateTaxRate, 0, 1),
    localTaxRate: clampNumber(options.localTaxRate, 0, 1),
  };

  const { roundingRules } = table;

  // Step 7 (calculated early for SE half-deduction, but applied at end): Payroll taxes (FICA)
  // For self-employed, we need the half-deduction for AGI calculation
  const { socialContrib, seHalfDeduction } = computePayrollTaxes(annualGross, normalized, us, roundingRules);

  // Step 2: Pre-tax deductions → Adjusted Gross Income (AGI)
  // AGI can be negative (before standard deduction is applied)
  // Note: SE half deduction is included in aboveLineDeductions but not in preTaxDeductions breakdown
  // (it's calculated from SE tax, not entered by user)
  const aboveLineDeductions = preTaxAppliedTotal + seHalfDeduction;
  const adjustedGrossIncome = annualGross - aboveLineDeductions; // Allow negative AGI (before standard deduction)

  // Step 3: Standard / Itemized deduction (max of the two)
  const baseStandard = us.standardDeduction[normalized.filingStatus] ?? 0;
  const additionalStandard = additionalStandardDeductionAmount(normalized.filingStatus, normalized, us);
  const standardDeductionTotal = baseStandard + additionalStandard;
  const itemized = normalized.itemizedDeductions;

  let deductionUsed = 0;
  let deductionTypeUsed: 'standard' | 'itemized';
  if (normalized.deductionMethod === 'standard') {
    deductionUsed = standardDeductionTotal;
    deductionTypeUsed = 'standard';
  } else if (normalized.deductionMethod === 'itemized') {
    deductionUsed = itemized;
    deductionTypeUsed = 'itemized';
  } else {
    deductionUsed = Math.max(standardDeductionTotal, itemized);
    deductionTypeUsed = deductionUsed === itemized ? 'itemized' : 'standard';
  }

  // Step 4: Taxable Income = max(0, AGI - deduction)
  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionUsed);

  // Step 5: Federal Income Tax (progressive brackets)
  const brackets: TaxBracket[] = us.federalBrackets[normalized.filingStatus] ?? [];
  const federalBeforeCredits = round(computeProgressiveTax(taxableIncome, brackets), roundingRules.nearestCent);

  // Step 6: Tax Credits (child tax credit, other dependents) - subtracted from federal tax
  // Credits are non-refundable (cannot reduce tax below 0)
  const { creditsAfterPhaseout } = computeCreditsNonRefundable(adjustedGrossIncome, normalized, us);
  const creditsApplied = Math.min(federalBeforeCredits, creditsAfterPhaseout);
  const federalAfterCredits = round(federalBeforeCredits - creditsApplied, roundingRules.nearestCent);

  // Step 8: State & Local tax (flat percentages on taxable income)
  const stateIncomeTax = round(taxableIncome * normalized.stateTaxRate, roundingRules.nearestCent);
  const localIncomeTax = round(taxableIncome * normalized.localTaxRate, roundingRules.nearestCent);

  const totalIncomeTax = round(federalAfterCredits + stateIncomeTax + localIncomeTax, roundingRules.nearestCent);

  // Step 9: Net Income = Gross - Federal Tax - FICA - State Tax - Local Tax
  const netAnnual = annualGross - totalIncomeTax - socialContrib.totalAnnual;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = totalIncomeTax + socialContrib.totalAnnual;
  // Effective tax rate: total taxes (income + payroll) as percentage of gross income
  // Note: This includes all taxes but does not account for pre-tax deductions or credits
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      // For US: only standard/itemized deduction (not pre-tax deductions)
      // Pre-tax deductions are already reflected in AGI
      standardDeduction: deductionTypeUsed === 'standard' ? deductionUsed : undefined,
      total: deductionUsed, // Only standard/itemized deduction, not pre-tax deductions
    },
    adjustedGrossIncome, // Can be negative (before standard deduction)
    taxableIncome, // Clamped to 0 (max(0, AGI - deduction))
    // Show pre-tax deductions entered vs applied (if capped)
    preTaxDeductions: preTaxEnteredTotal > 0 ? {
      entered: preTaxEnteredTotal,
      applied: preTaxAppliedTotal,
    } : undefined,
    incomeTax: totalIncomeTax,
    incomeTaxComponents: {
      baseIncomeTax: federalAfterCredits,
      federalIncomeTaxBeforeCredits: federalBeforeCredits,
      taxCredits: creditsApplied,
      federalIncomeTaxAfterCredits: federalAfterCredits,
      stateIncomeTax: stateIncomeTax > 0 ? stateIncomeTax : undefined,
      localIncomeTax: localIncomeTax > 0 ? localIncomeTax : undefined,
    },
    socialContributions: socialContrib,
    netIncome: netAnnual,
    effectiveTaxRate,
  };

  return {
    netAnnual: round(netAnnual, roundingRules.nearestCent),
    netMonthly: round(deannualized.monthly, roundingRules.nearestCent),
    netHourly: round(deannualized.hourly, roundingRules.nearestCent),
    effectiveTaxRate: Math.round(effectiveTaxRate * 1000000) / 1000000,
    breakdown,
  };
}


