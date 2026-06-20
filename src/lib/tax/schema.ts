/**
 * Zod schema for tax data validation
 * Ensures tax JSON files are valid at build time
 */

import { z } from 'zod';

/**
 * Tax bracket schema
 * - from: starting income (must be >= 0)
 * - to: ending income (null for highest bracket)
 * - rate: tax rate (0-1)
 */
export const TaxBracketSchema = z.object({
  from: z.number().min(0),
  to: z.number().nullable(),
  rate: z.number().min(0).max(1),
});

/**
 * Social contribution schema
 * - name: contribution name
 * - rate: contribution rate (0-1)
 * - cap: optional income cap
 */
export const SocialContributionSchema = z.object({
  name: z.string().min(1),
  rate: z.number().min(0).max(1),
  cap: z.number().min(0).optional(),
  deductible: z.boolean().optional(),
});

/**
 * Allowances schema
 */
export const AllowancesSchema = z.object({
  standardDeduction: z.number().min(0).optional(),
  personalAllowance: z.number().min(0).optional(),
  employeeLumpSum: z.number().min(0).optional(),
  singleParentRelief: z.number().min(0).optional(),
});

/**
 * Complete tax data schema
 */
export const TaxDataSchema = z.object({
  metadata: z.object({
    countryCode: z.string().length(2),
    countryName: z.string().min(1),
    currency: z.string().length(3),
    year: z.number().int().min(2000).max(2100),
    disclaimerShort: z.string().min(1),
  }),
  brackets: z.array(TaxBracketSchema).min(1),
  socialContrib: z.array(SocialContributionSchema).min(0),
  allowances: AllowancesSchema,
  solidaritySurcharge: z
    .object({
      rate: z.number().min(0).max(1),
      threshold: z.number().min(0).optional(),
      exemptIncomeTax: z.number().min(0).optional(),
      phaseInRate: z.number().min(0).max(1).optional(),
    })
    .optional(),
  roundingRules: z.object({
    nearestCent: z.boolean(),
    incomeTaxRoundedDownToEuro: z.boolean().optional(),
  }),
});

export type TaxDataSchemaType = z.infer<typeof TaxDataSchema>;

/**
 * Validate tax brackets are sorted and non-overlapping
 */
export function validateBrackets(brackets: z.infer<typeof TaxBracketSchema>[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (brackets.length === 0) {
    return { valid: false, errors: ['At least one tax bracket is required'] };
  }

  // Check brackets are sorted by 'from'
  for (let i = 1; i < brackets.length; i++) {
    if (brackets[i].from <= brackets[i - 1].from) {
      errors.push(`Bracket ${i + 1} 'from' (${brackets[i].from}) must be greater than previous bracket 'from' (${brackets[i - 1].from})`);
    }
  }

  // Check for gaps or overlaps
  for (let i = 0; i < brackets.length - 1; i++) {
    const current = brackets[i];
    const next = brackets[i + 1];

    if (current.to !== null) {
      if (current.to >= next.from) {
        errors.push(`Bracket ${i + 1} overlaps with bracket ${i + 2}: 'to' (${current.to}) >= 'from' (${next.from})`);
      }
      // Check for gaps (optional - some tax systems have gaps)
      // if (current.to + 1 < next.from) {
      //   errors.push(`Gap between bracket ${i + 1} and ${i + 2}`);
      // }
    }
  }

  // Check highest bracket has null 'to'
  const lastBracket = brackets[brackets.length - 1];
  if (lastBracket.to !== null) {
    errors.push('Highest bracket must have "to" set to null (no upper limit)');
  }

  // Check rates are valid
  brackets.forEach((bracket, index) => {
    if (bracket.rate < 0 || bracket.rate > 1) {
      errors.push(`Bracket ${index + 1} has invalid rate: ${bracket.rate} (must be 0-1)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate complete tax data
 */
export function validateTaxData(data: unknown): {
  valid: boolean;
  errors: string[];
  data?: TaxDataSchemaType;
} {
  try {
    // Parse with Zod schema
    const parsed = TaxDataSchema.parse(data);

    // Validate brackets
    const bracketValidation = validateBrackets(parsed.brackets);
    if (!bracketValidation.valid) {
      return {
        valid: false,
        errors: bracketValidation.errors,
      };
    }

    return {
      valid: true,
      errors: [],
      data: parsed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error'],
    };
  }
}

