import { describe, it, expect } from 'vitest';
import { computeNetSpain } from '../es';
import type { TaxData } from '@/types/tax';
import type { ESOptionsData, ESTaxOptions } from '@/types/es';

const table: TaxData = {
  metadata: {
    countryCode: 'ES',
    countryName: 'Spain',
    currency: 'EUR',
    year: 2026,
    disclaimerShort: 'x',
  },
  brackets: [{ from: 0, to: null, rate: 0.19 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const es: ESOptionsData = {
  metadata: { countryCode: 'ES', year: 2026, notes: 'x' },
  stateBrackets: [
    { from: 0, to: 12450, rate: 0.095 },
    { from: 12450, to: 20200, rate: 0.12 },
    { from: 20200, to: 35200, rate: 0.15 },
    { from: 35200, to: 60000, rate: 0.185 },
    { from: 60000, to: 300000, rate: 0.225 },
    { from: 300000, to: null, rate: 0.245 },
  ],
  regionalScales: {
    default: [
      { from: 0, to: 12450, rate: 0.095 },
      { from: 12450, to: 20200, rate: 0.12 },
      { from: 20200, to: 35200, rate: 0.15 },
      { from: 35200, to: 60000, rate: 0.185 },
      { from: 60000, to: null, rate: 0.225 },
    ],
    madrid: [
      { from: 0, to: 13362.22, rate: 0.085 },
      { from: 13362.22, to: 19004.63, rate: 0.107 },
      { from: 19004.63, to: 35425.68, rate: 0.128 },
      { from: 35425.68, to: 57320.4, rate: 0.174 },
      { from: 57320.4, to: null, rate: 0.205 },
    ],
  },
  communities: [
    { id: 'default', name: 'Other' },
    { id: 'madrid', name: 'Madrid' },
  ],
  personalMinimum: 5550,
  descendantMinimums: [2400, 2700, 4000, 4500],
  otrosGastos: 2000,
  jointReduction: 3400,
  ss: { rate: 0.065, baseMaxima: 61214.4 },
};

const baseOpts: ESTaxOptions = { community: 'default', filingStatus: 'single', children: 0 };

describe('computeNetSpain', () => {
  it('computes 30,000 EUR single, default region', () => {
    const r = computeNetSpain(30000, table, baseOpts, es);
    // SS = 1950; base = 30000 - 1950 - 2000 = 26050; minimum = 5550
    // tax = 2*(scale(26050) - scale(5550)) = 2*(2990.25 - 527.25) = 4926
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(1950, 2);
    expect(r.breakdown.taxableIncome).toBeCloseTo(26050, 2);
    expect(r.breakdown.incomeTax).toBeCloseTo(4926, 1);
    expect(r.netAnnual).toBeCloseTo(23124, 1);
  });

  it('Madrid has lower regional tax than the default region', () => {
    const def = computeNetSpain(60000, table, baseOpts, es);
    const madrid = computeNetSpain(60000, table, { ...baseOpts, community: 'madrid' }, es);
    expect(madrid.netAnnual).toBeGreaterThan(def.netAnnual);
  });

  it('joint return reduces tax', () => {
    const single = computeNetSpain(40000, table, baseOpts, es);
    const joint = computeNetSpain(40000, table, { ...baseOpts, filingStatus: 'joint' }, es);
    expect(joint.breakdown.incomeTax).toBeLessThan(single.breakdown.incomeTax);
  });

  it('children increase the family minimum and reduce tax', () => {
    const noKids = computeNetSpain(40000, table, baseOpts, es);
    const twoKids = computeNetSpain(40000, table, { ...baseOpts, children: 2 }, es);
    expect(twoKids.breakdown.incomeTax).toBeLessThan(noKids.breakdown.incomeTax);
  });

  it('caps Social Security at the maximum base', () => {
    const r = computeNetSpain(100000, table, baseOpts, es);
    // SS capped: 61214.40 * 0.065 = 3978.94
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(3978.94, 2);
  });
});
