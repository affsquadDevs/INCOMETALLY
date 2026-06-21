import { describe, it, expect } from 'vitest';
import { computeNetUK } from '../uk';
import type { TaxData } from '@/types/tax';
import type { UKOptionsData, UKTaxOptions } from '@/types/uk';

const table: TaxData = {
  metadata: { countryCode: 'UK', countryName: 'United Kingdom', currency: 'GBP', year: 2026, disclaimerShort: 'x' },
  brackets: [{ from: 0, to: null, rate: 0.2 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const uk: UKOptionsData = {
  metadata: { countryCode: 'UK', year: 2026, notes: 'x' },
  personalAllowance: { base: 12570, phaseOutStart: 100000, phaseOutEnd: 125140 },
  incomeTaxBands: [
    { from: 0, to: 12570, rate: 0 },
    { from: 12571, to: 50270, rate: 0.2 },
    { from: 50271, to: 125140, rate: 0.4 },
    { from: 125141, to: null, rate: 0.45 },
  ],
  nationalInsurance: { primaryThreshold: 12570, upperEarningsLimit: 50270, rateBasic: 0.08, rateHigher: 0.02 },
  studentLoan: {
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 25000, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
  },
  marriageAllowance: { transfer: 1260, benefit: 252 },
  childBenefit: { firstChild: 1406.6, additionalChild: 930.8 },
  hicbc: { threshold: 60000, fullThreshold: 80000 },
};

const baseOpts: UKTaxOptions = {
  preTaxPension: 0,
  preTaxOther: 0,
  studentLoanPlan: 'none',
  region: 'england',
  marriageAllowance: false,
  children: 0,
};

describe('computeNetUK', () => {
  it('computes a basic-rate salary (30,000)', () => {
    const r = computeNetUK(30000, table, baseOpts, uk);
    // taxable = 17,430; tax = 3,486; NI = (30000-12570)*0.08 = 1,394.40
    expect(r.breakdown.incomeTax).toBeCloseTo(3486, 2);
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(1394.4, 2);
    expect(r.netAnnual).toBeCloseTo(25119.6, 2);
  });

  it('applies Marriage Allowance relief for a basic-rate taxpayer', () => {
    const without = computeNetUK(30000, table, baseOpts, uk);
    const withMA = computeNetUK(30000, table, { ...baseOpts, marriageAllowance: true }, uk);
    expect(withMA.breakdown.incomeTax).toBeCloseTo(without.breakdown.incomeTax - 252, 2);
  });

  it('does not give Marriage Allowance to higher-rate taxpayers', () => {
    const withMA = computeNetUK(70000, table, { ...baseOpts, marriageAllowance: true }, uk);
    expect(withMA.breakdown.incomeTaxComponents?.marriageAllowance).toBeUndefined();
  });

  it('applies the High Income Child Benefit Charge above 60,000', () => {
    const r = computeNetUK(70000, table, { ...baseOpts, children: 2 }, uk);
    // child benefit = 1406.6 + 930.8 = 2337.4; fraction = (70000-60000)/20000 = 0.5
    expect(r.breakdown.incomeTaxComponents?.highIncomeChildBenefitCharge).toBeCloseTo(1168.7, 2);
  });

  it('fully claws back child benefit at 80,000+', () => {
    const r = computeNetUK(85000, table, { ...baseOpts, children: 1 }, uk);
    expect(r.breakdown.incomeTaxComponents?.highIncomeChildBenefitCharge).toBeCloseTo(1406.6, 2);
  });
});
