/**
 * Poland-specific tax calculation types
 */

export interface PLTaxOptions {
  // Joint assessment with a spouse (income splitting). 'joint' assumes the entered
  // income is the household income (sole-earner case), matching how we handle US MFJ.
  filingStatus: 'single' | 'joint';
  // Relief for the young (ulga dla mlodych / PIT-0): exempts employment income up to a limit.
  under26: boolean;
  // Number of dependent children (ulga na dzieci tax credit).
  children: number;
  // Tax-deductible contributions, e.g. IKZE (annual).
  preTaxDeductible: number;
}

export interface PLOptionsData {
  metadata: {
    countryCode: 'PL';
    year: number;
    notes: string;
  };
  rateLow: number; // 0.12
  rateHigh: number; // 0.32
  threshold: number; // 120000 (tax base boundary between 12% and 32%)
  taxReducingAmount: number; // 3600 (kwota zmniejszajaca podatek = 12% x 30000)
  taxFreeAmount: number; // 30000 (kwota wolna, realized via taxReducingAmount)
  zus: {
    pension: number; // 0.0976 (emerytalne)
    disability: number; // 0.015 (rentowe)
    sickness: number; // 0.0245 (chorobowe, uncapped)
    annualCap: number; // cap for pension + disability base
  };
  health: {
    rate: number; // 0.09 (zdrowotne, not tax-deductible)
  };
  under26ExemptLimit: number; // 85528
  childRelief: {
    first: number;
    second: number;
    third: number;
    fourthPlus: number; // per child for the 4th and each subsequent
  };
}
