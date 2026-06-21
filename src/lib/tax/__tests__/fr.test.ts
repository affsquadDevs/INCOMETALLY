import { describe, it, expect } from 'vitest';
import { computeNetFrance } from '../fr';
import type { TaxData } from '@/types/tax';
import type { FROptionsData, FRTaxOptions } from '@/types/fr';

const table: TaxData = {
  metadata: { countryCode: 'FR', countryName: 'France', currency: 'EUR', year: 2026, disclaimerShort: 'x' },
  brackets: [{ from: 0, to: null, rate: 0.11 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const fr: FROptionsData = {
  metadata: { countryCode: 'FR', year: 2026, notes: 'x' },
  brackets: [
    { from: 0, to: 11600, rate: 0 },
    { from: 11600, to: 29579, rate: 0.11 },
    { from: 29579, to: 84577, rate: 0.3 },
    { from: 84577, to: 181917, rate: 0.41 },
    { from: 181917, to: null, rate: 0.45 },
  ],
  pass: 48060,
  cotisations: {
    vieillessePlaf: 0.069,
    vieillesseDeplaf: 0.004,
    agircT1: 0.0401,
    agircT2: 0.0986,
    csgDeductibleRate: 0.068,
    csgNonDeductibleRate: 0.024,
    crdsRate: 0.005,
    csgBaseRate: 0.9825,
    csgBaseCapPassMultiple: 4,
  },
  deduction10: { rate: 0.1, min: 509, max: 14555 },
  halfPartCap: 1807,
  decote: { singleThreshold: 1982, singleAmount: 897, coupleThreshold: 3277, coupleAmount: 1483, rate: 0.4525 },
};

const baseOpts: FRTaxOptions = { filingStatus: 'single', children: 0 };

describe('computeNetFrance', () => {
  it('computes single, no children, gross 45,000 EUR', () => {
    const r = computeNetFrance(45000, table, baseOpts, fr);
    // total cotisations = 9378.11; revenu imposable = 33213.64; income tax = 3068.08
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(9378.11, 1);
    expect(r.breakdown.taxableIncome).toBeCloseTo(33213.64, 1);
    expect(r.breakdown.incomeTax).toBeCloseTo(3068.08, 1);
    expect(r.netAnnual).toBeCloseTo(32553.81, 1);
  });

  it('décote removes income tax for low earners', () => {
    const r = computeNetFrance(20000, table, baseOpts, fr);
    expect(r.breakdown.incomeTax).toBe(0);
  });

  it('a married couple (2 parts) pays less than a single person', () => {
    const single = computeNetFrance(60000, table, baseOpts, fr);
    const married = computeNetFrance(60000, table, { ...baseOpts, filingStatus: 'married' }, fr);
    expect(married.breakdown.incomeTax).toBeLessThan(single.breakdown.incomeTax);
  });

  it('children reduce tax but the quotient advantage is capped (plafonnement)', () => {
    const noKids = computeNetFrance(120000, table, { filingStatus: 'married', children: 0 }, fr);
    const threeKids = computeNetFrance(120000, table, { filingStatus: 'married', children: 3 }, fr);
    expect(threeKids.breakdown.incomeTax).toBeLessThan(noKids.breakdown.incomeTax);
    // With 3 children a married couple has 4 parts = 4 extra half-parts, capped at 4*1807 = 7228
    const advantage = noKids.breakdown.incomeTax - threeKids.breakdown.incomeTax;
    expect(advantage).toBeLessThanOrEqual(4 * 1807 + 1);
  });

  it('applies the extra Agirc-Arrco T2 and CSG above the PASS for high earners', () => {
    const r = computeNetFrance(120000, table, baseOpts, fr);
    // effective burden should be substantial; net clearly below gross
    expect(r.netAnnual).toBeLessThan(120000);
    expect(r.netAnnual).toBeGreaterThan(60000);
  });
});
