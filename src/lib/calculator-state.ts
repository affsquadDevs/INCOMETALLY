/**
 * Calculator State Management
 * 
 * Single source of truth: annualGross
 * All mode values (hourly, monthly, yearly) are derived from annualGross
 * Prevents circular updates and precision loss
 */

import { type IncomeMode } from './tax/types';
import { annualizeIncome, deannualizeIncome } from './tax/calc';

export interface CalculatorInputs {
  mode: IncomeMode;
  value: number; // The input value in the current mode
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface CalculatorDisplay {
  annualGross: number;
  hourly: number;
  monthly: number;
  yearly: number;
}

/**
 * Convert input mode value to annual gross (single source of truth)
 */
export function inputToAnnualGross(inputs: CalculatorInputs): number {
  return annualizeIncome(
    inputs.mode,
    inputs.value,
    inputs.hoursPerWeek,
    inputs.weeksPerYear
  );
}

/**
 * Convert annual gross to display values for all modes
 */
export function annualGrossToDisplay(
  annualGross: number,
  hoursPerWeek: number,
  weeksPerYear: number
): CalculatorDisplay {
  const deannualized = deannualizeIncome(annualGross, hoursPerWeek, weeksPerYear);
  
  return {
    annualGross,
    hourly: deannualized.hourly,
    monthly: deannualized.monthly,
    yearly: deannualized.yearly,
  };
}

/**
 * Get the value for a specific mode from annual gross
 */
export function getModeValue(
  annualGross: number,
  mode: IncomeMode,
  hoursPerWeek: number,
  weeksPerYear: number
): number {
  const display = annualGrossToDisplay(annualGross, hoursPerWeek, weeksPerYear);
  
  switch (mode) {
    case 'hourly':
      return display.hourly;
    case 'monthly':
      return display.monthly;
    case 'yearly':
      return display.yearly;
  }
}

/**
 * Format number with precision (avoid floating point issues)
 */
export function formatPrecise(value: number, decimals: number = 2): string {
  // Use toFixed to avoid floating point precision issues
  const fixed = value.toFixed(decimals);
  // Remove trailing zeros for cleaner display
  return parseFloat(fixed).toString();
}

/**
 * Normalize monetary input to annual amount based on income mode
 * This ensures all monetary values (deductions, contributions, etc.) are in yearly terms
 * regardless of how the user entered them
 */
export function normalizeToAnnual(
  value: number,
  mode: IncomeMode,
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): number {
  if (value <= 0) return 0;
  
  switch (mode) {
    case 'hourly':
      return value * hoursPerWeek * weeksPerYear;
    case 'monthly':
      return value * 12;
    case 'yearly':
      return value;
    default:
      return value;
  }
}

