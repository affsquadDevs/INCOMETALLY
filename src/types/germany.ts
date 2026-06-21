/**
 * Type definitions for Germany-specific tax calculation parameters
 */

export interface GermanyTaxOptions {
  taxClass: '1' | '2' | '3' | '4' | '5' | '6';
  healthInsurance: 'public' | 'private-without' | 'private-with';
  state: string; // State code (e.g., 'BW', 'BY', 'BE')
  inChurch: boolean;
  children: boolean; // Whether employee has children
}

export interface GermanyOptionsData {
  taxClasses: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  healthInsuranceTypes: Array<{
    id: string;
    name: string;
    rate: number;
    cap: number | null;
    note?: string;
  }>;
  states: Array<{
    id: string;
    name: string;
    churchTaxRate: number;
  }>;
  // Steuerklasse II relief (Entlastungsbetrag für Alleinerziehende), annual amount
  singleParentRelief?: number;
  solidaritySurcharge: {
    rate: number;
    // Legacy/simple threshold (kept for backward compatibility)
    threshold?: number;
    // Preferred: exemption/phase-in is based on income tax amount (ESt), not income.
    exemptIncomeTax?: number;
    // In the phase-in zone, Soli is computed as phaseInRate * (ESt - exemptIncomeTax), capped at (rate * ESt)
    phaseInRate?: number;
    note: string;
  };
}
