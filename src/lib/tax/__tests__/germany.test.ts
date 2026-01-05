import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import { computeNetGermany, computeGermanySolidaritySurcharge } from '../germany';
import { getTaxTable } from '@/lib/tax';
import type { GermanyOptionsData, GermanyTaxOptions } from '@/types/germany';

function loadGermanyOptions(): GermanyOptionsData {
  const optionsPath = path.join(process.cwd(), 'src', 'data', 'tax', 'de', 'germany-options.json');
  return JSON.parse(fs.readFileSync(optionsPath, 'utf-8')) as GermanyOptionsData;
}

describe('Germany (DE) 2026 - core correctness', () => {
  it('Soli: exemption + phase-in (no sudden full 5.5% jump right after threshold)', () => {
    const soli = {
      rate: 0.055,
      exemptIncomeTax: 1000,
      phaseInRate: 0.119,
      note: 'test',
    };

    expect(computeGermanySolidaritySurcharge(999, soli)).toBe(0);
    expect(computeGermanySolidaritySurcharge(1000, soli)).toBe(0);

    // Just above exemption: should be small (phase-in), not full 5.5%
    const at1001 = computeGermanySolidaritySurcharge(1001, soli);
    expect(at1001).toBeCloseTo(0.119 * 1, 6);
    expect(at1001).toBeLessThan(0.055 * 1001);

    // Well into the zone: still capped by full rate
    const high = computeGermanySolidaritySurcharge(50000, soli);
    expect(high).toBeCloseTo(0.055 * 50000, 6);
  });

  it('Tax class II (single parent) reduces taxable income vs class I', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const base: Omit<GermanyTaxOptions, 'taxClass'> = {
      healthInsurance: 'public',
      state: 'BW',
      inChurch: false,
      children: true,
    };

    const r1 = computeNetGermany(60000, table, { ...base, taxClass: '1' }, germanyOptions);
    const r2 = computeNetGermany(60000, table, { ...base, taxClass: '2' }, germanyOptions);

    expect(r2.breakdown.incomeTax).toBeLessThan(r1.breakdown.incomeTax);
    expect(r2.netAnnual).toBeGreaterThan(r1.netAnnual);
  });

  it('Tax class III (splitting) lowers income tax vs class I for the same gross', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const common: Omit<GermanyTaxOptions, 'taxClass'> = {
      healthInsurance: 'public',
      state: 'BW',
      inChurch: false,
      children: false,
    };

    const r1 = computeNetGermany(80000, table, { ...common, taxClass: '1' }, germanyOptions);
    const r3 = computeNetGermany(80000, table, { ...common, taxClass: '3' }, germanyOptions);

    expect(r3.breakdown.incomeTax).toBeLessThan(r1.breakdown.incomeTax);
    expect(r3.netAnnual).toBeGreaterThan(r1.netAnnual);
  });

  it('Tax class IV (4) must match tax class I (1) for annual income tax (same person, no splitting)', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const common: Omit<GermanyTaxOptions, 'taxClass'> = {
      healthInsurance: 'public',
      state: 'HB', // Bremen (church tax 9%)
      inChurch: true,
      children: false,
    };

    const r1 = computeNetGermany(50000, table, { ...common, taxClass: '1' }, germanyOptions);
    const r4 = computeNetGermany(50000, table, { ...common, taxClass: '4' }, germanyOptions);

    expect(r4.breakdown.incomeTax).toBeCloseTo(r1.breakdown.incomeTax, 2);
    expect(r4.netAnnual).toBeCloseTo(r1.netAnnual, 2);
  });

  it('Tax class ordering (withholding model): III < I = IV < V < VI (same gross/options)', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const common: Omit<GermanyTaxOptions, 'taxClass'> = {
      healthInsurance: 'public',
      state: 'HB',
      inChurch: true,
      children: false,
    };

    const r3 = computeNetGermany(50000, table, { ...common, taxClass: '3' }, germanyOptions);
    const r1 = computeNetGermany(50000, table, { ...common, taxClass: '1' }, germanyOptions);
    const r4 = computeNetGermany(50000, table, { ...common, taxClass: '4' }, germanyOptions);
    const r5 = computeNetGermany(50000, table, { ...common, taxClass: '5' }, germanyOptions);
    const r6 = computeNetGermany(50000, table, { ...common, taxClass: '6' }, germanyOptions);

    // Compare total income tax line (incl. church/soli)
    expect(r3.breakdown.incomeTax).toBeLessThan(r1.breakdown.incomeTax);
    expect(r4.breakdown.incomeTax).toBeCloseTo(r1.breakdown.incomeTax, 2);
    expect(r5.breakdown.incomeTax).toBeGreaterThan(r1.breakdown.incomeTax);
    expect(r6.breakdown.incomeTax).toBeGreaterThan(r5.breakdown.incomeTax);
  });

  it('Pflegeversicherung: childless surcharge (+0.6%) applies to employee outside Saxony', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const common: Omit<GermanyTaxOptions, 'children'> = {
      taxClass: '1',
      healthInsurance: 'public',
      state: 'BW',
      inChurch: false,
    };

    const withChildren = computeNetGermany(60000, table, { ...common, children: true }, germanyOptions);
    const childless = computeNetGermany(60000, table, { ...common, children: false }, germanyOptions);

    const careWithChildren = withChildren.breakdown.socialContributions.breakdown.find(b => b.name === 'Long-term Care Insurance');
    const careChildless = childless.breakdown.socialContributions.breakdown.find(b => b.name === 'Long-term Care Insurance');

    expect(careWithChildren).toBeTruthy();
    expect(careChildless).toBeTruthy();

    // Expected delta: 0.6% * gross (below KV/PV cap) = 360 EUR
    expect((careChildless!.amount - careWithChildren!.amount)).toBeCloseTo(60000 * 0.006, 2);
    expect(childless.netAnnual).toBeLessThan(withChildren.netAnnual);
  });

  it('Pflegeversicherung: Saxony has higher employee base share than other states', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const common: GermanyTaxOptions = {
      taxClass: '1',
      healthInsurance: 'public',
      inChurch: false,
      children: true,
      state: 'BW',
    };

    const bw = computeNetGermany(60000, table, common, germanyOptions);
    const sn = computeNetGermany(60000, table, { ...common, state: 'SN' }, germanyOptions);

    const careBW = bw.breakdown.socialContributions.breakdown.find(b => b.name === 'Long-term Care Insurance')!;
    const careSN = sn.breakdown.socialContributions.breakdown.find(b => b.name === 'Long-term Care Insurance')!;

    // Expected delta in employee base share: 2.3% - 1.8% = 0.5% => 300 EUR
    expect((careSN.amount - careBW.amount)).toBeCloseTo(60000 * 0.005, 2);
    expect(sn.netAnnual).toBeLessThan(bw.netAnnual);
  });

  it('Private insurance: Health Insurance is not deducted, but Pflegeversicherung still applies', () => {
    const table = getTaxTable('DE', 2026);
    const germanyOptions = loadGermanyOptions();

    const common: Omit<GermanyTaxOptions, 'healthInsurance'> = {
      taxClass: '1',
      state: 'BW',
      inChurch: false,
      children: false,
    };

    const pub = computeNetGermany(60000, table, { ...common, healthInsurance: 'public' }, germanyOptions);
    const priv = computeNetGermany(60000, table, { ...common, healthInsurance: 'private-without' }, germanyOptions);

    const pubHealth = pub.breakdown.socialContributions.breakdown.find(b => b.name === 'Health Insurance');
    const privHealth = priv.breakdown.socialContributions.breakdown.find(b => b.name === 'Health Insurance');
    const privCare = priv.breakdown.socialContributions.breakdown.find(b => b.name === 'Long-term Care Insurance');

    expect(pubHealth).toBeTruthy();
    expect(privHealth).toBeFalsy();
    expect(privCare).toBeTruthy();
    expect(privCare!.amount).toBeGreaterThan(0);

    // Private: higher net because we don't deduct GKV premiums (paid separately).
    expect(priv.netAnnual).toBeGreaterThan(pub.netAnnual);
  });
});


