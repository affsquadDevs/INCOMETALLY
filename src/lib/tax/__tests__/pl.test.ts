import { describe, it, expect } from 'vitest';
import { computeNetPoland } from '../pl';
import type { TaxData } from '@/types/tax';
import type { PLOptionsData, PLTaxOptions } from '@/types/pl';

const table: TaxData = {
  metadata: {
    countryCode: 'PL',
    countryName: 'Poland',
    currency: 'PLN',
    year: 2026,
    disclaimerShort: 'x',
  },
  brackets: [{ from: 0, to: null, rate: 0.12 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const pl: PLOptionsData = {
  metadata: { countryCode: 'PL', year: 2026, notes: 'x' },
  rateLow: 0.12,
  rateHigh: 0.32,
  threshold: 120000,
  taxReducingAmount: 3600,
  taxFreeAmount: 30000,
  zus: { pension: 0.0976, disability: 0.015, sickness: 0.0245, annualCap: 282600 },
  health: { rate: 0.09 },
  under26ExemptLimit: 85528,
  childRelief: { first: 1112.04, second: 1112.04, third: 2000.04, fourthPlus: 2700 },
};

const base: PLTaxOptions = {
  filingStatus: 'single',
  under26: false,
  children: 0,
  preTaxDeductible: 0,
};

describe('computeNetPoland', () => {
  it('computes single, no children, gross 90,000 PLN', () => {
    const r = computeNetPoland(90000, table, base, pl);
    // ZUS = 8784 + 1350 + 2205 = 12339; health = (90000-12339)*0.09 = 6989.49
    // PIT base = 90000-12339 = 77661; tax = 77661*0.12 - 3600 = 5719.32
    expect(r.breakdown.taxableIncome).toBeCloseTo(77661, 2);
    expect(r.breakdown.incomeTax).toBeCloseTo(5719.32, 2);
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(19328.49, 2);
    expect(r.netAnnual).toBeCloseTo(64952.19, 2);
  });

  it('joint filing reduces tax via income splitting', () => {
    const single = computeNetPoland(90000, table, base, pl);
    const joint = computeNetPoland(90000, table, { ...base, filingStatus: 'joint' }, pl);
    expect(joint.breakdown.incomeTax).toBeLessThan(single.breakdown.incomeTax);
    // 2 * (max(0, (38830.5*0.12) - 3600)) = 2 * 1059.66 = 2119.32
    expect(joint.breakdown.incomeTax).toBeCloseTo(2119.32, 2);
  });

  it('under-26 relief removes income tax up to the exemption', () => {
    const r = computeNetPoland(80000, table, { ...base, under26: true }, pl);
    expect(r.breakdown.incomeTax).toBe(0);
  });

  it('child relief reduces income tax', () => {
    const noKids = computeNetPoland(90000, table, base, pl);
    const twoKids = computeNetPoland(90000, table, { ...base, children: 2 }, pl);
    // credit for 2 children = 2 * 1112.04 = 2224.08
    expect(twoKids.breakdown.incomeTax).toBeCloseTo(noKids.breakdown.incomeTax - 2224.08, 2);
  });

  it('caps pension/disability base at the annual cap', () => {
    const r = computeNetPoland(400000, table, base, pl);
    const pension = r.breakdown.socialContributions.breakdown[0];
    // pension capped at 282600 * 0.0976 = 27581.76
    expect(pension.amount).toBeCloseTo(27581.76, 2);
    expect(pension.cappedAmount).toBe(282600);
  });
});
