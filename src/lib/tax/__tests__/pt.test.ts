import { describe, it, expect } from 'vitest';
import { computeNetPortugal } from '../pt';
import type { TaxData } from '@/types/tax';
import type { PTOptionsData, PTTaxOptions } from '@/types/pt';

const table: TaxData = {
  metadata: { countryCode: 'PT', countryName: 'Portugal', currency: 'EUR', year: 2026, disclaimerShort: 'x' },
  brackets: [{ from: 0, to: null, rate: 0.13 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const pt: PTOptionsData = {
  metadata: { countryCode: 'PT', year: 2026, notes: 'x' },
  brackets: [
    { from: 0, to: 8342, rate: 0.125 },
    { from: 8342, to: 12587, rate: 0.157 },
    { from: 12587, to: 17838, rate: 0.212 },
    { from: 17838, to: 23089, rate: 0.241 },
    { from: 23089, to: 29397, rate: 0.311 },
    { from: 29397, to: 43090, rate: 0.349 },
    { from: 43090, to: 46566, rate: 0.431 },
    { from: 46566, to: 86634, rate: 0.446 },
    { from: 86634, to: null, rate: 0.48 },
  ],
  regionalReduction: {
    mainland: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    azores: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    madeira: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.15, 0.09, 0.03],
  },
  specificDeduction: 4587.09,
  ssRate: 0.11,
  dependantCredit: 600,
};

const baseOpts: PTTaxOptions = { region: 'mainland', filingStatus: 'single', dependants: 0 };

describe('computeNetPortugal', () => {
  it('computes mainland single, gross 25,000 EUR', () => {
    const r = computeNetPortugal(25000, table, baseOpts, pt);
    // SS = 2750; specific deduction = max(4587.09, 2750) = 4587.09; base = 20412.91
    expect(r.breakdown.allowances.total).toBeCloseTo(4587.09, 2);
    expect(r.breakdown.taxableIncome).toBeCloseTo(20412.91, 2);
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(2750, 2);
    expect(r.breakdown.incomeTax).toBeCloseTo(3442.98, 1);
  });

  it('Azores applies a 30% reduction to income tax', () => {
    const mainland = computeNetPortugal(25000, table, baseOpts, pt);
    const azores = computeNetPortugal(25000, table, { ...baseOpts, region: 'azores' }, pt);
    expect(azores.breakdown.incomeTax).toBeCloseTo(mainland.breakdown.incomeTax * 0.7, 1);
  });

  it('uses actual Social Security as the deduction when it exceeds the fixed amount', () => {
    // gross 60,000 -> SS = 6600 > 4587.09, so deduction = 6600
    const r = computeNetPortugal(60000, table, baseOpts, pt);
    expect(r.breakdown.allowances.total).toBeCloseTo(6600, 2);
    expect(r.breakdown.taxableIncome).toBeCloseTo(53400, 2);
  });

  it('joint taxation reduces tax via the spousal quotient', () => {
    const single = computeNetPortugal(40000, table, baseOpts, pt);
    const joint = computeNetPortugal(40000, table, { ...baseOpts, filingStatus: 'joint' }, pt);
    expect(joint.breakdown.incomeTax).toBeLessThan(single.breakdown.incomeTax);
  });

  it('dependant credit reduces income tax', () => {
    const noKids = computeNetPortugal(25000, table, baseOpts, pt);
    const twoKids = computeNetPortugal(25000, table, { ...baseOpts, dependants: 2 }, pt);
    expect(twoKids.breakdown.incomeTax).toBeCloseTo(noKids.breakdown.incomeTax - 1200, 2);
  });
});
