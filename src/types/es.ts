/**
 * Spain-specific tax calculation types
 */

export interface ESTaxOptions {
  // Autonomous community id (regional IRPF scale). 'default' = standard/state-equivalent.
  community: string;
  // Joint return (declaracion conjunta) gives a base reduction.
  filingStatus: 'single' | 'joint';
  // Number of dependent descendants (children) for the family minimum.
  children: number;
}

export interface ESBracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface ESCommunity {
  id: string;
  name: string;
}

export interface ESOptionsData {
  metadata: {
    countryCode: 'ES';
    year: number;
    notes: string;
  };
  // State scale (escala estatal) — applied alongside the regional scale.
  stateBrackets: ESBracket[];
  // Regional scale per community (escala autonomica).
  regionalScales: Record<string, ESBracket[]>;
  communities: ESCommunity[];
  personalMinimum: number; // minimo del contribuyente (5,550)
  descendantMinimums: number[]; // per child: 1st, 2nd, 3rd, 4th+
  otrosGastos: number; // flat work-expense deduction (2,000)
  jointReduction: number; // base reduction for a joint return (3,400)
  ss: {
    rate: number; // employee Social Security total (~6.50%)
    baseMaxima: number; // annual maximum contribution base
  };
}
