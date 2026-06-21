/**
 * Italy-specific tax calculation types
 */

export interface ITTaxOptions {
  // Region id (preset) or 'custom' for the regional surtax (addizionale regionale).
  region: string;
  customRegionalRate: number; // percent, used when region === 'custom'
  municipalRate: number; // percent (addizionale comunale)
  // Dependent children aged 21-29 (under-21 use the Assegno Unico, not payroll detrazioni).
  dependentChildren: number;
}

export interface ITRegion {
  id: string;
  name: string;
  rate: number; // representative flat addizionale regionale, as a decimal
}

export interface ITOptionsData {
  metadata: {
    countryCode: 'IT';
    year: number;
    notes: string;
  };
  brackets: { from: number; to: number | null; rate: number }[];
  inps: {
    rate: number; // 0.0919
    extraRate: number; // 0.01 above prima fascia
    primaFascia: number; // 56224 (2026)
    massimale: number; // 122295 (2026)
  };
  detrazione: {
    upTo15000: number; // 1955
    band2Base: number; // 1910
    band2Var: number; // 1190
    band2Width: number; // 13000
    band3Base: number; // 1910
    band3Width: number; // 22000
    bonus65Low: number; // 25000
    bonus65High: number; // 35000
    bonus65: number; // 65
  };
  dependentChildCredit: number; // 950 per child aged 21-29
  regions: ITRegion[];
}
