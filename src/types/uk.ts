/**
 * UK-specific tax calculation types
 */

export interface UKTaxOptions {
  // Pre-tax deductions (salary sacrifice)
  preTaxPension: number; // Annual pension contributions
  preTaxOther: number; // Other salary sacrifice (cycle-to-work, etc.)

  // Student Loan
  studentLoanPlan: 'none' | 'plan2' | 'plan4' | 'plan5'; // Student loan plan type

  // Region (for future Scotland/Wales support)
  region: 'england' | 'wales' | 'scotland' | 'ni'; // Currently only England/Wales/NI supported

  // Marriage Allowance (recipient: a basic-rate taxpayer whose partner is a non-taxpayer)
  marriageAllowance: boolean;
  // Number of children (for the High Income Child Benefit Charge)
  children: number;
}

export interface UKOptionsData {
  metadata: {
    countryCode: 'UK';
    year: number;
    notes: string;
  };
  personalAllowance: {
    base: number; // Base personal allowance (£12,570 for 2026)
    phaseOutStart: number; // Income level where phase-out starts (£100,000)
    phaseOutEnd: number; // Income level where allowance becomes 0 (£125,140)
  };
  incomeTaxBands: Array<{
    from: number;
    to: number | null;
    rate: number;
  }>;
  nationalInsurance: {
    primaryThreshold: number; // £12,570
    upperEarningsLimit: number; // £50,270
    rateBasic: number; // 8% for £12,571 - £50,270
    rateHigher: number; // 2% above £50,270
  };
  studentLoan: {
    plan2: {
      threshold: number; // £27,295 (2026 estimate)
      rate: number; // 9%
      description?: string;
    };
    plan4: {
      threshold: number; // £25,000 (Scotland/SAAS loans)
      rate: number; // 9%
      description?: string;
    };
    plan5: {
      threshold: number; // £25,000 (2023+ England/Wales)
      rate: number; // 9%
      description?: string;
    };
  };
  marriageAllowance: { transfer: number; benefit: number };
  childBenefit: { firstChild: number; additionalChild: number };
  hicbc: { threshold: number; fullThreshold: number };
}
