import { TaxData } from '@/types/tax';
import { GermanyTaxOptions, GermanyOptionsData } from '@/types/germany';
import { deannualizeIncome } from './calc';
import { NetIncomeResult, TaxBreakdown, SocialContribResult, SocialContribBreakdown } from './types';

function round(value: number, nearestCent: boolean): number {
  if (nearestCent) {
    return Math.round(value * 100) / 100;
  }
  return value;
}

function calculateGermanyIncomeTax(taxableIncome: number, table: TaxData): number {
  if (taxableIncome <= 0) {
    return 0;
  }

  const { roundingRules } = table;
  const x = Math.floor(taxableIncome);
  let tax = 0;

  if (x <= 12348) {
    tax = 0;
  }
  else if (x <= 17799) {
    const y = (x - 12348) / 10000;
    tax = (914.51 * y + 1400) * y;
  }
  else if (x <= 69878) {
    const z = (x - 17799) / 10000;
    tax = (173.10 * z + 2397) * z + 1034.87;
  }
  else if (x <= 277825) {
    tax = 0.42 * x - 11135.63;
  }
  else {
    tax = 0.45 * x - 19470.38;
  }

  if (roundingRules.incomeTaxRoundedDownToEuro ?? true) {
    return Math.floor(tax);
  }
  return round(tax, roundingRules.nearestCent);
}

