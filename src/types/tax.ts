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
}

export interface RoundingRules {
  nearestCent: boolean;
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
  roundingRules: RoundingRules;
}

