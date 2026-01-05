/**
 * Tests for tax calculation engine
 * 
 * Run with: npm test (after installing Vitest)
 * Or: npx vitest run
 */

import { describe, it, expect } from 'vitest';
import {
  annualizeIncome,
  deannualizeIncome,
  computeIncomeTax,
  computeSocialContrib,
  computeNet,
} from '../calc';
import { TaxData } from '@/types/tax';

// Test data fixtures
const createSimpleTaxTable = (): TaxData => ({
  metadata: {
    countryCode: 'TEST',
    countryName: 'Test Country',
    currency: 'USD',
    year: 2026,
    disclaimerShort: 'Test data',
  },
  brackets: [
    { from: 0, to: 10000, rate: 0 },
    { from: 10001, to: 30000, rate: 0.1 },
    { from: 30001, to: 60000, rate: 0.2 },
    { from: 60001, to: null, rate: 0.3 },
  ],
  socialContrib: [
    { name: 'Social Security', rate: 0.06, cap: 50000 },
    { name: 'Medicare', rate: 0.0145 },
  ],
  allowances: {
    standardDeduction: 5000,
  },
  roundingRules: {
    nearestCent: true,
  },
});

const createNoAllowanceTaxTable = (): TaxData => ({
  metadata: {
    countryCode: 'TEST',
    countryName: 'Test Country',
    currency: 'USD',
    year: 2026,
    disclaimerShort: 'Test data',
  },
  brackets: [
    { from: 0, to: 10000, rate: 0 },
    { from: 10001, to: null, rate: 0.2 },
  ],
  socialContrib: [],
  allowances: {},
  roundingRules: {
    nearestCent: false,
  },
});

describe('annualizeIncome', () => {
  it('should convert hourly to annual (40 hours/week, 52 weeks)', () => {
    expect(annualizeIncome('hourly', 25, 40, 52)).toBe(52000);
  });

  it('should convert monthly to annual', () => {
    expect(annualizeIncome('monthly', 5000)).toBe(60000);
  });

  it('should return yearly income as-is', () => {
    expect(annualizeIncome('yearly', 50000)).toBe(50000);
  });

  it('should handle custom hours per week', () => {
    expect(annualizeIncome('hourly', 30, 35, 52)).toBe(54600);
  });

  it('should handle custom weeks per year', () => {
    expect(annualizeIncome('hourly', 25, 40, 50)).toBe(50000);
  });

  it('should throw error for negative income', () => {
    expect(() => annualizeIncome('yearly', -1000)).toThrow('negative');
  });

  it('should throw error for invalid hours per week', () => {
    expect(() => annualizeIncome('hourly', 25, 0)).toThrow('Hours per week');
    expect(() => annualizeIncome('hourly', 25, 200)).toThrow('Hours per week');
  });

  it('should throw error for invalid weeks per year', () => {
    expect(() => annualizeIncome('hourly', 25, 40, 0)).toThrow('Weeks per year');
    expect(() => annualizeIncome('hourly', 25, 40, 60)).toThrow('Weeks per year');
  });
});

describe('deannualizeIncome', () => {
  it('should convert annual to hourly, monthly, yearly (40 hours/week, 52 weeks)', () => {
    const result = deannualizeIncome(52000, 40, 52);
    expect(result.yearly).toBe(52000);
    expect(result.monthly).toBeCloseTo(4333.33, 2);
    expect(result.hourly).toBe(25);
  });

  it('should handle custom hours per week', () => {
    const result = deannualizeIncome(54600, 35, 52);
    expect(result.hourly).toBeCloseTo(30, 2);
    expect(result.monthly).toBeCloseTo(4550, 2);
  });

  it('should handle custom weeks per year', () => {
    const result = deannualizeIncome(50000, 40, 50);
    expect(result.hourly).toBe(25);
    expect(result.monthly).toBeCloseTo(4166.67, 2);
  });

  it('should throw error for negative income', () => {
    expect(() => deannualizeIncome(-1000)).toThrow('negative');
  });

  it('should handle zero income', () => {
    const result = deannualizeIncome(0);
    expect(result.hourly).toBe(0);
    expect(result.monthly).toBe(0);
    expect(result.yearly).toBe(0);
  });
});