export function computeGermanySolidaritySurcharge(
  incomeTax: number,
  soli: {
    rate: number;
    threshold?: number;
    exemptIncomeTax?: number;
    phaseInRate?: number;
  }
): number {
  if (incomeTax <= 0) return 0;
  const rate = soli.rate;
  const exemptIncomeTax = soli.exemptIncomeTax ?? soli.threshold ?? 0;
  const phaseInRate = soli.phaseInRate ?? 0.119;

  if (incomeTax <= exemptIncomeTax) return 0;

  const phaseIn = phaseInRate * (incomeTax - exemptIncomeTax);
  const full = rate * incomeTax;
  return Math.min(full, phaseIn);
}

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
  // Class 1-5: 1.230 €
  // Class 6: No (0)
  if (taxClass !== '6') {
    totalAllowance += 1230;
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
  state: string,
  zusatzbeitragRate?: number // Employee share of Zusatzbeitrag (e.g. 0.0145 for 2.9% avg add-on)
): SocialContribResult {
  const { socialContrib, roundingRules } = table;
  const breakdown: SocialContribBreakdown[] = [];
  let totalAnnual = 0;

  // Employee share is 50% of total contribution rates
  const employeeShareMultiplier = 0.5;

  const healthContrib = socialContrib.find(c => c.name === 'Health Insurance');
  const careContrib = socialContrib.find(c => c.name === 'Long-term Care Insurance');

  // Gesetzlicher allgemeiner Beitragssatz (GKV): 14.6% total
  const statutoryHealthBaseTotalRate = 0.146;
  const derivedEmployeeZusatzbeitragRate =
    zusatzbeitragRate ??
    (healthContrib ? Math.max(0, (healthContrib.rate - statutoryHealthBaseTotalRate) * 0.5) : 0.0145);

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

    // Health Insurance (GKV): employee pays half of base + half of Zusatzbeitrag
    if (contrib.name === 'Health Insurance' && healthInsurance === 'public') {
      const baseRateEmployee = statutoryHealthBaseTotalRate * 0.5; // 7.3%
      const totalRateEmployee = baseRateEmployee + derivedEmployeeZusatzbeitragRate;
      const amount = cappedAmount * totalRateEmployee;
      
      breakdown.push({
        name: contrib.name,
        amount: round(amount, roundingRules.nearestCent),
        rate: totalRateEmployee,
        cappedAmount: contrib.cap !== undefined ? cappedAmount : undefined,
      });
      
      totalAnnual += amount;
      continue;
    }

    // Long-term Care Insurance (Pflegeversicherung)
    if (contrib.name === 'Long-term Care Insurance') {
      // 2025+: base rate 3.6% total.
      // Childless surcharge: +0.6% (employee only).
      // Saxony: different employer/employee split for the base rate (employee higher).
      const baseTotalRate = careContrib?.rate ?? 0.036;
      const baseRateEmployee = state === 'SN' ? 0.023 : baseTotalRate * 0.5; // Saxony vs other states
      const childlessSurchargeEmployee = children ? 0 : 0.006;
      const totalRateEmployee = baseRateEmployee + childlessSurchargeEmployee;
      const amount = cappedAmount * totalRateEmployee;
      
      breakdown.push({
        name: contrib.name,
        amount: round(amount, roundingRules.nearestCent),
        rate: totalRateEmployee,
        cappedAmount: contrib.cap !== undefined ? cappedAmount : undefined,
      });
      
      totalAnnual += amount;
      continue;
    }

    // Other contributions (Pension, Unemployment): employee share = 50% of total rate
    const rate = contrib.rate * employeeShareMultiplier;
    const amount = cappedAmount * rate;

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

  // Taxable income approximation:
  // - We subtract Werbungskostenpauschale (employee lump sum).
  // - Grundfreibetrag is NOT deducted here - it's already built into EStG §32a formulas.
  // - Steuerklasse II (single parent) includes an Entlastungsbetrag relief; we model it as an extra allowance.
  const { allowances } = table;
  const employeeLumpSum = options.taxClass === '6' ? 0 : (allowances.employeeLumpSum ?? 1230);
  const personalAllowance = allowances.personalAllowance ?? 12348;
  const singleParentRelief =
    options.taxClass === '2'
      ? (germanyOptions.singleParentRelief ?? allowances.singleParentRelief ?? 4260)
      : 0;
  const taxableIncome = Math.max(0, annualGross - employeeLumpSum - singleParentRelief);
  // Wage tax classes V/VI effectively remove the basic allowance in withholding.
  // We approximate this by shifting the taxable income into the tariff by +Grundfreibetrag.
  // This keeps class IV identical to class I for annual calculations (no splitting benefit).
  const effectiveTaxableIncome =
    options.taxClass === '5' || options.taxClass === '6'
      ? taxableIncome + personalAllowance
      : taxableIncome;

  // Calculate income tax based on tax class
  // For married couples (tax classes 3 and 4), apply Ehegattensplitting (income splitting):
  // - Tax is calculated on half the taxable income, then multiplied by 2
  // - This results in lower tax due to progressive tax brackets
  // Tax class 5 (married lower earner) does NOT use splitting - it's designed for higher withholding
  // Tax classes 1, 2, 6 do not use splitting (single, single parent, secondary employment)
  let incomeTax: number;
  if (options.taxClass === '3') {
    // Ehegattensplitting: Calculate tax on half the income, then multiply by 2
    // This benefits married couples by pushing each spouse's income into lower tax brackets
    const halfTaxableIncome = Math.floor(effectiveTaxableIncome / 2);
    const halfTax = calculateGermanyIncomeTax(halfTaxableIncome, table);
    incomeTax = halfTax * 2;
  } else {
    // Tax classes 1, 2, 4, 5, 6: No splitting (IV must match I for annual income tax)
    // Class 5 is intentionally harsher for the lower-earning spouse (part of III/V combination)
    incomeTax = calculateGermanyIncomeTax(effectiveTaxableIncome, table);
  }

  // Solidarity surcharge (Soli): exemption + phase-in based on income tax amount (ESt)
  const baseSoliParams = table.solidaritySurcharge ?? germanyOptions.solidaritySurcharge;
  const exempt = baseSoliParams.exemptIncomeTax ?? baseSoliParams.threshold ?? 0;
  const soliParams =
    options.taxClass === '3'
      ? { ...baseSoliParams, exemptIncomeTax: exempt * 2 }
      : baseSoliParams;
  const solidaritySurcharge = computeGermanySolidaritySurcharge(incomeTax, soliParams);
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
  const socialContrib = computeGermanySocialContrib(
    annualGross,
    table,
    options.healthInsurance,
    options.children,
    options.state
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
  // Note: employeeLumpSum (Werbungskostenpauschale) is used for taxable income calculation
  // Grundfreibetrag is NOT deducted - it's built into EStG formulas
  const breakdown: TaxBreakdown = {
    grossIncome: annualGross,
    allowances: {
      standardDeduction: allowances.standardDeduction,
      personalAllowance: allowances.personalAllowance, // Grundfreibetrag (for display only, not deducted)
      total: employeeLumpSum + singleParentRelief, // Deductions applied to reach taxableIncome (lump sum + class II relief)
    },
    taxableIncome,
    incomeTax: totalIncomeTax, // Total including solidarity and church tax
    incomeTaxComponents: {
      baseIncomeTax: incomeTax,
      solidaritySurcharge: solidarityRounded,
      churchTax: churchTaxRounded,
    },
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

