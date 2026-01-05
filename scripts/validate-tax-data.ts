#!/usr/bin/env tsx
/**
 * Build-time tax data validation
 * 
 * Validates all tax JSON files using Zod schema
 * Fails build if any tax data is invalid
 * 
 * Usage: npx tsx scripts/validate-tax-data.ts
 */

import fs from 'fs';
import path from 'path';
import { validateTaxData } from '../src/lib/tax/schema.ts';

const taxDataDir = path.join(process.cwd(), 'src', 'data', 'tax');
let hasErrors = false;
const errors: string[] = [];

console.log('🔍 Validating tax data files...\n');

// Get all country directories
if (!fs.existsSync(taxDataDir)) {
  console.error(`❌ Tax data directory not found: ${taxDataDir}`);
  process.exit(1);
}

const countries = fs.readdirSync(taxDataDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (countries.length === 0) {
  console.error('❌ No country directories found');
  process.exit(1);
}

// Validate each country's tax files
for (const country of countries) {
  const countryDir = path.join(taxDataDir, country);
  const files = fs.readdirSync(countryDir)
    .filter(file => {
      // Only validate files that match YYYY.json format (tax data files)
      // Skip other JSON files like germany-options.json
      return file.endsWith('.json') && /^\d{4}\.json$/.test(file);
    });

  for (const file of files) {
    const filePath = path.join(countryDir, file);
    const year = file.replace('.json', '');

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      const validation = validateTaxData(data);

      if (validation.valid) {
        console.log(`✅ ${country.toUpperCase()}/${year}.json`);
      } else {
        hasErrors = true;
        console.error(`❌ ${country.toUpperCase()}/${year}.json`);
        validation.errors.forEach(error => {
          console.error(`   ${error}`);
          errors.push(`${country.toUpperCase()}/${year}.json: ${error}`);
        });
      }
    } catch (error) {
      hasErrors = true;
      console.error(`❌ ${country.toUpperCase()}/${year}.json`);
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`   ${message}`);
      errors.push(`${country.toUpperCase()}/${year}.json: ${message}`);
    }
  }
}

console.log('');

if (hasErrors) {
  console.error('❌ Tax data validation failed!\n');
  console.error('Errors:');
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
} else {
  console.log('✅ All tax data files are valid!');
  process.exit(0);
}

