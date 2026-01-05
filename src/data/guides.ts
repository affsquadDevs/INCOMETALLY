/**
 * Guide articles for programmatic SEO
 * Structured to support future migration to MDX/contentlayer
 */

export interface Guide {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string
  keywords: string[];
  content: string; // Markdown content (can be replaced with MDX later)
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export const guides: Guide[] = [
  {
    slug: 'how-to-calculate-net-salary',
    title: 'How to Calculate Net Salary: A Complete Guide',
    description: 'Learn how to calculate your net salary from gross income. Understand deductions, taxes, and take-home pay calculations for accurate budgeting.',
    date: '2026-01-15',
    keywords: ['net salary', 'take-home pay', 'salary calculation', 'gross vs net', 'tax deductions'],
    content: `# How to Calculate Net Salary: A Complete Guide

Calculating your net salary is essential for understanding your actual take-home pay. This guide explains the process step by step.

## Understanding Gross vs Net Salary

**Gross salary** is your total earnings before any deductions. This is the amount agreed upon in your employment contract.

**Net salary** (also called take-home pay) is what you receive after all deductions, including:
- Income tax
- Social security contributions
- Health insurance
- Other mandatory deductions

## Step-by-Step Calculation

### Step 1: Determine Your Gross Income

Start with your gross annual, monthly, or hourly income. This is your starting point.

### Step 2: Calculate Taxable Income

Subtract any allowances or deductions from your gross income:
- Standard deduction or personal allowance
- Pre-tax contributions (401k, health insurance premiums)

### Step 3: Apply Income Tax

Calculate income tax based on progressive tax brackets. Different portions of your income are taxed at different rates.

### Step 4: Subtract Social Security Contributions

Deduct social security contributions, which vary by country:
- **US**: Social Security (6.2%) and Medicare (1.45%)
- **Germany**: Health, pension, unemployment, and long-term care insurance
- **UK**: National Insurance contributions

### Step 5: Calculate Net Income

Net Income = Gross Income - Income Tax - Social Security Contributions

## Using Our Calculator

Our salary calculator automates this process. Simply enter your gross income, select your country, and get an instant estimate of your net income.

## Important Notes

- These calculations are estimates based on standard scenarios
- Actual take-home pay may vary based on individual circumstances
- Consult a tax professional for personalized advice`,
    faqs: [
      {
        question: 'What is the difference between gross and net salary?',
        answer: 'Gross salary is your total earnings before deductions. Net salary is your take-home pay after income tax, social security, and other mandatory deductions are subtracted.',
      },
      {
        question: 'How accurate are net salary calculations?',
        answer: 'Our calculations are estimates based on standard tax rates and brackets. Actual take-home pay may vary based on individual circumstances, deductions, credits, and local taxes.',
      },
      {
        question: 'Can I calculate net salary for different income modes?',
        answer: 'Yes, you can calculate net salary from hourly, monthly, or yearly gross income. The calculator will annualize your income and apply the appropriate tax calculations.',
      },
    ],
  },
  {
    slug: 'understanding-tax-brackets',
    title: 'Understanding Tax Brackets: How Progressive Taxation Works',
    description: 'Learn how progressive tax brackets work and how they affect your take-home pay. Understand marginal vs effective tax rates.',
    date: '2026-01-14',
    keywords: ['tax brackets', 'progressive tax', 'marginal tax rate', 'effective tax rate', 'income tax'],
    content: `# Understanding Tax Brackets: How Progressive Taxation Works

Tax brackets are a fundamental part of income tax systems in most countries. This guide explains how they work.

## What Are Tax Brackets?

Tax brackets are income ranges that are taxed at different rates. As your income increases, different portions are taxed at progressively higher rates.

## How Progressive Taxation Works

In a progressive tax system:
- Lower income is taxed at lower rates
- Higher income is taxed at higher rates
- Only the income within each bracket is taxed at that bracket's rate

## Example Calculation

If you earn $75,000 and the brackets are:
- 10% on income up to $10,000
- 20% on income from $10,001 to $40,000
- 30% on income above $40,000

Your tax would be:
- $10,000 × 10% = $1,000
- $30,000 × 20% = $6,000
- $35,000 × 30% = $10,500
- Total: $17,500

## Marginal vs Effective Tax Rate

**Marginal tax rate** is the rate on your highest income bracket (30% in the example above).

**Effective tax rate** is your total tax divided by total income ($17,500 ÷ $75,000 = 23.3% in the example).

## Country-Specific Information

Tax brackets vary by country:
- **US**: 7 federal brackets from 10% to 37%
- **Germany**: Progressive rates from 14% to 45%
- **UK**: Basic rate (20%), higher rate (40%), additional rate (45%)

Use our country-specific calculators to see how brackets apply to your income.`,
    faqs: [
      {
        question: 'What is a marginal tax rate?',
        answer: 'Your marginal tax rate is the rate applied to your highest income bracket. It represents the tax rate on your next dollar of income.',
      },
      {
        question: 'What is an effective tax rate?',
        answer: 'Your effective tax rate is the percentage of your total income paid in taxes. It\'s calculated as total tax divided by total income and is typically lower than your marginal rate.',
      },
      {
        question: 'Do I pay the highest tax rate on all my income?',
        answer: 'No. In progressive tax systems, only income within each bracket is taxed at that bracket\'s rate. Lower portions of your income are taxed at lower rates.',
      },
    ],
  },
  {
    slug: 'hourly-to-salary-conversion',
    title: 'Hourly to Salary Conversion: Complete Guide',
    description: 'Convert hourly wages to annual, monthly, and weekly salary. Learn the formulas and use our free calculator.',
    date: '2026-01-13',
    keywords: ['hourly to salary', 'wage conversion', 'hourly rate', 'annual salary', 'salary calculator'],
    content: `# Hourly to Salary Conversion: Complete Guide

Converting hourly wages to salary helps you understand your total compensation and compare job offers.

## Basic Conversion Formulas

### Annual Salary from Hourly Rate

\`\`\`
Annual Salary = Hourly Rate × Hours per Week × Weeks per Year
\`\`\`

**Standard calculation**: $25/hour × 40 hours/week × 52 weeks/year = $52,000/year

### Monthly Salary

\`\`\`
Monthly Salary = Annual Salary ÷ 12
\`\`\`

**Example**: $52,000 ÷ 12 = $4,333.33/month

### Weekly Salary

\`\`\`
Weekly Salary = Hourly Rate × Hours per Week
\`\`\`

**Example**: $25/hour × 40 hours = $1,000/week

## Adjusting for Part-Time Work

For part-time or irregular schedules, adjust the calculation:

**Example**: $30/hour × 35 hours/week × 50 weeks/year = $52,500/year

This accounts for:
- Fewer hours per week
- Unpaid time off or vacation

## Factors to Consider

### Hours per Week
- Full-time: Typically 40 hours
- Part-time: Varies (often 20-30 hours)
- Overtime: May need separate calculation

### Weeks per Year
- Standard: 52 weeks
- With vacation: 50-51 weeks (unpaid time off)
- Seasonal work: Varies by industry

### Overtime Considerations

If you regularly work overtime:
1. Calculate base salary separately
2. Add estimated overtime earnings
3. Or use an average hourly rate that includes overtime

## Using Our Calculator

Our hourly to salary converter automates these calculations and shows both gross and net income after taxes.`,
    faqs: [
      {
        question: 'How do I convert hourly rate to annual salary?',
        answer: 'Multiply your hourly rate by hours per week, then by weeks per year. Standard calculation: Hourly Rate × 40 × 52 = Annual Salary.',
      },
      {
        question: 'Should I include overtime in my hourly rate?',
        answer: 'For accurate base salary, use your base hourly rate. If you regularly work overtime, calculate it separately or use an average rate that accounts for overtime.',
      },
      {
        question: 'How many weeks should I use in the calculation?',
        answer: 'Use 52 weeks for full-time employees. Adjust to 50-51 weeks if you have unpaid vacation, or fewer weeks for seasonal work.',
      },
    ],
  },
  {
    slug: 'tax-deductions-explained',
    title: 'Tax Deductions Explained: What Reduces Your Taxable Income',
    description: 'Understand tax deductions, allowances, and how they reduce your taxable income. Learn about standard vs itemized deductions.',
    date: '2026-01-12',
    keywords: ['tax deductions', 'standard deduction', 'taxable income', 'allowances', 'tax savings'],
    content: `# Tax Deductions Explained: What Reduces Your Taxable Income

Tax deductions reduce your taxable income, which can lower your tax liability. This guide explains how they work.

## What Are Tax Deductions?

Tax deductions are expenses or allowances that reduce your taxable income. Lower taxable income means lower taxes.

## Types of Deductions

### Standard Deduction

A fixed amount that reduces taxable income without needing to itemize expenses. Available to all taxpayers.

**Benefits**:
- Simple to claim
- No documentation required
- Guaranteed tax reduction

### Itemized Deductions

Specific expenses you can deduct if they exceed the standard deduction amount.

**Common itemized deductions**:
- Mortgage interest
- State and local taxes
- Charitable contributions
- Medical expenses (above threshold)
- Property taxes

## How Deductions Work

**Example**:
- Gross Income: $75,000
- Standard Deduction: $14,600
- Taxable Income: $75,000 - $14,600 = $60,400

You pay taxes on $60,400, not $75,000.

## Country-Specific Information

### United States
- Standard deduction varies by filing status
- Can choose standard or itemized (whichever is higher)
- Many deductions phased out for high earners

### Germany
- Personal allowance (Grundfreibetrag) for all taxpayers
- Additional deductions for children, special expenses
- Tax class affects withholding, not final liability

### United Kingdom
- Personal allowance for all taxpayers
- Marriage allowance for eligible couples
- Pension contributions receive tax relief

## Maximizing Your Deductions

1. **Know your options**: Understand standard vs itemized
2. **Track expenses**: Keep records of deductible expenses
3. **Time expenses**: Consider timing of deductible payments
4. **Consult professionals**: Tax advisors can identify additional deductions

## Important Notes

- Deductions reduce taxable income, not tax directly
- Tax credits (different from deductions) reduce tax dollar-for-dollar
- Rules vary by country and change annually
- Consult a tax professional for personalized advice`,
    faqs: [
      {
        question: 'What is the difference between a deduction and a credit?',
        answer: 'A deduction reduces your taxable income, while a credit reduces your tax liability directly. Credits are generally more valuable than deductions.',
      },
      {
        question: 'Should I take the standard deduction or itemize?',
        answer: 'Take whichever is higher. If your itemized deductions exceed the standard deduction, itemize. Otherwise, take the standard deduction.',
      },
      {
        question: 'Do deductions apply to all countries?',
        answer: 'Yes, but the specific deductions and allowances vary by country. Each country has its own system of reducing taxable income.',
      },
    ],
  },
  {
    slug: 'social-security-contributions-guide',
    title: 'Social Security Contributions: What You Need to Know',
    description: 'Understand social security contributions in different countries. Learn how they affect your take-home pay and what benefits they provide.',
    date: '2026-01-11',
    keywords: ['social security', 'social contributions', 'FICA', 'National Insurance', 'pension contributions'],
    content: `# Social Security Contributions: What You Need to Know

Social security contributions fund state benefits like pensions, healthcare, and unemployment insurance. This guide explains how they work.

## What Are Social Security Contributions?

Social security contributions are mandatory payments that fund state benefits. They're separate from income tax and typically split between employer and employee.

## United States: FICA Taxes

### Social Security Tax
- Rate: 6.2% of wages
- Cap: Applies only up to the Social Security wage base
- Purpose: Funds retirement and disability benefits

### Medicare Tax
- Rate: 1.45% of all wages (no cap)
- Additional: 0.9% surtax for high earners
- Purpose: Funds healthcare for seniors

**Total FICA**: 7.65% for most employees (6.2% + 1.45%)

## Germany: Social Security System

### Components
1. **Health Insurance** (Krankenversicherung)
   - Mandatory for employees below income threshold
   - Shared 50/50 with employer

2. **Pension Insurance** (Rentenversicherung)
   - Funds state pension system
   - Shared 50/50 with employer

3. **Unemployment Insurance** (Arbeitslosenversicherung)
   - Provides unemployment benefits
   - Shared 50/50 with employer

4. **Long-Term Care Insurance** (Pflegeversicherung)
   - Covers nursing and care services
   - Shared 50/50 with employer

## United Kingdom: National Insurance

### Class 1 Contributions (Employees)
- Calculated per pay period (weekly/monthly)
- Main rate between primary threshold and upper earnings limit
- Reduced rate above upper limit
- Funds: State pension, NHS, unemployment benefits

## How Contributions Affect Take-Home Pay

Social security contributions directly reduce your net income:

**Example (US)**:
- Gross: $75,000
- FICA (7.65%): -$5,737.50
- Net before income tax: $69,262.50

## Benefits Provided

Contributions fund:
- Retirement pensions
- Healthcare systems
- Unemployment benefits
- Disability benefits
- Long-term care (in some countries)

## Important Notes

- Contributions are mandatory for employees
- Rates and thresholds change annually
- Employer typically matches employee contributions
- Benefits eligibility depends on contribution history
- Self-employed individuals pay higher rates`,
    faqs: [
      {
        question: 'Are social security contributions the same as income tax?',
        answer: 'No. Social security contributions are separate from income tax and fund specific state benefits like pensions and healthcare. They\'re calculated differently and have different rates.',
      },
      {
        question: 'Do I get the money back from social security contributions?',
        answer: 'Not directly. Contributions fund state benefits you may receive later, such as retirement pensions, healthcare, and unemployment benefits. Eligibility depends on your contribution history.',
      },
      {
        question: 'How much do social security contributions reduce my take-home pay?',
        answer: 'It varies by country. In the US, FICA taxes are 7.65% of wages (up to Social Security cap). In Germany and the UK, rates vary by income and are typically shared with employers.',
      },
    ],
  },
  {
    slug: 'salary-negotiation-tips',
    title: 'Salary Negotiation Tips: Using Net Income Calculations',
    description: 'Learn how to use net salary calculations in salary negotiations. Understand your true take-home pay before accepting an offer.',
    date: '2026-01-10',
    keywords: ['salary negotiation', 'net income', 'job offer', 'compensation', 'take-home pay'],
    content: `# Salary Negotiation Tips: Using Net Income Calculations

Understanding your net income is crucial for effective salary negotiations. This guide shows you how to use calculations to your advantage.

## Why Net Income Matters

Gross salary numbers can be misleading. A $5,000 difference in gross salary might only be $3,500 in net income after taxes.

## Before Negotiating

### 1. Calculate Your Current Net Income

Use our calculator to determine your current take-home pay. This is your baseline.

### 2. Calculate Net Income for the Offer

Enter the offered gross salary to see your actual take-home pay. Compare this to your current situation.

### 3. Consider All Factors

- Tax differences between locations
- Cost of living adjustments
- Benefits value (health insurance, retirement)
- Commuting costs
- Work-life balance

## Negotiation Strategies

### Use Net Income in Discussions

Instead of: "I need $10,000 more"
Say: "After taxes, this offer would give me $X in take-home pay, which is $Y less than my current situation"

### Account for Tax Differences

Moving to a different state or country can significantly affect net income:
- High-tax states reduce net pay
- Some states have no income tax
- International moves have different tax systems

### Factor in Benefits

Benefits can be worth thousands:
- Health insurance premiums
- Retirement contributions
- Paid time off
- Professional development

## Common Mistakes to Avoid

1. **Focusing only on gross salary**
   - Always calculate net income

2. **Ignoring location differences**
   - Same gross salary ≠ same net income in different locations

3. **Not considering total compensation**
   - Benefits and perks have real value

4. **Accepting the first offer**
   - Most employers expect negotiation

## Using Our Tools

Our calculators help you:
- Compare gross vs net income
- Understand tax implications
- Make informed decisions
- Negotiate from a position of knowledge

## After Negotiation

Once you've agreed on terms:
1. Verify the offer in writing
2. Confirm all benefits and perks
3. Understand your first paycheck will differ (prorated, different deductions)
4. Plan your budget based on net income

Remember: Knowledge is power in negotiations. Understanding your true take-home pay helps you make better decisions.`,
    faqs: [
      {
        question: 'Should I negotiate based on gross or net salary?',
        answer: 'Consider both, but focus on net income for your actual financial situation. Gross salary is what employers discuss, but net income is what you actually receive.',
      },
      {
        question: 'How do I account for tax differences when negotiating?',
        answer: 'Use our calculators to compare net income in different locations. Factor in state/local taxes, cost of living, and other location-specific costs.',
      },
      {
        question: 'What if the employer won\'t increase the gross salary?',
        answer: 'Consider negotiating other benefits: additional vacation time, flexible work arrangements, professional development opportunities, or signing bonuses that may have different tax implications.',
      },
    ],
  },
];

/**
 * Get all guides
 */
export function getAllGuides(): Guide[] {
  return guides;
}

/**
 * Get guide by slug
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(guide => guide.slug === slug);
}

/**
 * Get all guide slugs for static generation
 */
export function getAllGuideSlugs(): string[] {
  return guides.map(guide => guide.slug);
}

