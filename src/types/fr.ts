/**
 * France-specific tax calculation types
 */

export interface FRTaxOptions {
  // 'married' covers married / PACS couples taxed jointly (2 parts).
  filingStatus: 'single' | 'married';
  children: number;
}

export interface FRBracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface FROptionsData {
  metadata: {
    countryCode: 'FR';
    year: number;
    notes: string;
  };
  brackets: FRBracket[]; // bareme per part
  pass: number; // plafond annuel de la securite sociale
  cotisations: {
    vieillessePlaf: number; // 0.069 up to 1 PASS
    vieillesseDeplaf: number; // 0.004 on all
    agircT1: number; // ~0.0401 up to 1 PASS (incl. CEG)
    agircT2: number; // ~0.0986 between 1 and 8 PASS
    csgDeductibleRate: number; // 0.068
    csgNonDeductibleRate: number; // 0.024
    crdsRate: number; // 0.005
    csgBaseRate: number; // 0.9825 abatement
    csgBaseCapPassMultiple: number; // abatement applies up to 4 PASS
  };
  deduction10: { rate: number; min: number; max: number };
  halfPartCap: number; // plafonnement du quotient familial per half-part (1807)
  decote: {
    singleThreshold: number;
    singleAmount: number;
    coupleThreshold: number;
    coupleAmount: number;
    rate: number;
  };
}
