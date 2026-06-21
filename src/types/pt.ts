/**
 * Portugal-specific tax calculation types
 */

export type PTRegion = 'mainland' | 'azores' | 'madeira';

export interface PTTaxOptions {
  region: PTRegion;
  // Joint taxation (tributacao conjunta) uses the quociente conjugal (split by 2).
  // 'joint' assumes the entered income is the household income (sole-earner case).
  filingStatus: 'single' | 'joint';
  dependants: number;
}

export interface PTBracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface PTOptionsData {
  metadata: {
    countryCode: 'PT';
    year: number;
    notes: string;
  };
  // Mainland (Continente) IRS marginal brackets.
  brackets: PTBracket[];
  // Per-bracket rate reduction by region (Azores/Madeira reduce the mainland rates).
  regionalReduction: Record<PTRegion, number[]>;
  // Specific deduction for employment income (8.54 x IAS); actual SS used if higher.
  specificDeduction: number;
  ssRate: number; // employee Social Security, 0.11, no ceiling
  dependantCredit: number; // deducao a coleta per dependant
}
