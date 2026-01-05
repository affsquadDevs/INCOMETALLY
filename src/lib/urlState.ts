/**
 * URL state management helper
 * Handles parsing and serializing calculator state to/from URL query params
 * and localStorage for persistence.
 */

import { type IncomeMode } from '@/lib/tax/types';

export interface CalculatorState {
  country: string;
  mode: IncomeMode;
  gross: string;
  hoursPerWeek: string;
  weeksPerYear: string;
  year: number;
}

export interface CalculatorDefaults {
  country: string;
  mode: IncomeMode;
  gross: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  year: number;
}

const STORAGE_KEY = 'tax-calculator-state';

/**
 * Parse query parameters from URL search string
 */
export function parseQueryParams(search: string): Partial<CalculatorState> {
  const params = new URLSearchParams(search);
  const state: Partial<CalculatorState> = {};

  const country = params.get('country');
  if (country) {
    state.country = country.toUpperCase();
  }

  const year = params.get('year');
  if (year) {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum) && yearNum > 0) {
      state.year = yearNum;
    }
  }

  const mode = params.get('mode');
  if (mode && ['hourly', 'monthly', 'yearly'].includes(mode)) {
    state.mode = mode as IncomeMode;
  }

  const gross = params.get('gross');
  if (gross) {
    state.gross = gross;
  }

  const h = params.get('h');
  if (h) {
    state.hoursPerWeek = h;
  }

  const w = params.get('w');
  if (w) {
    state.weeksPerYear = w;
  }

  return state;
}

/**
 * Serialize state to URL query parameters
 */
export function serializeToQueryParams(state: CalculatorState): string {
  const params = new URLSearchParams({
    country: state.country.toLowerCase(),
    year: state.year.toString(),
    mode: state.mode,
    gross: state.gross,
    h: state.hoursPerWeek,
    w: state.weeksPerYear,
  });

  return params.toString();
}

/**
 * Load state from localStorage (client-side only)
 */
export function loadFromLocalStorage(): Partial<CalculatorState> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    return parsed as Partial<CalculatorState>;
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage (client-side only)
 */
export function saveToLocalStorage(state: CalculatorState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
}

/**
 * Hydrate state with priority: query params > localStorage > defaults
 */
export function hydrateState(
  queryParams: string,
  defaults: CalculatorDefaults
): CalculatorState {
  // Start with defaults
  const state: CalculatorState = {
    country: defaults.country,
    mode: defaults.mode,
    gross: defaults.gross.toString(),
    hoursPerWeek: defaults.hoursPerWeek.toString(),
    weeksPerYear: defaults.weeksPerYear.toString(),
    year: defaults.year,
  };

  // Apply localStorage (second priority)
  const stored = loadFromLocalStorage();
  if (stored) {
    if (stored.country) state.country = stored.country;
    if (stored.mode) state.mode = stored.mode;
    if (stored.gross) state.gross = stored.gross;
    if (stored.hoursPerWeek) state.hoursPerWeek = stored.hoursPerWeek;
    if (stored.weeksPerYear) state.weeksPerYear = stored.weeksPerYear;
    if (stored.year) state.year = stored.year;
  }

  // Apply query params (highest priority)
  const query = parseQueryParams(queryParams);
  if (query.country) state.country = query.country;
  if (query.mode) state.mode = query.mode;
  if (query.gross) state.gross = query.gross;
  if (query.hoursPerWeek) state.hoursPerWeek = query.hoursPerWeek;
  if (query.weeksPerYear) state.weeksPerYear = query.weeksPerYear;
  if (query.year) state.year = query.year;

  return state;
}

