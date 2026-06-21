import { type IncomeMode } from './tax/types';
import { annualizeIncome, deannualizeIncome } from './tax/calc';

export interface CalculatorInputs {
  mode: IncomeMode;
  value: number;
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface CalculatorDisplay {
  annualGross: number;
  hourly: number;
  monthly: number;
  yearly: number;
}

export function inputToAnnualGross(inputs: CalculatorInputs): number {
  return annualizeIncome(inputs.mode, inputs.value, inputs.hoursPerWeek, inputs.weeksPerYear);
}

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

export function formatPrecise(value: number, decimals: number = 2): string {
  const fixed = value.toFixed(decimals);
  return parseFloat(fixed).toString();
}

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
