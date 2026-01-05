#!/usr/bin/env tsx
/**
 * Country Scaffold Generator
 * 
 * Generates all necessary files and updates for adding a new country to the tax calculator.
 * 
 * Usage:
 *   npx tsx scripts/addCountry.ts <code> <name> <currency> [flag]
 * 
 * Example:
 *   npx tsx scripts/addCountry.ts FR France EUR 🇫🇷
 */

import fs from 'fs';
import path from 'path';

interface CountryData {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: npx tsx scripts/addCountry.ts <code> <name> <currency> [flag]');
  console.error('Example: npx tsx scripts/addCountry.ts FR France EUR 🇫🇷');
  process.exit(1);
}

const [code, name, currency, flag = '🏳️'] = args;
const countryCode = code.toUpperCase();
const countryName = name;
const countryCurrency = currency.toUpperCase();

console.log(`\n🚀 Generating scaffold for ${countryName} (${countryCode})...\n`);

// 1. Create tax data directory and JSON template
const taxDataDir = path.join(process.cwd(), 'src', 'data', 'tax', countryCode.toLowerCase());
const taxDataFile = path.join(taxDataDir, '2026.json');

if (!fs.existsSync(taxDataDir)) {
  fs.mkdirSync(taxDataDir, { recursive: true });
  console.log(`✅ Created directory: ${taxDataDir}`);
}

const taxDataTemplate = {
  metadata: {
    countryCode: countryCode,
    countryName: countryName,
    currency: countryCurrency,
    year: 2026,
    disclaimerShort: `Estimates for ${countryName} tax calculations. Please consult official sources or a tax professional for accurate figures.`,
  },
  brackets: [
    {
      from: 0,
      to: 10000,
      rate: 0.1,
    },
    {
      from: 10001,
      to: 50000,
      rate: 0.2,
    },
    {
      from: 50001,
      to: null,
      rate: 0.3,
    },
  ],
  socialContrib: [
    {
      name: 'Social Security',
      rate: 0.05,
    },
  ],
  allowances: {
    personalAllowance: 5000,
  },
  roundingRules: {
    nearestCent: true,
  },
};

fs.writeFileSync(taxDataFile, JSON.stringify(taxDataTemplate, null, 2));
console.log(`✅ Created tax data template: ${taxDataFile}`);
console.log(`   ⚠️  Please update tax brackets, rates, and allowances with actual ${countryName} tax data`);

// 2. Update countries.ts
const countriesFile = path.join(process.cwd(), 'src', 'lib', 'countries.ts');
let countriesContent = fs.readFileSync(countriesFile, 'utf-8');

// Check if country already exists
if (countriesContent.includes(`'${countryCode}'`)) {
  console.error(`❌ Country ${countryCode} already exists in countries.ts`);
  process.exit(1);
}

// Add to CountryCode type
const countryCodeTypeMatch = countriesContent.match(/export type CountryCode = '([^']+)'(\s*\|\s*'[^']+')*;/);
if (countryCodeTypeMatch) {
  const newType = countryCodeTypeMatch[0].replace(';', ` | '${countryCode}';`);
  countriesContent = countriesContent.replace(countryCodeTypeMatch[0], newType);
  console.log(`✅ Updated CountryCode type`);
}

// Add country entry to countries object
const exampleGross = 50000; // Default example value
const countryEntry = `  ${countryCode}: {
    code: '${countryCode}',
    name: '${countryName}',
    displayName: '${countryName}',
    currency: '${countryCurrency}',
    flag: '${flag}',
    title: '${countryName} Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Calculate your net salary after taxes and social contributions in ${countryName}. Estimate your take-home pay with our free ${countryName} tax calculator for 2026.',
    taxExplanation: \`[TODO: Add 600-900 word explanation of how salary taxes work in ${countryName}. Include information about:
- Tax brackets and rates
- Social security contributions
- Deductions and allowances
- Tax withholding system
- Any country-specific tax features
- Important disclaimers about local/regional taxes]\`,
    exampleGross: ${exampleGross},
    exampleMode: 'yearly',
  },`;

// Find the closing brace of the countries object and insert before it
const countriesObjectMatch = countriesContent.match(/(export const countries: Record<CountryCode, CountryMetadata> = \{[\s\S]*?)(\};)/);
if (countriesObjectMatch) {
  const beforeClosing = countriesObjectMatch[1];
  const closing = countriesObjectMatch[2];
  countriesContent = countriesContent.replace(
    countriesObjectMatch[0],
    beforeClosing + countryEntry + '\n' + closing
  );
  console.log(`✅ Added country entry to countries.ts`);
  console.log(`   ⚠️  Please update taxExplanation with actual ${countryName} tax information`);
}

fs.writeFileSync(countriesFile, countriesContent);

// 3. Update generateStaticParams in country page
const countryPageFile = path.join(
  process.cwd(),
  'src',
  'app',
  'salary-calculator',
  '[country]',
  'page.tsx'
);
let countryPageContent = fs.readFileSync(countryPageFile, 'utf-8');

