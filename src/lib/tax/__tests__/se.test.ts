import { describe, it, expect } from 'vitest';
import { computeNetSweden } from '../se';
import type { TaxData } from '@/types/tax';
import type { SEOptionsData, SETaxOptions } from '@/types/se';

const table: TaxData = {
  metadata: {
    countryCode: 'SE',
    countryName: 'Sweden',
    currency: 'SEK',
    year: 2026,
    disclaimerShort: 'x',
  },
  brackets: [{ from: 0, to: null, rate: 0.32 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const se: SEOptionsData = {
  metadata: { countryCode: 'SE', year: 2026, notes: 'x' },
  pbb: 59200,
  skiktgrans: 643000,
  stateRate: 0.2,
  churchFeeRate: 0.0102,
  municipalities: [
    { id: 'avg', name: 'National average', rate: 0.3238 },
    { id: 'stockholm', name: 'Stockholm', rate: 0.3055 },
    { id: 'custom', name: 'Custom', rate: 0.3238 },
  ],
};

const baseOpts: SETaxOptions = {
  municipality: 'avg',
  customMunicipalRate: 32.38,
  churchMember: false,
};

describe('computeNetSweden', () => {
  it('computes net for 500,000 SEK at the average municipal rate (with jobbskatteavdrag)', () => {
    const r = computeNetSweden(500000, table, baseOpts, se);
    // GA = 17,400; taxable = 482,600; municipal = 156,265.88; state = 0
    // jobbskatteavdrag = floor((3.027*59200 - 17400) * 0.3238) = 52,390
    // income tax = 156,265.88 - 52,390 = 103,875.88; net = 396,124.12
    expect(r.breakdown.allowances.total).toBeCloseTo(17400, 2);
    expect(r.breakdown.taxableIncome).toBeCloseTo(482600, 2);
    expect(r.breakdown.incomeTax).toBeCloseTo(103875.88, 1);
    expect(r.netAnnual).toBeCloseTo(396124.12, 1);
  });

  it('applies state tax above the skiktgräns', () => {
    const below = computeNetSweden(600000, table, baseOpts, se);
    const above = computeNetSweden(800000, table, baseOpts, se);
    // 800k has taxable above 643,000 so state tax (20%) applies on the excess
    expect(above.effectiveTaxRate).toBeGreaterThan(below.effectiveTaxRate);
  });

  it('church members pay more (lower net) than non-members', () => {
    const nonMember = computeNetSweden(500000, table, baseOpts, se);
    const member = computeNetSweden(500000, table, { ...baseOpts, churchMember: true }, se);
    expect(member.netAnnual).toBeLessThan(nonMember.netAnnual);
    expect(member.breakdown.socialContributions.totalAnnual).toBeCloseTo(482600 * 0.0102, 1);
  });

  it('uses a custom municipal rate when selected', () => {
    const custom = computeNetSweden(
      500000,
      table,
      { municipality: 'custom', customMunicipalRate: 25, churchMember: false },
      se
    );
    const avg = computeNetSweden(500000, table, baseOpts, se);
    expect(custom.netAnnual).toBeGreaterThan(avg.netAnnual); // lower rate -> higher net
  });

  it('reaches grundavdrag maximum in the middle income band', () => {
    const r = computeNetSweden(180000, table, baseOpts, se);
    expect(r.breakdown.allowances.total).toBeCloseTo(45600, 2);
  });
});