describe('computeIncomeTax - bracket math edge cases', () => {
  const table = createSimpleTaxTable();

  it('should return 0 for income below first bracket', () => {
    expect(computeIncomeTax(3000, table)).toBe(0);
  });

  it('should apply first bracket correctly', () => {
    // 5000 allowance, so taxable = 15000 - 5000 = 10000
    // Tax = 0 (first bracket is 0%)
    expect(computeIncomeTax(15000, table)).toBe(0);
  });

  it('should apply second bracket correctly', () => {
    // 5000 allowance, so taxable = 25000 - 5000 = 20000
    // Tax = (20000 - 10000) * 0.1 = 1000
    expect(computeIncomeTax(25000, table)).toBe(1000);
  });

  it('should apply multiple brackets correctly', () => {
    // 5000 allowance, so taxable = 50000 - 5000 = 45000
    // Tax = 0 (0-10000) + 2000 (10001-30000) + 3000 (30001-45000) = 5000
    expect(computeIncomeTax(50000, table)).toBe(5000);
  });

  it('should handle income in highest bracket (no cap)', () => {
    // 5000 allowance, so taxable = 70000 - 5000 = 65000
    // Tax = 0 + 2000 + 6000 + 1500 (60001-65000) = 9500
    expect(computeIncomeTax(70000, table)).toBe(9500);
  });

  it('should handle income exactly at bracket boundaries', () => {
    // Exactly at 30001 bracket boundary
    // Taxable = 35001 - 5000 = 30001
    // Tax = 0 + 2000 + 0.002 (one cent at 0.2 rate) = 2000.002, rounded to 2000
    const result = computeIncomeTax(35001, table);
    expect(result).toBeGreaterThan(1999);
    expect(result).toBeLessThan(2001);
  });

  it('should handle very high income', () => {
    // 5000 allowance, so taxable = 1000000 - 5000 = 995000
    // Tax = 0 + 2000 + 6000 + (995000 - 60000) * 0.3 = 0 + 2000 + 6000 + 280500 = 288500
    const result = computeIncomeTax(1000000, table);
    expect(result).toBe(288500);
  });

  it('should return 0 for zero income', () => {
    expect(computeIncomeTax(0, table)).toBe(0);
  });

  it('should return 0 for income exactly at allowance', () => {
    expect(computeIncomeTax(5000, table)).toBe(0);
  });
});

describe('computeIncomeTax - allowance floor', () => {
  const table = createSimpleTaxTable();

  it('should apply allowance and floor taxable income at 0', () => {
    // Income below allowance should result in 0 tax
    expect(computeIncomeTax(3000, table)).toBe(0);
    expect(computeIncomeTax(4999, table)).toBe(0);
  });

  it('should use personal allowance if higher than standard deduction', () => {
    const tableWithBoth: TaxData = {
      ...createSimpleTaxTable(),
      allowances: {
        standardDeduction: 5000,
        personalAllowance: 8000,
      },
    };
    // Should use 8000 allowance (the max)
    expect(computeIncomeTax(10000, tableWithBoth)).toBe(0); // 10000 - 8000 = 2000, but first bracket is 0%
  });

  it('should use standard deduction if higher than personal allowance', () => {
    const tableWithBoth: TaxData = {
      ...createSimpleTaxTable(),
      allowances: {
        standardDeduction: 10000,
        personalAllowance: 5000,
      },
    };
    // Should use 10000 allowance
    expect(computeIncomeTax(15000, tableWithBoth)).toBe(0); // 15000 - 10000 = 5000, first bracket is 0%
  });

  it('should handle table with no allowances', () => {
    const tableNoAllowance = createNoAllowanceTaxTable();
    // 25000 income, no allowance, so taxable = 25000
    // Tax = 0 (0-10000) + 3000 (10001-25000) = 3000
    expect(computeIncomeTax(25000, tableNoAllowance)).toBe(3000);
  });

  it('should handle income exactly equal to allowance', () => {
    expect(computeIncomeTax(5000, table)).toBe(0);
  });
});

