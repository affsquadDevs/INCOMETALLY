/**
 * Sweden-specific tax calculation types
 */

export interface SETaxOptions {
  // Municipality id (preset) or 'custom'.
  municipality: string;
  // Used when municipality === 'custom' (percent, e.g. 32.38).
  customMunicipalRate: number;
  // Member of the Church of Sweden / a fee-collecting community (adds kyrkoavgift).
  churchMember: boolean;
}

export interface SEMunicipality {
  id: string;
  name: string;
  rate: number; // total local income tax rate (kommun + region), as a decimal
}

export interface SEOptionsData {
  metadata: {
    countryCode: 'SE';
    year: number;
    notes: string;
  };
  pbb: number; // prisbasbelopp
  skiktgrans: number; // taxable-income threshold for state tax
  stateRate: number; // 0.20
  churchFeeRate: number; // average kyrkoavgift for members (decimal)
  municipalities: SEMunicipality[];
}
