import { describe, it as test, expect } from 'vitest';
import { computeNetItaly } from '../it';
import type { TaxData } from '@/types/tax';
import type { ITOptionsData, ITTaxOptions } from '@/types/it';

const table: TaxData = {
  metadata: { countryCode: 'IT', countryName: 'Italy', currency: 'EUR', year: 2026, disclaimerShort: 'x' },
  brackets: [{ from: 0, to: null, rate: 0.23 }],
  socialContrib: [],
  allowances: {},
  roundingRules: { nearestCent: true },
};

const itData: ITOptionsData = {
  metadata: { countryCode: 'IT', year: 2026, notes: 'x' },
  brackets: [
    { from: 0, to: 28000, rate: 0.23 },
    { from: 28000, to: 50000, rate: 0.33 },
    { from: 50000, to: null, rate: 0.43 },
  ],
  inps: { rate: 0.0919, extraRate: 0.01, primaFascia: 56224, massimale: 122295 },
  detrazione: {
    upTo15000: 1955,
    band2Base: 1910,
    band2Var: 1190,
    band2Width: 13000,
    band3Base: 1910,
    band3Width: 22000,
    bonus65Low: 25000,
    bonus65High: 35000,
    bonus65: 65,
  },
  dependentChildCredit: 950,
  spouseCredit: { base: 800, taper: 110, band1: 15000, flat: 690, band2: 40000, band3: 80000 },
  regions: [
    { id: 'avg', name: 'Average', rate: 0.017 },
    { id: 'lombardia', name: 'Lombardia', rate: 0.0173 },
    { id: 'custom', name: 'Custom', rate: 0.017 },
  ],
};

const baseOpts: ITTaxOptions = { region: 'lombardia', customRegionalRate: 1.7, municipalRate: 0.8, dependentChildren: 0, dependentSpouse: false };

describe('computeNetItaly', () => {
  test('computes 35,000 EUR single in Lombardia (2026 33% middle rate)', () => {
    const r = computeNetItaly(35000, table, baseOpts, itData);
    // INPS = 3216.5; base = 31783.5; IRPEF gross = 7688.56; detrazione = 1367.27
    // IRPEF net = 6321.29; regional 1.73% = 549.85; municipal 0.8% = 254.27
    // income tax total = 7125.41; net = 24658.10
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(3216.5, 2);
    expect(r.breakdown.taxableIncome).toBeCloseTo(31783.5, 2);
    expect(r.breakdown.incomeTax).toBeCloseTo(7125.41, 1);
    expect(r.netAnnual).toBeCloseTo(24658.1, 1);
  });

  test('applies the extra 1% INPS above the prima fascia', () => {
    const r = computeNetItaly(70000, table, baseOpts, itData);
    // INPS = 70000*0.0919 + (70000-56224)*0.01 = 6433 + 137.76 = 6570.76
    expect(r.breakdown.socialContributions.totalAnnual).toBeCloseTo(6570.76, 2);
  });

  test('dependent children (21-29) reduce income tax by 950 each', () => {
    const noKids = computeNetItaly(45000, table, baseOpts, itData);
    const twoKids = computeNetItaly(45000, table, { ...baseOpts, dependentChildren: 2 }, itData);
    expect(twoKids.breakdown.incomeTax).toBeCloseTo(noKids.breakdown.incomeTax - 1900, 1);
  });

  test('custom regional rate changes the tax', () => {
    const lomb = computeNetItaly(45000, table, baseOpts, itData);
    const custom = computeNetItaly(45000, table, { ...baseOpts, region: 'custom', customRegionalRate: 0.7 }, itData);
    expect(custom.netAnnual).toBeGreaterThan(lomb.netAnnual); // lower regional rate -> higher net
  });

  test('dependent-spouse credit reduces income tax', () => {
    const noSpouse = computeNetItaly(45000, table, baseOpts, itData);
    const withSpouse = computeNetItaly(45000, table, { ...baseOpts, dependentSpouse: true }, itData);
    // spouse credit at 45,000 = 690 * (80000 - 45000) / 40000 = 603.75
    expect(withSpouse.breakdown.incomeTax).toBeCloseTo(noSpouse.breakdown.incomeTax - 603.75, 1);
  });
});