describe('computeSocialContrib - social cap', () => {
  it('should apply contribution up to cap', () => {
    const table = createSimpleTaxTable();
    // Income 100000, but cap is 50000
    // Social Security: 50000 * 0.06 = 3000 (capped at 50000)
    // Medicare: 100000 * 0.0145 = 1450 (no cap)
    const result = computeSocialContrib(100000, table);
    expect(result.totalAnnual).toBe(4450); // 3000 + 1450
    expect(result.breakdown[0].amount).toBe(3000);
    expect(result.breakdown[0].cappedAmount).toBe(50000);
    expect(result.breakdown[1].amount).toBe(1450);
    expect(result.breakdown[1].cappedAmount).toBeUndefined();
  });

  it('should apply full contribution when income is below cap', () => {
    const table = createSimpleTaxTable();
    // Income 30000, below cap of 50000
    // Social Security: 30000 * 0.06 = 1800
    // Medicare: 30000 * 0.0145 = 435
    const result = computeSocialContrib(30000, table);
    expect(result.totalAnnual).toBe(2235);
    expect(result.breakdown[0].cappedAmount).toBe(30000);
  });

  it('should handle income exactly at cap', () => {
    const table = createSimpleTaxTable();
    // Income 50000, exactly at cap
    // Social Security: 50000 * 0.06 = 3000
    // Medicare: 50000 * 0.0145 = 725
    const result = computeSocialContrib(50000, table);
    expect(result.totalAnnual).toBe(3725);
    expect(result.breakdown[0].cappedAmount).toBe(50000);
  });

  it('should handle contributions without caps', () => {
    const tableNoCap: TaxData = {
      ...createSimpleTaxTable(),
      socialContrib: [{ name: 'Universal', rate: 0.05 }],
    };
    const result = computeSocialContrib(100000, tableNoCap);
    expect(result.totalAnnual).toBe(5000); // 100000 * 0.05
    expect(result.breakdown[0].cappedAmount).toBeUndefined();
  });

  it('should return empty breakdown for zero contributions', () => {
    const tableNoContrib: TaxData = {
      ...createSimpleTaxTable(),
      socialContrib: [],
    };
    const result = computeSocialContrib(50000, tableNoContrib);
    expect(result.totalAnnual).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it('should handle zero income', () => {
    const table = createSimpleTaxTable();
    const result = computeSocialContrib(0, table);
    expect(result.totalAnnual).toBe(0);
  });
});

describe('computeNet - comprehensive calculation', () => {
  const table = createSimpleTaxTable();

  it('should calculate net income correctly', () => {
    // Income: 50000
    // Allowance: 5000, Taxable: 45000
    // Income Tax: 0 + 2000 + 3000 = 5000
    // Social: 3000 (SS capped) + 725 (Medicare) = 3725
    // Net: 50000 - 5000 - 3725 = 41275
    const result = computeNet(50000, table);
    expect(result.netAnnual).toBe(41275);
    expect(result.breakdown.grossIncome).toBe(50000);
    expect(result.breakdown.incomeTax).toBe(5000);
    expect(result.breakdown.socialContributions.totalAnnual).toBe(3725);
    expect(result.breakdown.netIncome).toBe(41275);
  });

  it('should calculate effective tax rate correctly', () => {
    // Income: 50000, Total taxes: 5000 + 3725 = 8725
    // Effective rate: 8725 / 50000 = 0.1745
    const result = computeNet(50000, table);
    expect(result.effectiveTaxRate).toBeCloseTo(0.1745, 4);
    expect(result.breakdown.effectiveTaxRate).toBeCloseTo(0.1745, 4);
  });

  it('should deannualize net income correctly', () => {
    const result = computeNet(52000, table, 40, 52);
    // Net will be less than gross, so hourly should be less than 25
    expect(result.netHourly).toBeLessThan(25);
    expect(result.netMonthly).toBeLessThan(4333.33);
    expect(result.netAnnual).toBeLessThan(52000);
  });

  it('should handle income below allowance', () => {
    // Income: 3000, below allowance of 5000
    // Taxable: 0, Income Tax: 0
    // Social: 180 + 43.5 = 223.5
    // Net: 3000 - 0 - 223.5 = 2776.5
    const result = computeNet(3000, table);
    expect(result.breakdown.taxableIncome).toBe(0);
    expect(result.breakdown.incomeTax).toBe(0);
    expect(result.netAnnual).toBeCloseTo(2776.5, 2);
  });

  it('should include detailed breakdown', () => {
    const result = computeNet(50000, table);
    expect(result.breakdown.allowances.total).toBe(5000);
    expect(result.breakdown.taxableIncome).toBe(45000);
    expect(result.breakdown.socialContributions.breakdown).toHaveLength(2);
    expect(result.breakdown.socialContributions.breakdown[0].name).toBe('Social Security');
    expect(result.breakdown.socialContributions.breakdown[1].name).toBe('Medicare');
  });

  it('should handle zero income', () => {
    const result = computeNet(0, table);
    expect(result.netAnnual).toBe(0);
    expect(result.netMonthly).toBe(0);
    expect(result.netHourly).toBe(0);
    expect(result.effectiveTaxRate).toBe(0);
  });
});

describe('mode conversions correctness', () => {
  it('should maintain consistency between annualize and deannualize', () => {
    const hourly = 25;
    const annual = annualizeIncome('hourly', hourly, 40, 52);
    const deannualized = deannualizeIncome(annual, 40, 52);
    expect(deannualized.hourly).toBeCloseTo(hourly, 2);
  });

  it('should maintain consistency for monthly conversion', () => {
    const monthly = 5000;
    const annual = annualizeIncome('monthly', monthly);
    const deannualized = deannualizeIncome(annual);
    expect(deannualized.monthly).toBeCloseTo(monthly, 2);
  });

  it('should maintain consistency for yearly conversion', () => {
    const yearly = 50000;
    const annual = annualizeIncome('yearly', yearly);
    expect(annual).toBe(yearly);
    const deannualized = deannualizeIncome(annual);
    expect(deannualized.yearly).toBe(yearly);
  });

  it('should handle different hours per week consistently', () => {
    const hourly = 30;
    const hoursPerWeek = 35;
    const weeksPerYear = 50;
    const annual = annualizeIncome('hourly', hourly, hoursPerWeek, weeksPerYear);
    const deannualized = deannualizeIncome(annual, hoursPerWeek, weeksPerYear);
    expect(deannualized.hourly).toBeCloseTo(hourly, 2);
  });

  it('should calculate net hourly correctly for different work schedules', () => {
    const table = createSimpleTaxTable();
    // Full-time: 40 hrs/week
    const resultFT = computeNet(52000, table, 40, 52);
    // Part-time: 20 hrs/week, same annual income
    const resultPT = computeNet(52000, table, 20, 52);
    
    // Net annual should be the same
    expect(resultFT.netAnnual).toBe(resultPT.netAnnual);
    // But hourly rates should differ
    expect(resultPT.netHourly).toBeGreaterThan(resultFT.netHourly);
  });
});

describe('edge cases and error handling', () => {
  const table = createSimpleTaxTable();

  it('should handle very small income amounts', () => {
    const result = computeNet(100, table);
    expect(result.netAnnual).toBeGreaterThanOrEqual(0);
    expect(result.netAnnual).toBeLessThanOrEqual(100);
  });

  it('should handle very large income amounts', () => {
    const result = computeNet(1000000, table);
    expect(result.netAnnual).toBeGreaterThan(0);
    expect(result.netAnnual).toBeLessThan(1000000);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeLessThan(1);
  });

  it('should throw error for negative income in computeIncomeTax', () => {
    expect(() => computeIncomeTax(-1000, table)).toThrow('negative');
  });

  it('should throw error for negative income in computeSocialContrib', () => {
    expect(() => computeSocialContrib(-1000, table)).toThrow('negative');
  });

  it('should throw error for negative income in computeNet', () => {
    expect(() => computeNet(-1000, table)).toThrow('negative');
  });
});

