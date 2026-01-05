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
  solidaritySurcharge: {
    rate: number;
    threshold: number;
    note: string;
  };
}

