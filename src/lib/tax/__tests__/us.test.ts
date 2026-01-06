import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import type { TaxData } from '@/types/tax';
import type { USOptionsData, USTaxOptions } from '@/types/us';
import { computeNetUS } from '../us';

function loadJson<T>(relativePath: string): T {
  const p = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
}

describe('computeNetUS (federal + payroll + credits)', () => {
  const table = loadJson<TaxData>('src/data/tax/us/2026.json');
  const us = loadJson<USOptionsData>('src/data/tax/us/us-options.json');

  it('computes a reasonable result for Single, standard deduction, employee payroll taxes', () => {
    const options: USTaxOptions = {
      filingStatus: 'single',
      employmentType: 'employee',
      deductionMethod: 'standard',
      itemizedDeductions: 0,
      childrenUnder17: 0,
      otherDependents: 0,
      taxpayerOver65: false,
      taxpayerBlind: false,
      spouseOver65: false,
      spouseBlind: false,
      preTax401k: 0,
      preTaxHSA: 0,
      otherPreTaxDeductions: 0,
      stateTaxRate: 0,
      localTaxRate: 0,
    };

    const result = computeNetUS(100000, table, options, us, 40, 52);

    // Taxable = 100000 - 16100 = 83900
    expect(result.breakdown.taxableIncome).toBe(83900);

    // Federal before credits:
    // 12400*10% + (50400-12400)*12% + (83900-50400)*22% = 13170
    expect(result.breakdown.incomeTaxComponents?.federalIncomeTaxBeforeCredits).toBeCloseTo(13170, 2);

    // Payroll: SS 6.2% + Medicare 1.45% (no addl Medicare under 200k)
    const payroll = result.breakdown.socialContributions.totalAnnual;
    expect(payroll).toBeCloseTo(7650, 2);

    // Net = 100000 - 13170 - 7650 = 79180
    expect(result.netAnnual).toBeCloseTo(79180, 2);
  });

  it('applies child tax credit (non-refundable) up to federal tax owed', () => {
    const options: USTaxOptions = {
      filingStatus: 'single',
      employmentType: 'employee',
      deductionMethod: 'standard',
      itemizedDeductions: 0,
      childrenUnder17: 1,
      otherDependents: 0,
      taxpayerOver65: false,
      taxpayerBlind: false,
      spouseOver65: false,
      spouseBlind: false,
      preTax401k: 0,
      preTaxHSA: 0,
      otherPreTaxDeductions: 0,
      stateTaxRate: 0,
      localTaxRate: 0,
    };

    const result = computeNetUS(80000, table, options, us);
    const before = result.breakdown.incomeTaxComponents?.federalIncomeTaxBeforeCredits ?? 0;
    const after = result.breakdown.incomeTaxComponents?.federalIncomeTaxAfterCredits ?? 0;
    const credits = result.breakdown.incomeTaxComponents?.taxCredits ?? 0;

    expect(before).toBeGreaterThan(0);
    expect(credits).toBeGreaterThan(0);
    expect(after).toBeCloseTo(Math.max(0, before - credits), 2);
  });
});


