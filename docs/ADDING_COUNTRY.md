# Adding a New Country to the Tax Calculator

This guide explains how to add a new country to the salary tax calculator system.

## Quick Start

Use the automated scaffold generator:

```bash
npx tsx scripts/addCountry.ts <code> <name> <currency> [flag]
```

**Example:**
```bash
npx tsx scripts/addCountry.ts FR France EUR 🇫🇷
```

This will automatically:
- Create tax data template file
- Add country to `countries.ts`
- Update `generateStaticParams`
- Create placeholder FAQs

## Manual Process

If you prefer to add a country manually, follow these steps:

### 1. Create Tax Data File

Create a JSON file at:
```
src/data/tax/<country-code-lowercase>/2026.json
```

**Template structure:**
```json
{
  "metadata": {
    "countryCode": "XX",
    "countryName": "Country Name",
    "currency": "XXX",
    "year": 2026,
    "disclaimerShort": "Brief disclaimer text"
  },
  "brackets": [
    {
      "from": 0,
      "to": 10000,
      "rate": 0.1
    },
    {
      "from": 10001,
      "to": null,
      "rate": 0.2
    }
  ],
  "socialContrib": [
    {
      "name": "Social Security",
      "rate": 0.05,
      "cap": 50000
    }
  ],
  "allowances": {
    "personalAllowance": 5000,
    "standardDeduction": 3000
  },
  "roundingRules": {
    "nearestCent": true
  }
}
```

**Fields explained:**
- `brackets`: Progressive tax brackets. Use `null` for the highest bracket (no upper limit)
- `socialContrib`: Social security contributions. Include `cap` if there's an income limit
- `allowances`: Tax-free allowances. Use `personalAllowance` or `standardDeduction` (or both)
- `roundingRules`: Set `nearestCent: true` to round to 2 decimal places

### 2. Update `src/lib/countries.ts`

#### Add to CountryCode type:
```typescript
export type CountryCode = 'US' | 'DE' | 'UK' | 'XX';
```

#### Add country entry:
```typescript
export const countries: Record<CountryCode, CountryMetadata> = {
  // ... existing countries
  XX: {
    code: 'XX',
    name: 'Country Name',
    displayName: 'Country Name',
    currency: 'XXX',
    flag: '🏳️',
    title: 'Country Name Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Calculate your net salary after taxes and social contributions in Country Name...',
    taxExplanation: `[600-900 words explaining the tax system]`,
    exampleGross: 50000,
    exampleMode: 'yearly',
  },
};
```

**taxExplanation requirements:**
- 600-900 words
- Neutral, informational tone
- Explain tax brackets, rates, social contributions
- Include information about deductions/allowances
- Mention tax withholding system
- Note any local/regional tax considerations
- Emphasize these are estimates

### 3. Update `generateStaticParams`

In `src/app/salary-calculator/[country]/page.tsx`:

```typescript
export async function generateStaticParams() {
  return [
    { country: 'us' },
    { country: 'de' },
    { country: 'uk' },
    { country: 'xx' }, // Add your country (lowercase)
  ];
}
```

### 4. Add FAQs

In `src/lib/seo/faq.ts`:

#### Create FAQ function:
```typescript
export function getXXFAQs(): FAQ[] {
  return [
    {
      question: 'What taxes are deducted from Country Name salaries?',
      answer: 'Explanation of main taxes...',
    },
    // ... 8-12 FAQs total
  ];
}
```

#### Add to switch statement:
```typescript
export function getCountryFAQs(countryCode: string): FAQ[] {
  switch (countryCode.toUpperCase()) {
    case 'US':
      return getUSFAQs();
    case 'DE':
      return getGermanyFAQs();
    case 'UK':
      return getUKFAQs();
    case 'XX': // Add your country
      return getXXFAQs();
    default:
      return getHubFAQs();
  }
}
```

