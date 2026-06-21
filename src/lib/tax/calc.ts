import { TaxData } from '@/types/tax';
import {
  IncomeMode,
  SocialContribResult,
  SocialContribBreakdown,
  NetIncomeResult,
  TaxBreakdown,
  DeannualizedIncome,
} from './types';

function round(value: number, nearestCent: boolean): number {
  if (nearestCent) {
    return Math.round(value * 100) / 100;
  }
  return value;
}

export function annualizeIncome(
  mode: IncomeMode,
  value: number,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): number {
  if (value < 0) {
    throw new Error('Income value cannot be negative');
  }
  if (hoursPerWeek <= 0 || hoursPerWeek > 168) {
    throw new Error('Hours per week must be between 1 and 168');
  }
  if (weeksPerYear <= 0 || weeksPerYear > 52) {
    throw new Error('Weeks per year must be between 1 and 52');
  }

  switch (mode) {
    case 'hourly':
      return value * hoursPerWeek * weeksPerYear;
    case 'monthly':
      return value * 12;
    case 'yearly':
      return value;
    default:
      throw new Error(`Invalid income mode: ${mode}`);
  }
}

export function deannualizeIncome(
  annualGross: number,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): DeannualizedIncome {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }
  if (hoursPerWeek <= 0 || hoursPerWeek > 168) {
    throw new Error('Hours per week must be between 1 and 168');
  }
  if (weeksPerYear <= 0 || weeksPerYear > 52) {
    throw new Error('Weeks per year must be between 1 and 52');
  }

  const totalHoursPerYear = hoursPerWeek * weeksPerYear;

  return {
    hourly: totalHoursPerYear > 0 ? annualGross / totalHoursPerYear : 0,
    monthly: annualGross / 12,
    yearly: annualGross,
  };
}

export function computeIncomeTax(
  annualGross: number,
  table: TaxData,
  preTaxDeduction: number = 0
): number {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  const { brackets, allowances, roundingRules } = table;

  let totalAllowance = 0;
  if (allowances.standardDeduction !== undefined) {
    totalAllowance = Math.max(totalAllowance, allowances.standardDeduction);
  }
  if (allowances.personalAllowance !== undefined) {
    totalAllowance = Math.max(totalAllowance, allowances.personalAllowance);
  }

  const taxableIncome = Math.max(0, annualGross - totalAllowance - Math.max(0, preTaxDeduction));

  if (taxableIncome <= 0) {
    return 0;
  }

  let totalTax = 0;
  let previousBracketEnd = -1;

  for (const bracket of brackets) {
    const bracketStart = bracket.from;
    const bracketEnd = bracket.to === null ? Infinity : bracket.to;

    if (bracketStart > taxableIncome) {
      continue;
    }

    const effectiveStart = previousBracketEnd + 1;
    const effectiveEnd = Math.min(
      taxableIncome,
      bracketEnd === Infinity ? taxableIncome : bracketEnd
    );
    const incomeInBracket = Math.max(0, effectiveEnd - previousBracketEnd);

    if (incomeInBracket > 0) {
      const taxInBracket = incomeInBracket * bracket.rate;
      totalTax += taxInBracket;
    }

    if (bracketEnd !== Infinity) {
      previousBracketEnd = bracketEnd;
    } else {
      previousBracketEnd = taxableIncome;
    }

    if (bracketEnd === Infinity && taxableIncome > bracketStart) {
      break;
    }
  }

  return round(totalTax, roundingRules.nearestCent);
}

export function computeSocialContrib(annualGross: number, table: TaxData): SocialContribResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  const { socialContrib, roundingRules } = table;
  const breakdown: SocialContribBreakdown[] = [];
  let totalAnnual = 0;

  for (const contrib of socialContrib) {
    let cappedAmount: number;
    if (contrib.cap !== undefined) {
      cappedAmount = Math.min(annualGross, contrib.cap);
    } else {
      cappedAmount = annualGross;
    }

    const amount = cappedAmount * contrib.rate;

    breakdown.push({
      name: contrib.name,
      amount: round(amount, roundingRules.nearestCent),
      rate: contrib.rate,
      cappedAmount: contrib.cap !== undefined ? cappedAmount : undefined,
    });

    totalAnnual += amount;
  }

  return {
    totalAnnual: round(totalAnnual, roundingRules.nearestCent),
    breakdown,
  };
}

export function computeNet(
  annualGross: number,
  table: TaxData,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  // Social contributions are computed first because, in some countries, the
  // deductible portion reduces the income-tax base.
  const socialContrib = computeSocialContrib(annualGross, table);
  let deductibleSocial = 0;
  table.socialContrib.forEach((contrib, index) => {
    if (contrib.deductible) {
      deductibleSocial += socialContrib.breakdown[index]?.amount ?? 0;
    }
  });

  const incomeTax = computeIncomeTax(annualGross, table, deductibleSocial);
  const netAnnual = annualGross - incomeTax - socialContrib.totalAnnual;
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);
  const totalTaxes = incomeTax + socialContrib.totalAnnual;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  const { allowances } = table;
  let totalAllowance = 0;
  if (allowances.standardDeduction !== undefined) {
    totalAllowance = Math.max(totalAllowance, allowances.standardDeduction);
  }
  if (allowances.personalAllowance !== undefined) {
    totalAllowance = Math.max(totalAllowance, allowances.personalAllowance);
  }

  const taxableIncome = Math.max(0, annualGross - totalAllowance - deductibleSocial);

  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      standardDeduction: allowances.standardDeduction,
      personalAllowance: allowances.personalAllowance,
      total: totalAllowance,
    },
    taxableIncome,
    incomeTax,
    socialContributions: socialContrib,
    netIncome: netAnnual,
    effectiveTaxRate,
  };

  return {
    netAnnual: round(netAnnual, table.roundingRules.nearestCent),
    netMonthly: round(deannualized.monthly, table.roundingRules.nearestCent),
    netHourly: round(deannualized.hourly, table.roundingRules.nearestCent),
    effectiveTaxRate: Math.round(effectiveTaxRate * 1000000) / 1000000,
    breakdown,
  };
}
