/**
 * Zod schema for validating US options data (us-options.json)
 * This complements TaxDataSchema (which validates the YYYY.json tables).
 */

import { z } from 'zod';
import { TaxBracketSchema, validateBrackets } from './schema';

const FilingStatusSchema = z.enum(['single', 'mfj', 'mfs', 'hoh']);

const UseOptionsTaxBracketSchema = TaxBracketSchema;

const PayrollSchema = z.object({
  employee: z.object({
    socialSecurityRate: z.number().min(0).max(1),
    socialSecurityWageBase: z.number().min(0),
    medicareRate: z.number().min(0).max(1),
    additionalMedicareRate: z.number().min(0).max(1),
    additionalMedicareThreshold: z.record(FilingStatusSchema, z.number().min(0)),
  }),
  selfEmployed: z.object({
    seEarningsMultiplier: z.number().min(0).max(1),
    socialSecurityRate: z.number().min(0).max(1),
    socialSecurityWageBase: z.number().min(0),
    medicareRate: z.number().min(0).max(1),
    additionalMedicareRate: z.number().min(0).max(1),
    additionalMedicareThreshold: z.record(FilingStatusSchema, z.number().min(0)),
  }),
});

const CreditsSchema = z.object({
  childTaxCredit: z.object({
    amountPerChildUnder17: z.number().min(0),
    phaseoutStart: z.record(FilingStatusSchema, z.number().min(0)),
    phaseoutReductionPer1000: z.number().min(0),
  }),
  otherDependentCredit: z.object({
    amountPerDependent: z.number().min(0),
    phaseoutStart: z.record(FilingStatusSchema, z.number().min(0)),
    phaseoutReductionPer1000: z.number().min(0),
  }),
});

export const USOptionsDataSchema = z.object({
  metadata: z.object({
    countryCode: z.literal('US'),
    year: z.number().int().min(2000).max(2100),
    notes: z.string().min(1),
    sources: z
      .object({
        irsNewsReleaseUrl: z.string().url().optional(),
        revenueProcedurePdfUrl: z.string().url().optional(),
        extractedAt: z.string().min(8).optional(),
      })
      .optional(),
  }),
  filingStatuses: z
    .array(
      z.object({
        id: FilingStatusSchema,
        name: z.string().min(1),
      })
    )
    .min(1),
  standardDeduction: z.record(FilingStatusSchema, z.number().min(0)),
  additionalStandardDeduction: z.object({
    singleOrHoh: z.number().min(0),
    marriedOrMfs: z.number().min(0),
  }),
  federalBrackets: z.record(FilingStatusSchema, z.array(UseOptionsTaxBracketSchema).min(1)),
  payroll: PayrollSchema,
  credits: CreditsSchema,
});

export type USOptionsDataSchemaType = z.infer<typeof USOptionsDataSchema>;

export function validateUsOptionsData(data: unknown): {
  valid: boolean;
  errors: string[];
  data?: USOptionsDataSchemaType;
} {
  try {
    const parsed = USOptionsDataSchema.parse(data);

    // Validate brackets for each filing status
    const errors: string[] = [];
    for (const status of Object.keys(parsed.federalBrackets) as Array<
      keyof typeof parsed.federalBrackets
    >) {
      const brackets = parsed.federalBrackets[status];
      if (brackets) {
        const bracketValidation = validateBrackets(brackets);
        if (!bracketValidation.valid) {
          bracketValidation.errors.forEach((e) => errors.push(`federalBrackets.${status}: ${e}`));
        }
      }
    }

    return errors.length
      ? { valid: false, errors }
      : {
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