**FAQ requirements:**
- 8-12 questions per country
- Tailored to that country's tax system
- Include questions about hourly/monthly/yearly modes
- Avoid "financial advice" language
- Use "estimate" terminology
- Cover common user questions

### 5. Test

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Verify the page:**
   - Visit `/salary-calculator/<country-code-lowercase>`
   - Test the calculator with sample values
   - Verify tax calculations are correct
   - Check that FAQs display properly

3. **Validate tax data:**
   - Ensure brackets are correct
   - Verify social contribution rates
   - Check allowances are accurate
   - Test edge cases (very low/high income)

## Tax Data Research

### Where to find tax information:

1. **Official government sources:**
   - Tax authority websites
   - Ministry of Finance
   - Revenue/tax service websites

2. **Key information to gather:**
   - Tax brackets and rates for 2026
   - Social security contribution rates
   - Personal allowances/standard deductions
   - Any income caps for contributions
   - Local/regional tax considerations

3. **Verification:**
   - Cross-reference multiple sources
   - Check for recent updates/changes
   - Verify rates are for 2026 tax year
   - Note any special circumstances

## Content Guidelines

### Tax Explanation (600-900 words)

**Structure:**
1. Introduction to the tax system
2. Tax brackets and rates
3. Social security contributions
4. Deductions and allowances
5. Tax withholding system
6. Important disclaimers

**Tone:**
- Neutral and informational
- Avoid promotional language
- Use "estimate" and "may vary" language
- Include disclaimers about accuracy

### FAQs (8-12 questions)

**Topics to cover:**
- Main taxes deducted
- How tax is calculated
- Social security contributions
- Deductions/allowances
- Hourly/monthly/yearly calculations
- Tax withholding system
- Local/regional taxes
- Accuracy and limitations
- Country-specific features

## Common Issues

### Build Errors

**Issue:** TypeScript errors after adding country
- **Solution:** Ensure country code is added to `CountryCode` type
- **Solution:** Check all imports are correct

**Issue:** Tax data validation errors
- **Solution:** Verify JSON structure matches schema
- **Solution:** Check bracket ranges don't overlap incorrectly
- **Solution:** Ensure all required fields are present

### Calculation Errors

**Issue:** Calculations seem incorrect
- **Solution:** Verify tax brackets are correct
- **Solution:** Check social contribution rates
- **Solution:** Verify allowances are applied correctly
- **Solution:** Test with known income amounts

### Missing Content

**Issue:** Page shows but content is incomplete
- **Solution:** Verify `taxExplanation` is 600-900 words
- **Solution:** Check FAQs are added (8-12 questions)
- **Solution:** Ensure country is in `generateStaticParams`

## Testing Checklist

- [ ] Tax data file created and validated
- [ ] Country added to `countries.ts`
- [ ] Country added to `generateStaticParams`
- [ ] FAQs created (8-12 questions)
- [ ] Tax explanation written (600-900 words)
- [ ] Page builds without errors
- [ ] Calculator works with sample values
- [ ] Results match expected calculations
- [ ] FAQs display correctly
- [ ] Mobile responsive
- [ ] SEO metadata correct

## Example: Adding France

```bash
# Run scaffold generator
npx tsx scripts/addCountry.ts FR France EUR 🇫🇷

# Then manually update:
# 1. src/data/tax/fr/2026.json - Add French tax brackets
# 2. src/lib/countries.ts - Update taxExplanation
# 3. src/lib/seo/faq.ts - Update FAQs with French tax info
```

## Support

If you encounter issues:
1. Check existing country implementations (US, DE, UK) as examples
2. Review the tax calculation logic in `src/lib/tax/calc.ts`
3. Verify your JSON structure matches the schema
4. Test with simple values first before complex scenarios

## Notes

- All tax data should be for the 2026 tax year
- Keep content neutral and informational
- Always include disclaimers about estimates
- Test thoroughly before deploying
- Update documentation if tax system changes

