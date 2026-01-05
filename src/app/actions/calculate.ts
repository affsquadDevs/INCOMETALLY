'use server';

import { computeNet, annualizeIncome } from '@/lib/tax/calc';
import { getTaxTable } from '@/lib/tax';
import { type IncomeMode } from '@/lib/tax/types';

/**
 * Server Action for calculator (progressive enhancement)
 * This allows the calculator to work without JavaScript
 */
export async function calculateSalary(formData: FormData) {
  try {
    const countryCode = formData.get('countryCode') as string;
    const year = parseInt(formData.get('year') as string, 10);
    const mode = formData.get('mode') as IncomeMode;
    const value = formData.get('value') as string;
    const hoursPerWeek = parseFloat(formData.get('hoursPerWeek') as string) || 40;
    const weeksPerYear = parseFloat(formData.get('weeksPerYear') as string) || 52;

    // Validate
    const normalizedCountryCode = (countryCode as string)?.toUpperCase();
    if (!normalizedCountryCode || !year || !mode || !value) {
      return {
        error: 'Missing required fields',
      };
    }

    // Germany needs extra parameters (tax class, state, church, insurance).
    // If the no-JS form doesn't send them, we can't calculate correctly.
    if (normalizedCountryCode === 'DE') {
      return {
        error: 'Germany calculator requires JavaScript (extra tax options needed).',
      };
    }

    const income = parseFloat(value);
    if (isNaN(income) || income < 0) {
      return {
        error: 'Invalid income value',
      };
    }

    // Get tax table
    const taxTable = getTaxTable(normalizedCountryCode, year);

    // Calculate
    const annualGross = annualizeIncome(mode, income, hoursPerWeek, weeksPerYear);
    const result = computeNet(annualGross, taxTable, hoursPerWeek, weeksPerYear);

    return {
      success: true,
      result,
      taxTable: {
        metadata: taxTable.metadata,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Calculation failed',
    };
  }
}

