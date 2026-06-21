import type { TaxData } from '@/types/tax';
import type { TaxBracket } from '@/types/tax';
import type { UKOptionsData, UKTaxOptions } from '@/types/uk';
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

function calculatePersonalAllowance(
  adjustedIncome: number,
  uk: UKOptionsData
): number {
  const { base, phaseOutStart, phaseOutEnd } = uk.personalAllowance;

  if (adjustedIncome <= phaseOutStart) {
    return base;
  }

  if (adjustedIncome >= phaseOutEnd) {
    return 0;
  }

  const excess = adjustedIncome - phaseOutStart;
  const reduction = excess / 2;
  return Math.max(0, base - reduction);
}

function computeNationalInsurance(
  adjustedIncome: number,
  uk: UKOptionsData,
  roundingRules: TaxData['roundingRules']
): SocialContribResult {
  const { primaryThreshold, upperEarningsLimit, rateBasic, rateHigher } = uk.nationalInsurance;

  const breakdown: SocialContribBreakdown[] = [];
  let totalAnnual = 0;

  const basicRateBase = Math.max(0, Math.min(adjustedIncome, upperEarningsLimit) - primaryThreshold);
  if (basicRateBase > 0) {
    const basicRateAmount = basicRateBase * rateBasic;
    breakdown.push({
      name: 'National Insurance (Class 1)',
      amount: round(basicRateAmount, roundingRules.nearestCent),
      rate: rateBasic,
      cappedAmount: basicRateBase + primaryThreshold,
    });
    totalAnnual += basicRateAmount;
  }

  const higherRateBase = Math.max(0, adjustedIncome - upperEarningsLimit);
  if (higherRateBase > 0) {
    const higherRateAmount = higherRateBase * rateHigher;
    breakdown.push({
      name: 'National Insurance (Class 1, Higher)',
      amount: round(higherRateAmount, roundingRules.nearestCent),
      rate: rateHigher,
      cappedAmount: adjustedIncome,
    });
    totalAnnual += higherRateAmount;
  }

  return {
    totalAnnual: round(totalAnnual, roundingRules.nearestCent),
    breakdown,
  };
}

function computeStudentLoan(
  adjustedIncome: number,
  options: UKTaxOptions,
  uk: UKOptionsData,
  roundingRules: TaxData['roundingRules']
): number {
  if (options.studentLoanPlan === 'none') {
    return 0;
  }

  const plan = uk.studentLoan[options.studentLoanPlan];
  if (!plan) {
    return 0;
  }

  if (adjustedIncome <= plan.threshold) {
    return 0;
  }

  const repayment = (adjustedIncome - plan.threshold) * plan.rate;
  return round(repayment, roundingRules.nearestCent);
}