// Check if already exists
if (!countryPageContent.includes(`{ country: '${countryCode.toLowerCase()}' }`)) {
  const staticParamsMatch = countryPageContent.match(
    /(export async function generateStaticParams\(\) \{\s+return \[)([\s\S]*?)(\s+\];\s+\})/
  );

  if (staticParamsMatch) {
    const before = staticParamsMatch[1];
    const existingParams = staticParamsMatch[2];
    const after = staticParamsMatch[3];
    const newParam = `    { country: '${countryCode.toLowerCase()}' },`;
    const updatedParams = existingParams.trim() + '\n' + newParam;
    
    countryPageContent = countryPageContent.replace(
      staticParamsMatch[0],
      before + updatedParams + after
    );
    fs.writeFileSync(countryPageFile, countryPageContent);
    console.log(`✅ Added to generateStaticParams`);
  } else {
    console.log(`⚠️  Could not find generateStaticParams function`);
  }
} else {
  console.log(`⚠️  Country already in generateStaticParams`);
}

// 4. Add placeholder FAQs
const faqFile = path.join(process.cwd(), 'src', 'lib', 'seo', 'faq.ts');
let faqContent = fs.readFileSync(faqFile, 'utf-8');

// Check if FAQ function already exists
const faqFunctionName = `get${countryCode}FAQs`;
if (faqContent.includes(`function ${faqFunctionName}`)) {
  console.log(`⚠️  FAQ function ${faqFunctionName} already exists`);
} else {
  // Find the getCountryFAQs function and add case before default
  const placeholderFAQs = `/**
 * Get FAQs for ${countryName} salary calculator page
 */
export function ${faqFunctionName}(): FAQ[] {
  return [
    {
      question: 'What taxes are deducted from ${countryName} salaries?',
      answer: '[TODO: Explain the main taxes deducted in ${countryName}, such as income tax and social security contributions.]',
    },
    {
      question: 'How is income tax calculated in ${countryName}?',
      answer: '[TODO: Explain the tax bracket system, rates, and calculation method for ${countryName}.]',
    },
    {
      question: 'What are social security contributions in ${countryName}?',
      answer: '[TODO: Explain social security contributions, rates, and what they fund in ${countryName}.]',
    },
    {
      question: 'Are there any deductions or allowances in ${countryName}?',
      answer: '[TODO: Explain personal allowances, standard deductions, or other tax reductions available in ${countryName}.]',
    },
    {
      question: 'How do I calculate net income for hourly workers in ${countryName}?',
      answer: '[TODO: Explain how to use the calculator for hourly workers in ${countryName}, including any country-specific considerations.]',
    },
    {
      question: 'What is the tax withholding system in ${countryName}?',
      answer: '[TODO: Explain how taxes are withheld from paychecks in ${countryName}, including any unique features.]',
    },
    {
      question: 'Are local or regional taxes included?',
      answer: '[TODO: Explain whether local/regional taxes are included in the calculation or if they need to be considered separately.]',
    },
    {
      question: 'How accurate is the estimate for ${countryName}?',
      answer: '[TODO: Explain the accuracy of the calculator, what is included/excluded, and when users should consult a tax professional.]',
    },
  ];
}

`;

  // Insert before getCountryFAQs function
  const getCountryFAQsMatch = faqContent.match(/(\/\*\*[\s\S]*?export function getCountryFAQs)/);
  if (getCountryFAQsMatch) {
    faqContent = faqContent.replace(
      getCountryFAQsMatch[0],
      placeholderFAQs + getCountryFAQsMatch[1]
    );
    console.log(`✅ Added placeholder FAQ function`);
  }

  // Add case to getCountryFAQs switch statement
  const switchMatch = faqContent.match(/(switch \(countryCode\.toUpperCase\(\)\) \{[\s\S]*?)(\s+default:)/);
  if (switchMatch) {
    const beforeDefault = switchMatch[1];
    const defaultCase = switchMatch[2];
    const newCase = `    case '${countryCode}':\n      return ${faqFunctionName}();\n`;
    faqContent = faqContent.replace(switchMatch[0], beforeDefault + newCase + defaultCase);
    console.log(`✅ Added case to getCountryFAQs switch`);
  } else {
    console.log(`⚠️  Could not find getCountryFAQs switch statement`);
  }

  fs.writeFileSync(faqFile, faqContent);
  console.log(`   ⚠️  Please update FAQs with actual ${countryName} tax information`);
}

console.log(`\n✨ Scaffold generation complete!\n`);
console.log(`📋 Next steps:`);
console.log(`   1. Update ${taxDataFile} with actual tax brackets, rates, and allowances`);
console.log(`   2. Update taxExplanation in ${countriesFile} (600-900 words)`);
console.log(`   3. Update FAQs in ${faqFile} (8-12 questions)`);
console.log(`   4. Test the calculator at /salary-calculator/${countryCode.toLowerCase()}`);
console.log(`   5. Verify the page builds correctly: npm run build\n`);

