/**
 * Tax data loader and validation functions
 */

import { TaxData } from '@/types/tax';
import { validateTaxData } from './tax/schema';
import fs from 'fs';
import path from 'path';

/**
 * Loads tax table data for a given country code and year
 *
 * @param countryCode - ISO country code (e.g., 'DE', 'UK', 'US')
 * @param year - Tax year (e.g., 2026)
 * @returns TaxData object with validated tax information
 * @throws Error if file not found, invalid format, or validation fails
 */
export function getTaxTable(countryCode: string, year: number): TaxData {
  // Normalize country code to lowercase
  const normalizedCountryCode = countryCode.toUpperCase();

  // Validate inputs
  if (!normalizedCountryCode || typeof normalizedCountryCode !== 'string') {
    throw new Error('Invalid country code provided');
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error(`Invalid year: ${year}. Year must be between 2000 and 2100`);
  }

  // Construct file path
  // In Next.js, we need to use process.cwd() for server-side operations
  const dataDir = path.join(
    process.cwd(),
    'src',
    'data',
    'tax',
    normalizedCountryCode.toLowerCase()
  );
  let filePath = path.join(dataDir, `${year}.json`);
  let actualYear = year;

  // Check if file exists, fallback to 2026 if not found
  if (!fs.existsSync(filePath)) {
    const fallbackYear = 2026;
    const fallbackPath = path.join(dataDir, `${fallbackYear}.json`);
    if (fs.existsSync(fallbackPath)) {
      filePath = fallbackPath;
      actualYear = fallbackYear;
    } else {
      throw new Error(
        `Tax data file not found for country code "${normalizedCountryCode}" and year ${year}. ` +
          `Expected path: ${filePath}`
      );
    }
  }

  try {
    // Read and parse JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Validate data structure with Zod schema
    const validation = validateTaxData(data);
    if (!validation.valid) {
      throw new Error(
        `Invalid tax data format for ${normalizedCountryCode} ${year}:\n` +
          validation.errors.map((e) => `  - ${e}`).join('\n')
      );
    }

    // Validate metadata matches requested parameters
    if (data.metadata.countryCode.toUpperCase() !== normalizedCountryCode) {
      throw new Error(
        `Country code mismatch: file contains "${data.metadata.countryCode}" but expected "${normalizedCountryCode}"`
      );
    }

    // Validate year matches actual file year (may differ from requested year due to fallback)
    if (data.metadata.year !== actualYear) {
      throw new Error(
        `Year mismatch: file contains ${data.metadata.year} but expected ${actualYear}`
      );
    }

    return data;
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new Error(
        `Failed to parse JSON file for ${normalizedCountryCode} ${year}: ${error.message}`
      );
    }

    // Re-throw validation errors
    if (error instanceof Error && error.message.includes('Invalid tax data')) {
      throw error;
    }

    // Handle other errors
    throw new Error(
      `Failed to load tax data for ${normalizedCountryCode} ${year}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Get list of available country codes
 */
export function getAvailableCountries(): string[] {
  const taxDir = path.join(process.cwd(), 'src', 'data', 'tax');

  if (!fs.existsSync(taxDir)) {
    return [];
  }

  try {
    const entries = fs.readdirSync(taxDir, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name.toUpperCase());
  } catch (error) {
    console.error('Error reading tax data directory:', error);
    return [];
  }
}

/**
 * Get available years for a country
 */
export function getAvailableYears(countryCode: string): number[] {
  const normalizedCountryCode = countryCode.toUpperCase();
  const countryDir = path.join(
    process.cwd(),
    'src',
    'data',
    'tax',
    normalizedCountryCode.toLowerCase()
  );

  if (!fs.existsSync(countryDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(countryDir);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => parseInt(file.replace('.json', ''), 10))
      .filter((year) => !isNaN(year) && year > 2000 && year < 2100)
      .sort((a, b) => b - a); // Sort descending (newest first)
  } catch (error) {
    console.error(`Error reading tax data directory for ${normalizedCountryCode}:`, error);
    return [];
  }
}