export function computeNetUK(
  annualGross: number,
  table: TaxData,
  options: UKTaxOptions,
  uk: UKOptionsData,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  // Normalize/sanitize user inputs
  const normalized: UKTaxOptions = {
    ...options,
    preTaxPension: clampNumber(options.preTaxPension, 0, annualGross),
    preTaxOther: clampNumber(options.preTaxOther, 0, annualGross),
  };

  const { roundingRules } = table;

  // Step 2: Pre-tax deductions (salary sacrifice) → Adjusted Income
  const preTaxDeductions = normalized.preTaxPension + normalized.preTaxOther;
  const adjustedIncome = Math.max(0, annualGross - preTaxDeductions);

  // Step 3: Personal Allowance (with phase-out)
  const personalAllowance = calculatePersonalAllowance(adjustedIncome, uk);

  // Step 4: Taxable Income = max(0, Adjusted Income - Personal Allowance)
  const taxableIncome = Math.max(0, adjustedIncome - personalAllowance);

  // Step 5: Income Tax (progressive brackets)
  // IMPORTANT: Brackets in uk-options.json are absolute (from adjusted income),
  // but we need to apply them to taxable income (which already has allowance subtracted).
  // Convert brackets to be relative to taxable income (starting from 0).
  const brackets: TaxBracket[] = uk.incomeTaxBands
    .filter(b => b.rate > 0) // Skip the 0% bracket (Personal Allowance already applied)
    .map(b => ({
      from: Math.max(0, b.from - personalAllowance), // Convert to taxable income basis
      to: b.to === null ? null : Math.max(0, b.to - personalAllowance),
      rate: b.rate,
    }))
    .filter(b => b.to === null || b.to > 0) // Remove brackets that are fully below taxable income
    .map((b, index, arr) => {
      // Ensure first bracket starts from 0
      if (index === 0 && b.from > 0) {
        return { ...b, from: 0 };
      }
      return b;
    });
  
  const incomeTax = round(computeProgressiveTax(taxableIncome, brackets), roundingRules.nearestCent);

  // Step 6: National Insurance (Class 1)
  const nationalInsurance = computeNationalInsurance(adjustedIncome, uk, roundingRules);

  // Step 7: Student Loan
  const studentLoan = computeStudentLoan(adjustedIncome, normalized, uk, roundingRules);

  // Step 8: Marriage Allowance (recipient must be a basic-rate taxpayer with a non-taxpayer partner)
  const higherRateBand = uk.incomeTaxBands.find((b) => b.rate >= 0.4);
  const higherRateThreshold = higherRateBand ? higherRateBand.from : Infinity;
  let marriageAllowanceRelief = 0;
  if (
    normalized.marriageAllowance &&
    adjustedIncome > personalAllowance &&
    adjustedIncome < higherRateThreshold
  ) {
    marriageAllowanceRelief = Math.min(incomeTax, uk.marriageAllowance.benefit);
  }

  // Step 9: High Income Child Benefit Charge (HICBC)
  const kids = Math.max(0, Math.floor(normalized.children || 0));
  const childBenefit =
    kids >= 1 ? uk.childBenefit.firstChild + (kids - 1) * uk.childBenefit.additionalChild : 0;
  let hicbc = 0;
  if (childBenefit > 0 && adjustedIncome > uk.hicbc.threshold) {
    const fraction = Math.min(
      1,
      Math.max(0, (adjustedIncome - uk.hicbc.threshold) / (uk.hicbc.fullThreshold - uk.hicbc.threshold))
    );
    hicbc = round(childBenefit * fraction, roundingRules.nearestCent);
  }

  const netIncomeTax = round(incomeTax - marriageAllowanceRelief + hicbc, roundingRules.nearestCent);

  // Step 10: Net Income = Adjusted Income - Income Tax (incl. MA/HICBC) - NI - Student Loan
  const netAnnual = adjustedIncome - netIncomeTax - nationalInsurance.totalAnnual - studentLoan;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalDeductions = netIncomeTax + nationalInsurance.totalAnnual + studentLoan;
  const effectiveTaxRate = annualGross > 0 ? totalDeductions / annualGross : 0;

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      personalAllowance: personalAllowance,
      total: personalAllowance,
    },
    adjustedGrossIncome: adjustedIncome, // Adjusted income after pre-tax deductions
    taxableIncome,
    incomeTax: netIncomeTax, // Income tax incl. Marriage Allowance / HICBC (student loan shown separately)
    incomeTaxComponents: {
      baseIncomeTax: incomeTax,
      studentLoan: studentLoan > 0 ? studentLoan : undefined, // Store student loan for UK display
      marriageAllowance: marriageAllowanceRelief > 0 ? marriageAllowanceRelief : undefined,
      highIncomeChildBenefitCharge: hicbc > 0 ? hicbc : undefined,
    },
    socialContributions: nationalInsurance,
    netIncome: netAnnual,
    effectiveTaxRate,
    // Store salary sacrifice (pre-tax deductions) for UK display
    preTaxDeductions: preTaxDeductions > 0 ? {
      entered: preTaxDeductions,
      applied: preTaxDeductions, // Already capped in normalized
    } : undefined,
  };

  // Store student loan amount for UI (we'll access it via a custom approach)
  // For now, we'll calculate it in the UI component from options

  return {
    netAnnual: round(netAnnual, roundingRules.nearestCent),
    netMonthly: round(deannualized.monthly, roundingRules.nearestCent),
    netHourly: round(deannualized.hourly, roundingRules.nearestCent),
    effectiveTaxRate: Math.round(effectiveTaxRate * 1000000) / 1000000,
    breakdown,
  };
}

