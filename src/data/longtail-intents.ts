/**
 * Long-tail SEO intent combinations
 * Used for programmatic page generation
 */

export interface LongTailIntent {
  intent: string; // e.g., "hourly-to-net-salary"
  countryCode: string;
  title: string;
  description: string;
  keywords: string[];
  content: string; // Markdown content (600-900 words)
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Generate long-tail page data
 * Intent × Country combinations for programmatic SEO
 */
export function generateLongTailPages(): LongTailIntent[] {
  const intents = [
    {
      intent: 'hourly-to-net-salary',
      titleTemplate: 'Hourly to Net Salary Calculator in {country}',
      descriptionTemplate: 'Convert your hourly wage to net salary in {country}. Calculate take-home pay after taxes.',
      keywords: ['hourly to net salary', 'hourly wage calculator', 'take-home pay'],
    },
    {
      intent: 'monthly-to-net-salary',
      titleTemplate: 'Monthly to Net Salary Calculator in {country}',
      descriptionTemplate: 'Calculate your net monthly income in {country}. See take-home pay after taxes.',
      keywords: ['monthly net salary', 'monthly take-home pay', 'net monthly income'],
    },
    {
      intent: 'yearly-to-net-salary',
      titleTemplate: 'Annual to Net Salary Calculator in {country}',
      descriptionTemplate: 'Calculate your net annual income in {country}. See take-home pay after taxes.',
      keywords: ['annual net salary', 'yearly take-home pay', 'net annual income'],
    },
  ];

  const countries = ['US', 'DE', 'UK'];
  const pages: LongTailIntent[] = [];

  for (const intent of intents) {
    for (const countryCode of countries) {
      const countryName = countryCode === 'US' ? 'United States' : countryCode === 'DE' ? 'Germany' : 'United Kingdom';
      
      pages.push({
        intent: `${intent.intent}-${countryCode.toLowerCase()}`,
        countryCode,
        title: intent.titleTemplate.replace('{country}', countryName),
        description: intent.descriptionTemplate.replace('{country}', countryName),
        keywords: [...intent.keywords, countryName.toLowerCase()],
        content: `# ${intent.titleTemplate.replace('{country}', countryName)}

[TODO: Generate 600-900 words of unique content for this intent × country combination.

Include:
- Introduction to the calculation
- How to use the calculator
- Country-specific tax information
- Examples and use cases
- Important considerations

Ensure content is unique and valuable, not thin or duplicate.]`,
        faqs: [
          {
            question: `How do I calculate net salary from ${intent.keywords[0]} in ${countryName}?`,
            answer: `[TODO: Provide specific answer for ${countryName} and ${intent.intent}]`,
          },
          {
            question: `What taxes are deducted in ${countryName}?`,
            answer: `[TODO: Explain ${countryName} tax system]`,
          },
        ],
      });
    }
  }

  return pages;
}

/**
 * Get all long-tail page slugs
 */
export function getAllLongTailSlugs(): string[] {
  return generateLongTailPages().map(page => `${page.intent}`);
}

/**
 * Get long-tail page by slug
 */
export function getLongTailPage(slug: string): LongTailIntent | undefined {
  return generateLongTailPages().find(page => page.intent === slug);
}

