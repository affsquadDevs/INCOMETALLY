/**
 * Type definitions for tax data schema
 */

export interface TaxBracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface SocialContribution {
  name: string;
  rate: number;
  cap?: number;
}

export interface Allowances {
  standardDeduction?: number;
  personalAllowance?: number;
  employeeLumpSum?: number;
  // Germany-specific (optional): Entlastungsbetrag für Alleinerziehende (Steuerklasse II)
  singleParentRelief?: number;
}

export interface RoundingRules {
  nearestCent: boolean;
  // Some systems (e.g., Germany ESt) compute income tax in full euros (rounded down).
  // Optional because most countries don't need it.
  incomeTaxRoundedDownToEuro?: boolean;
}

export interface TaxData {
  metadata: {
    countryCode: string;
    countryName: string;
    currency: string;
    year: number;
    disclaimerShort: string;
  };
  brackets: TaxBracket[];
  socialContrib: SocialContribution[];
  allowances: Allowances;
  // Optional because not every country has this concept in our dataset
  solidaritySurcharge?: {
    rate: number;
    // Legacy/simple threshold (interpreted as exemption for income tax amount)
    threshold?: number;
    // Preferred: exemption/phase-in is based on income tax amount (ESt), not income.
    exemptIncomeTax?: number;
    phaseInRate?: number;
  };
  roundingRules: RoundingRules;
}

