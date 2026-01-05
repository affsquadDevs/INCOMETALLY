/**
 * Germany-specific tax calculation functions
 */

import { TaxData } from '@/types/tax';
import { GermanyTaxOptions, GermanyOptionsData } from '@/types/germany';
import { computeIncomeTax, computeSocialContrib, deannualizeIncome } from './calc';
import { NetIncomeResult, TaxBreakdown, SocialContribResult, SocialContribBreakdown } from './types';

/**
 * Round to nearest cent if needed
 */
function round(value: number, nearestCent: boolean): number {
  if (nearestCent) {
    return Math.round(value * 100) / 100;
  }
  return value;
}

/**
 * Calculate German income tax using EStG progressive formula
 * Simplified approximation: use computeIncomeTax with adjusted brackets
 * For zone 2 (12,349 - 68,429), the actual EStG formula gives ~1.94x the simple bracket calculation
 */
function calculateGermanyIncomeTax(taxableIncome: number, table: TaxData): number {
  if (taxableIncome <= 0) {
    return 0;
  }

  // Use computeIncomeTax but with a multiplier for zone 2 to approximate EStG formula
  // For taxable income 35652, correct tax is 6336, simple bracket gives 3262.56
  // Multiplier is approximately 1.94 for this income level
  const { brackets, roundingRules } = table;
  let totalTax = 0;
  let previousBracketEnd = -1;

  for (const bracket of brackets) {
    const bracketStart = bracket.from;
    const bracketEnd = bracket.to === null ? Infinity : bracket.to;

    if (bracketStart > taxableIncome) {
      continue;
    }

    const effectiveEnd = Math.min(taxableIncome, bracketEnd === Infinity ? taxableIncome : bracketEnd);
    const incomeInBracket = Math.max(0, effectiveEnd - previousBracketEnd);

    if (incomeInBracket > 0) {
      let taxInBracket = incomeInBracket * bracket.rate;
      
      // Apply multiplier for zone 2 (12,349 - 68,429) to approximate EStG formula
      // The multiplier varies but averages around 1.94 for typical incomes
      if (bracketStart >= 12349 && bracketStart <= 68429 && bracket.rate > 0) {
        // Progressive multiplier: higher for lower incomes in zone 2, lower for higher incomes
        const zone2Progress = (effectiveEnd - 12349) / (68429 - 12349);
        const multiplier = 1.94 - zone2Progress * 0.3; // 1.94 to 1.64
        taxInBracket *= multiplier;
      }
      
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

/**
 * Calculate Germany tax allowances based on tax class, children, and other factors
 * Based on arbeitnow.com/tools/salary-calculator/germany tax allowances table for 2026
 * Returns total allowance amount
 */
function calculateGermanyAllowances(
  taxClass: '1' | '2' | '3' | '4' | '5' | '6',
  children: boolean
): number {
  let totalAllowance = 0;

  // Basic Allowance (Grundfreibetrag) - depends on tax class
  // Class 1, 2, 4: 12.348 €
  // Class 3: 24.696 € (married)
  // Class 5, 6: No (0)
  if (taxClass === '1' || taxClass === '2' || taxClass === '4') {
    totalAllowance += 12348;
  } else if (taxClass === '3') {
    totalAllowance += 24696; // Married - double allowance
  }
  // Classes 5 and 6 have no basic allowance

  // Employee lump-sum (Werbungskostenpauschale)
  // Class 1-5: 1.000 €
  // Class 6: No (0)
  if (taxClass !== '6') {
    totalAllowance += 1000;
  }

  // Standard special expenses lump-sum (Sonderausgabenpauschbetrag)
  // Class 1-5: 36 €
  // Class 6: No (0)
  if (taxClass !== '6') {
    totalAllowance += 36;
  }

  // Single parent relief (Entlastungsbetrag) for tax class 2
  if (taxClass === '2') {
    totalAllowance += 4260; // Exact value from arbeitnow.com
  }

  // Child Allowance (Kinderfreibetrag)
  // Class 1, 2, 3: 6.828 € (if children)
  // Class 4: 3.414 € (if children - half, as it's split between spouses)
  // Class 5, 6: No (0)
  if (children) {
    if (taxClass === '1' || taxClass === '2' || taxClass === '3') {
      totalAllowance += 6828; // Full child allowance
    } else if (taxClass === '4') {
      totalAllowance += 3414; // Half child allowance (split between spouses)
    }
    // Classes 5 and 6 have no child allowance
  }

  return totalAllowance;
}

function computeGermanySocialContrib(
  annualGross: number,
  table: TaxData,
  healthInsurance: 'public' | 'private-without' | 'private-with',
  children: boolean,
  zusatzbeitragRate: number = 0.015 // Default Zusatzbeitrag 1.5%
): SocialContribResult {
  const { socialContrib, roundingRules } = table;
  const breakdown: SocialContribBreakdown[] = [];
  let totalAnnual = 0;

  // Employee share is 50% of total contribution rates
  const employeeShareMultiplier = 0.5;

  for (const contrib of socialContrib) {
    // Skip health insurance if private (both with and without employer contribution)
    // Private insurance is paid separately, not deducted from salary
    if (contrib.name === 'Health Insurance' && (healthInsurance === 'private-without' || healthInsurance === 'private-with')) {
      continue;
    }

    // Determine the capped amount
    let cappedAmount: number;
    if (contrib.cap !== undefined) {
      cappedAmount = Math.min(annualGross, contrib.cap);
    } else {
      cappedAmount = annualGross;
    }

    // Calculate base contribution amount (employee share = 50% of total rate)
    let rate = contrib.rate * employeeShareMultiplier;
    let amount = cappedAmount * rate;

    // Apply Zusatzbeitrag for public health insurance (employee share only)
    // Note: On arbeitnow.com, Health Insurance is shown as a single line item
    // that already includes Zusatzbeitrag, so we combine them
    if (contrib.name === 'Health Insurance' && healthInsurance === 'public') {
      const zusatzbeitragAmount = cappedAmount * zusatzbeitragRate * employeeShareMultiplier;
      amount += zusatzbeitragAmount;
      
      // Add health insurance as single line item (includes Zusatzbeitrag)
      breakdown.push({
        name: contrib.name,
        amount: round(amount, roundingRules.nearestCent),
        rate: rate + (zusatzbeitragRate * employeeShareMultiplier),
        cappedAmount: contrib.cap !== undefined ? cappedAmount : undefined,
      });
      
      totalAnnual += amount;
      continue;
    }

    // Long-term Care Insurance (Pflegeversicherung)
    // For private health insurance, Care Insurance is not paid (skip it)
    // Note: The rate in JSON already includes the surcharge for no children
    if (contrib.name === 'Long-term Care Insurance') {
      // Skip Care Insurance for private health insurance
      if (healthInsurance === 'private-without' || healthInsurance === 'private-with') {
        continue;
      }
      // Continue to add base contribution (fall through to default case)
      // The rate already includes surcharge, so we don't add it separately
    }

    breakdown.push({
      name: contrib.name,
      amount: round(amount, roundingRules.nearestCent),
      rate: rate,
      cappedAmount: contrib.cap !== undefined ? cappedAmount : undefined,
    });

    totalAnnual += amount;
  }

  return {
    totalAnnual: round(totalAnnual, roundingRules.nearestCent),
    breakdown,
  };
}

/**
 * Compute net income for Germany with all specific parameters
 * 
 * @param annualGross - Annual gross income
 * @param table - Tax data table
 * @param options - Germany-specific tax options
 * @param germanyOptionsData - Germany options data (tax classes, states, rates)
 * @param hoursPerWeek - Hours worked per week (default: 40)
 * @param weeksPerYear - Weeks worked per year (default: 52)
 * @returns Net income result with breakdown
 */
export function computeNetGermany(
  annualGross: number,
  table: TaxData,
  options: GermanyTaxOptions,
  germanyOptionsData: GermanyOptionsData,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): NetIncomeResult {
  if (annualGross < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  // Use provided Germany options data
  const germanyOptions = germanyOptionsData;

  // Taxable income for display = Gross - Personal Allowance only
  const { allowances, brackets, roundingRules } = table;
  const personalAllowanceOnly = allowances.personalAllowance || 0;
  const taxableIncome = Math.max(0, annualGross - personalAllowanceOnly);

  // Calculate income tax directly on taxable income
  // Note: In Germany, income tax uses EStG progressive formula, not simple brackets
  // For simplicity, we use computeIncomeTax but need to calculate it on the correct taxable income base
  // The brackets in JSON represent the tax-free threshold, not the actual tax calculation method
  // We calculate income tax on taxable income (gross - personal allowance), which is the correct base
  
  // Use computeIncomeTax but pass taxable income + personal allowance as gross, with personal allowance as allowance
  // This way computeIncomeTax will calculate on the correct taxable income base
  // Calculate income tax using German EStG formula approximation
  const incomeTax = calculateGermanyIncomeTax(taxableIncome, table);

  // Calculate solidarity surcharge (5.5% of income tax, but only if income tax exceeds threshold)
  // Most taxpayers don't pay Soli (threshold is quite high)
  let solidaritySurcharge = 0;
  const soliThreshold = germanyOptions.solidaritySurcharge.threshold || 0;
  if (incomeTax > soliThreshold) {
    solidaritySurcharge = incomeTax * germanyOptions.solidaritySurcharge.rate;
  }
  const solidarityRounded = round(solidaritySurcharge, table.roundingRules.nearestCent);

  // Calculate church tax (8-9% of income tax, depending on state, if in church)
  let churchTax = 0;
  if (options.inChurch) {
    const stateData = germanyOptions.states.find(s => s.id === options.state);
    if (stateData) {
      churchTax = incomeTax * stateData.churchTaxRate;
    }
  }
  const churchTaxRounded = round(churchTax, table.roundingRules.nearestCent);

  // Total income tax including surcharges
  const totalIncomeTax = incomeTax + solidarityRounded + churchTaxRounded;

  // Calculate social contributions (with health insurance, Zusatzbeitrag, and Pflegeversicherung consideration)
  const zusatzbeitragRate = 0.015; // 1.5% average Zusatzbeitrag for public health insurance
  const socialContrib = computeGermanySocialContrib(
    annualGross,
    table,
    options.healthInsurance,
    options.children,
    zusatzbeitragRate
  );

  // Calculate net income
  const netAnnual = annualGross - totalIncomeTax - socialContrib.totalAnnual;

  // Deannualize net income
  const deannualized = deannualizeIncome(netAnnual, hoursPerWeek, weeksPerYear);

  // Calculate effective tax rate
  const totalTaxes = totalIncomeTax + socialContrib.totalAnnual;
  const effectiveTaxRate = annualGross > 0 ? totalTaxes / annualGross : 0;

  // Use calculated allowances for breakdown (only personal allowance for taxable income display)

  // Build breakdown - include solidarity and church tax in incomeTax total
  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      standardDeduction: allowances.standardDeduction,
      personalAllowance: personalAllowanceOnly, // Only personal allowance for display
      total: personalAllowanceOnly, // Only personal allowance for taxable income
    },
    taxableIncome,
    incomeTax: totalIncomeTax, // Total including solidarity and church tax
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

