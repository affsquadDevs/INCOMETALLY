/**
 * Guide articles for programmatic SEO
 * Structured to support future migration to MDX/contentlayer
 */

export interface GuideSource {
  label: string;
  url: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string (published)
  updated?: string; // ISO date string (last reviewed/updated)
  authorId?: string; // references src/data/authors.ts (defaults to editorial team)
  pillar: string; // references src/data/pillars.ts
  isPillar?: boolean; // true for the cornerstone article of a pillar
  keywords: string[];
  content: string; // Markdown content (can be replaced with MDX later)
  sources?: GuideSource[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export const guides: Guide[] = [
  {
    slug: 'how-to-calculate-net-salary',
    pillar: 'income-basics',
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
    pillar: 'income-tax',
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
    pillar: 'income-basics',
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
    pillar: 'income-tax',
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
    pillar: 'income-tax',
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
    pillar: 'salary-career',
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
  {
    slug: 'gross-income-vs-net-income',
    pillar: 'income-basics',
    isPillar: true,
    title: `Gross Income vs Net Income: What's the Difference?`,
    description: `Understand the difference between gross income and net income, why your take-home pay is lower than your salary, and how taxes shape what you earn.`,
    date: '2026-06-05',
    updated: '2026-06-20',
    keywords: ['gross income', 'net income', 'gross vs net', 'take-home pay', 'income tax', 'deductions'],
    content: `Income is one of the most common financial terms — and one of the most misunderstood. Many people assume that their salary, hourly wage, or contract rate is what they actually earn. In reality, the amount that reaches your bank account is usually very different from the number written in your contract.

This guide explains what income is, the difference between gross income and net income, and why understanding that difference is essential when comparing jobs, planning expenses, or estimating taxes.

## What Is Income?

Income is the money you earn in exchange for work, services, or business activity over a specific period of time. It can be received hourly, weekly, monthly, or yearly, and it can come from:

- employment salary or wages
- freelance or contract work
- self-employment or business activity
- bonuses, commissions, or allowances

However, not all income is treated the same once taxes and mandatory contributions are applied.

## What Is Gross Income?

Gross income is the total amount you earn before any deductions are applied. It is the number you usually see in job offers, on employment contracts, on freelancer invoices, and in annual salary discussions.

Gross income does not reflect what you actually take home. For example:

- Gross yearly salary: 60,000
- Gross monthly salary: 5,000

At this stage, no taxes or contributions have been removed yet.

## What Is Net Income?

Net income — also called take-home pay — is the amount you actually receive after deductions. Those deductions usually include income tax, social security contributions, health insurance, and local or regional taxes depending on the country.

Net income is the money you can actually spend, save, or invest. For example:

- Gross monthly income: 5,000
- Total deductions: 1,600
- Net monthly income: 3,400

For a deeper look at the take-home figure itself, see our guide on [take-home pay](/guides/what-is-take-home-pay).

## Gross vs Net Income: Side by Side

| | Gross income | Net income |
|---|---|---|
| What it means | Earnings before taxes and deductions | Money received after deductions |
| Where you see it | Contracts, job offers, comparisons | Your bank account and budget |
| Best used for | Comparing roles and headline pay | Living expenses, savings, planning |

This difference explains why two people with the same gross salary can have very different take-home pay.

## Why Gross Income Is Often Misleading

Gross income is useful for standard comparisons, but it can be misleading because tax rates differ by country, social contributions vary, filing status matters, and benefits and deductions change the outcome. That is why net income is the more practical number for real-life decisions.

## How Taxes Affect Your Income

Taxes are the main reason gross income and net income differ. Most tax systems apply progressive tax brackets (higher income is taxed at higher rates), mandatory social contributions, and fixed or capped deductions. Because of this, increasing your gross income does not always raise your net income by the same percentage. Our guide on [how income tax works](/guides/how-income-tax-works) explains this in plain English.

## How to Calculate Gross and Net Income

You can calculate income manually, but it quickly becomes complex once taxes are involved. A simpler approach is to:

1. Start with your gross income.
2. Apply country-specific tax rules.
3. Subtract contributions and deductions.
4. Arrive at your net income.

This is exactly what the IncomeTally [salary calculator](/salary-calculator) is designed to do — estimate income across different pay periods and countries using transparent assumptions. If you are paid by the hour or want to switch between pay periods, see [how to convert hourly, monthly and yearly income](/guides/how-to-convert-income-pay-periods).

## Why Understanding Income Matters

Knowing the difference between gross and net income helps you compare job offers accurately, avoid salary disappointment, plan your monthly budget, understand your real purchasing power, and estimate taxes more realistically. It is especially important for freelancers, remote workers, and people relocating between countries.

## Final Thoughts

Income is more than a number on a contract. Understanding gross income versus net income gives you a clearer picture of what you truly earn and what you can realistically afford. Before making financial decisions, always look beyond the headline salary and focus on take-home pay. Rates and rules change over time and vary by country, so treat estimates as a guide and consult a qualified professional when it matters.`,
    sources: [
      { label: `GOV.UK — Income Tax`, url: 'https://www.gov.uk/income-tax' },
      { label: `IRS — Tax Topic 751 (Social Security and Medicare withholding)`, url: 'https://www.irs.gov/taxtopics/tc751' },
      { label: `GOV.UK — National Insurance`, url: 'https://www.gov.uk/national-insurance' },
    ],
    faqs: [
      {
        question: `What is the difference between gross and net income?`,
        answer: `Gross income is your earnings before deductions. Net income is what you actually receive after taxes and contributions are subtracted.`,
      },
      {
        question: `Why is my net income much lower than my gross salary?`,
        answer: `Taxes, social security, and other mandatory contributions reduce gross income — sometimes significantly, depending on your country and income level.`,
      },
      {
        question: `Which income should I use for budgeting?`,
        answer: `Net income, because it reflects the money you actually have available to spend, save, or invest.`,
      },
      {
        question: `Is net income the same in every country?`,
        answer: `No. Tax systems differ widely, which is why net income varies even for the same gross salary.`,
      },
    ],
  },
  {
    slug: 'how-to-convert-income-pay-periods',
    pillar: 'income-basics',
    title: `How to Convert Hourly, Monthly & Yearly Income Correctly`,
    description: `Learn how to convert hourly, weekly, monthly, and yearly income correctly — the standard formulas, the assumptions behind them, and the mistakes to avoid.`,
    date: '2026-06-06',
    updated: '2026-06-20',
    keywords: ['income conversion', 'hourly to salary', 'monthly to yearly income', 'pay period', 'annual salary', 'gross income'],
    content: `Income comes in several forms — hourly, weekly, monthly, and yearly — and at some point you will need to convert between them. Maybe you are comparing an hourly contract with a salaried offer, or working out what a monthly wage adds up to over a year. The math looks simple, but a few common assumptions can throw your numbers off.

This guide explains the standard formulas, the assumptions behind them, and the mistakes to avoid.

## Common Income Pay Periods

Income is usually quoted in one of four ways:

- Hourly: an amount per hour worked, common for part-time, shift, and contract work.
- Weekly: a total paid each week, often for temporary roles.
- Monthly: common for salaried employees.
- Yearly: used in contracts and job offers.

## Why Income Conversion Is Not Always Straightforward

The assumption that hourly rate times hours times weeks equals salary oversimplifies things. In practice:

- working hours fluctuate
- paid and unpaid time differ
- holidays and sick leave vary
- freelancers have inconsistent schedules
- conventions differ between countries

## Standard Assumptions Used in Conversion

Unless stated otherwise, most calculators assume:

- 40 working hours per week
- 5 working days per week
- 52 weeks per year
- 12 months per year

These assumptions make conversions consistent, but your real situation may differ.

## How to Convert Hourly Income to Yearly Salary

Multiply your hourly rate by hours per week, then by weeks per year:

- Hourly rate x hours per week x weeks per year = yearly salary
- Example: 25 per hour x 40 hours x 52 weeks = 52,000 per year

For a ready-made tool, use our [hourly to salary converter](/hourly-to-salary), and for more worked examples see the [hourly to salary conversion guide](/guides/hourly-to-salary-conversion).

## How to Convert Monthly Income to Yearly Salary

Multiply your monthly income by 12:

- Monthly income x 12 = yearly income
- Example: 4,000 per month x 12 = 48,000 per year

This assumes consistent monthly payments with no extra or missing months.

## Weekly to Monthly and Yearly Conversions

Weekly pay, often used for temporary work, converts like this:

- Weekly x 52 = yearly
- Yearly divided by 12 = monthly
- Example: 1,000 per week = 52,000 per year, or about 4,333 per month

## Hourly vs Salary: Which Is Better?

Neither format is universally better. Hourly work suits flexible arrangements and can reward extra hours, while a salary provides stability and predictable pay. The right choice depends on your priorities.

## Common Income Conversion Mistakes

- overlooking unpaid holidays
- assuming exactly 52 working weeks for everyone
- ignoring part-time schedules
- confusing gross hourly pay with net salary
- leaving out taxes entirely

That last point matters most: a conversion gives you a gross figure, not your [take-home pay](/guides/what-is-take-home-pay).

## How to Compare Job Offers With Different Pay Periods

Convert every offer to yearly gross income using identical assumptions, then estimate net income where you can, and finally weigh benefits and job stability. Our guide on [how to compare job offers](/guides/how-to-compare-job-offers) walks through the full process.

## When to Focus on Net Income Instead

Gross conversions are useful, but net income matters more for real life. Tax systems, employment classification, and location all influence your actual take-home pay. To see the gap clearly, read [gross income vs net income](/guides/gross-income-vs-net-income), then run your numbers through the [salary calculator](/salary-calculator).

## Final Thoughts

Income conversion is more than arithmetic. Working hours, unpaid periods, and scheduling differences all change the final figure, and taxes change it again. Use standard assumptions as a starting point, adjust them to your situation, and always check net pay before making a decision.`,
    sources: [
      { label: `GOV.UK — Income Tax`, url: 'https://www.gov.uk/income-tax' },
      { label: `U.S. Bureau of Labor Statistics — Occupational Employment and Wage Statistics`, url: 'https://www.bls.gov/oes/' },
    ],
    faqs: [
      {
        question: `What hours should I assume when converting pay?`,
        answer: `Most calculators assume 40 hours per week, 52 weeks per year, and 12 months per year. Adjust these to match your actual schedule, especially for part-time or seasonal work.`,
      },
      {
        question: `Is hourly or salaried pay better?`,
        answer: `Neither is universally better. Hourly work offers flexibility and can reward extra hours; salaried work offers stability, predictable pay, and often more benefits.`,
      },
      {
        question: `Can I convert income without knowing my taxes?`,
        answer: `Yes, for a gross estimate. But to know your real take-home pay, you need to account for income tax and social contributions, which vary by country.`,
      },
      {
        question: `Why does my monthly pay times 12 not match my annual figure?`,
        answer: `Differences come from varying working hours, unpaid time, bonuses, and the assumptions used. Irregular schedules and one-off payments can make the simple formula imprecise.`,
      },
    ],
  },
  {
    slug: 'what-is-take-home-pay',
    pillar: 'income-basics',
    title: `What Is Take-Home Pay and How Is It Calculated?`,
    description: `Learn what take-home pay is, how it is calculated from your gross salary, what gets deducted, and see simple examples for the US, UK, and Germany.`,
    date: '2026-06-12',
    updated: '2026-06-20',
    keywords: ['take-home pay', 'net pay', 'how to calculate net salary', 'gross vs net pay', 'income tax deductions', 'payroll deductions'],
    content: `Take-home pay is the money that actually lands in your bank account after every deduction has been subtracted from your salary. It is the number that matters most for budgeting, yet it is almost always smaller than the figure on your job offer. Understanding how it is calculated helps you plan, compare jobs fairly, and avoid nasty surprises on payday.

## Gross Pay vs Take-Home Pay

Your gross pay is your full salary before anything is removed. Take-home pay (often called net pay) is what remains after taxes and other withholdings. The gap between the two can be substantial. If you want a deeper breakdown of these two figures, see our guide on [gross vs net income](/guides/gross-income-vs-net-income).

Here is the basic flow:

- Start with gross pay (your stated salary or hourly earnings)
- Subtract income tax
- Subtract social insurance contributions
- Subtract any other deductions (pension, health plans, student loan repayments)
- What is left is your take-home pay

## What Gets Deducted

The exact deductions depend on where you live and work, but most fall into a few categories.

### Income Tax

Income tax is usually the largest single deduction. Most countries use a progressive system, meaning higher portions of your income are taxed at higher rates. To see how the brackets stack up, read [how income tax works](/guides/how-income-tax-works).

### Social Insurance Contributions

These fund public programs such as pensions, healthcare, and unemployment support. In the US they are Social Security and Medicare, in the UK they are National Insurance, and in Germany they cover pension, health, long-term care, and unemployment insurance. Our [social security contributions](/guides/social-security-contributions-guide) guide explains each system.

### Other Deductions

Depending on your situation, you might also see workplace pension contributions, private health premiums, union dues, or student loan repayments.

## A Simple Example

Imagine an annual gross salary of 50,000 in three countries. The numbers below are illustrative only and rounded for clarity.

| Country | Gross | Income Tax | Social Contributions | Take-Home (approx.) |
|---|---|---|---|---|
| US | 50,000 USD | 4,300 USD | 3,825 USD | 41,875 USD |
| UK | 50,000 GBP | 7,486 GBP | 2,494 GBP | 40,020 GBP |
| Germany | 50,000 EUR | 8,200 EUR | 10,000 EUR | 31,800 EUR |

As you can see, two people earning the same headline figure can take home very different amounts. State, regional, or local taxes can change these results further.

## Calculating It Yourself

The simplest manual method is:

1. Find your annual gross pay.
2. Estimate income tax using your country's brackets and personal allowance.
3. Add up social insurance contributions.
4. Subtract both from gross pay.
5. Divide by 12 for a monthly figure, or by your number of pay periods.

Because brackets, thresholds, and rates change every tax year, doing this by hand is fiddly and easy to get wrong. A tool keeps it accurate. Try our [net salary calculator](/net-salary-calculator) or the full [salary calculator](/calculator) to get a tailored estimate in seconds.

## Why Take-Home Pay Matters

- Budgeting: rent, bills, and savings come from net pay, not gross.
- Job comparisons: a higher salary in a high-tax setup may leave you with less.
- Negotiation: knowing your net figure helps you assess raises and benefits.

## Final Thoughts

Take-home pay is your true spendable income, shaped by income tax, social contributions, and personal deductions. The headline salary is only the starting point. Since rates and thresholds shift annually and vary by location, use these figures as a guide and consult a qualified tax professional for decisions that affect your finances.`,
    sources: [
      { label: `IRS — Tax Topic 751 (Social Security and Medicare withholding)`, url: 'https://www.irs.gov/taxtopics/tc751' },
      { label: `GOV.UK — National Insurance`, url: 'https://www.gov.uk/national-insurance' },
      { label: `GOV.UK — Income Tax rates and allowances`, url: 'https://www.gov.uk/income-tax-rates' },
    ],
    faqs: [
      {
        question: `Is take-home pay the same as net pay?`,
        answer: `Yes. Take-home pay and net pay both refer to the amount left after all taxes and deductions are removed from your gross salary. It is the money that actually reaches your bank account.`,
      },
      {
        question: `Why is my take-home pay lower than I expected?`,
        answer: `Common reasons include income tax, social insurance contributions, pension enrollment, student loan repayments, and benefit premiums. Local or regional taxes and a higher tax bracket can also reduce it more than you anticipated.`,
      },
      {
        question: `Does take-home pay change during the year?`,
        answer: `It can. Reaching certain earnings thresholds, changing tax codes, one-off bonuses, or adjustments to pension and benefit contributions can all shift your net pay from one pay period to the next.`,
      },
      {
        question: `Can I increase my take-home pay?`,
        answer: `Sometimes. Tax-advantaged pension contributions, claiming eligible allowances, and ensuring your tax code or withholding is correct may help. A tax professional can advise on what applies to your situation.`,
      },
    ],
  },
  {
    slug: 'how-to-read-your-payslip',
    pillar: 'income-basics',
    title: `How to Read Your Payslip (Paycheck) Line by Line`,
    description: `Learn how to read your payslip or paycheck line by line. Understand gross pay, taxes, deductions, and net pay across the US, UK, and Germany.`,
    date: '2026-06-13',
    updated: '2026-06-20',
    keywords: ['how to read a payslip', 'payslip explained', 'paycheck breakdown', 'gross vs net pay', 'payslip deductions', 'pay stub guide'],
    content: `Opening your first payslip can feel like reading a foreign language. Acronyms, deductions, and two different totals for the same month leave many people confused. This guide walks through the common parts of a payslip or paycheck, explains what each line means, and points out how the terms differ across the US, the UK, and Germany.

Note that exact tax rates and contribution thresholds change every year and vary by personal situation. Always confirm details with your employer or a qualified professional.

## The Two Numbers That Matter Most

Every payslip revolves around two figures: gross pay and net pay.

- Gross pay is your total earnings before anything is taken out.
- Net pay is what actually lands in your bank account, also called your [take-home pay](/guides/what-is-take-home-pay).

The gap between them is made up of taxes, social or insurance contributions, and any other deductions. Understanding that gap is the whole point of reading your payslip closely.

## Common Components, Line by Line

While layouts differ between countries and employers, most payslips include the same building blocks.

### Earnings

This section lists your base salary or hourly wages, plus any extras such as overtime, bonuses, commission, or tip income. Add these together and you get your gross pay for the period.

### Taxes Withheld

Your employer typically removes income tax before paying you. In the US this includes federal income tax and, in most states, state income tax. In the UK it is PAYE income tax. In Germany it is Lohnsteuer, sometimes with a church tax and a solidarity surcharge.

### Social and Insurance Contributions

These fund pensions, healthcare, and other public programs. They are often mandatory and split between you and your employer. See our guide to [social security contributions](/guides/social-security-contributions-guide) for more detail.

### Pre-Tax and Post-Tax Deductions

Some amounts are subtracted before tax is calculated, which can lower your taxable income. Common examples are retirement plan contributions and certain health or commuter benefits. Learn more in our overview of [tax deductions](/guides/tax-deductions-explained). Other deductions, such as union dues, may come out after tax.

### Net Pay

After every deduction, what remains is your net pay. This is the number to compare against your budget.

### Year-to-Date Totals

Most payslips show running totals, labeled YTD in the US, for the calendar or tax year so far. These help you track total earnings and total tax paid, which is useful at filing time.

## A Sample Breakdown

Here is a simplified monthly example for an employee earning 5,000 in their local currency. Figures are illustrative only.

| Line item | Amount |
|---|---|
| Gross pay | 5,000 |
| Pre-tax retirement contribution | -300 |
| Income tax | -750 |
| Social or insurance contributions | -450 |
| Post-tax deduction (union dues) | -25 |
| Net pay | 3,475 |

In this example the worker earns 5,000 gross but takes home 3,475. The roughly 1,525 difference is exactly what payslip literacy helps you understand.

## Country Terminology at a Glance

The structure is similar everywhere, but the names change.

- United States: often called a pay stub or paycheck. Watch for FICA, which covers Social Security and Medicare, plus federal and state withholding.
- United Kingdom: called a payslip. Look for PAYE income tax and National Insurance contributions, along with your tax code.
- Germany: called a Lohnabrechnung or Gehaltsabrechnung. Expect Lohnsteuer plus social contributions for pension, health, unemployment, and long-term care insurance.

## Tips for Checking Your Payslip

A quick monthly review can catch costly errors.

- Confirm your gross pay matches your agreed salary or hours.
- Check that your tax code or filing details look correct.
- Watch for sudden changes in deductions month to month.
- Keep payslips for tax filing, loan applications, and rental references.

To see how gross converts to net for your own situation, try our free [net salary calculator](/net-salary-calculator).

## Final Thoughts

A payslip is more than a receipt. It is a record of your earnings, the taxes you contribute, and the benefits you fund. Once you recognize the core sections of gross pay, deductions, and net pay, the document stops looking intimidating in any country. Review yours regularly, keep copies, and reach out to a professional whenever something does not add up.`,
    sources: [
      { label: `GOV.UK — Understanding your pay`, url: 'https://www.gov.uk/understanding-your-pay' },
      { label: `IRS — Tax withholding`, url: 'https://www.irs.gov/individuals/employees/tax-withholding' },
      { label: `SSA — Social Security & Medicare tax rates`, url: 'https://www.ssa.gov/oact/cola/cbb.html' },
    ],
    faqs: [
      {
        question: `Why is my net pay so much lower than my gross pay?`,
        answer: `The difference comes from income tax, mandatory social or insurance contributions, and any voluntary deductions like retirement savings. The exact split depends on your country, income level, and personal circumstances.`,
      },
      {
        question: `What does year-to-date (YTD) mean on a payslip?`,
        answer: `Year-to-date totals show your cumulative earnings and deductions from the start of the calendar or tax year up to the current pay period. They help you track totals for budgeting and tax filing.`,
      },
      {
        question: `Are payslips the same in the US, UK, and Germany?`,
        answer: `The core structure is similar, but the terminology differs. The US calls it a pay stub, the UK a payslip, and Germany a Lohnabrechnung. Each country also has its own tax labels and contribution systems.`,
      },
      {
        question: `What should I do if I spot a mistake on my payslip?`,
        answer: `Contact your employer or payroll department first, since most errors are simple to correct. If the issue involves taxes or contributions, a qualified accountant or tax professional can help clarify it.`,
      },
    ],
  },
  {
    slug: 'how-income-tax-works',
    pillar: 'income-tax',
    isPillar: true,
    title: `How Income Tax Works: A Beginner's Guide`,
    description: `A beginner-friendly guide to how income tax works: taxable income, progressive brackets, marginal vs effective rates, deductions, and take-home pay.`,
    date: '2026-06-08',
    updated: '2026-06-20',
    keywords: ['how income tax works', 'income tax basics', 'taxable income', 'tax brackets explained', 'marginal vs effective tax rate', 'take-home pay'],
    content: `Income tax is one of the biggest reasons the number on your job offer is not the number that lands in your bank account. If you have ever looked at a payslip and wondered where a chunk of your salary went, this guide is for you. We will walk through how income tax works in plain English, using examples from the US, the UK, and Germany.

This is general educational information, not tax or financial advice. Rates and thresholds change every year, so always check official sources or speak to a qualified professional for your situation.

## What Is Income Tax?

Income tax is money you pay to the government based on what you earn. It funds public services like healthcare, schools, roads, and pensions. In most countries, the more you earn, the higher the percentage you pay, at least on the top slice of your income.

For employees, income tax is usually taken out of each paycheck automatically before you get paid. This is called withholding (US), PAYE in the UK, or Lohnsteuer in Germany. Freelancers and the self-employed typically calculate and pay it themselves, often in installments.

## Gross Income vs Taxable Income

These two terms trip up almost everyone, so let us separate them clearly.

- **Gross income** is your total pay before anything is taken out. If your job offer says 50,000 a year, that is gross.
- **Taxable income** is what is left after you subtract any allowances and deductions. This smaller number is what your tax is actually calculated on.

You are not taxed on every penny you earn. Most countries give you a tax-free slice first. For example, the UK has a Personal Allowance, and Germany has a basic tax-free amount (Grundfreibetrag). Below those thresholds, you pay no income tax at all. For the wider picture, see [gross income vs net income](/guides/gross-income-vs-net-income).

## Progressive Tax Brackets

Most income tax systems are progressive. Your income is divided into bands, and each band is taxed at its own rate. A common myth is that earning more can push your whole income into a higher rate. That is not how it works. Only the portion of income inside each band is taxed at that band's rate.

Here is a simplified illustration (not real current rates):

| Income band | Tax rate | Tax on this band |
|---|---|---|
| First 12,000 | 0% | 0 |
| 12,001 to 40,000 | 20% | 5,600 |
| 40,001 to 50,000 | 40% | 4,000 |

In this example, someone earning 50,000 pays 9,600 total, not 40% of everything. To understand how the bands stack in real systems, see our deeper guide on [tax brackets](/guides/understanding-tax-brackets).

### Marginal vs Effective Rate

Two quick definitions that follow from brackets:

- **Marginal rate** is the rate on your next dollar, pound, or euro earned. In the table above, it is 40%.
- **Effective rate** is the average rate across your whole income. Here it is 9,600 divided by 50,000, or about 19%.

Your effective rate is almost always lower than your top marginal rate. People often confuse the two and overestimate how much tax they actually pay.

## Allowances and Deductions

Allowances and deductions reduce your taxable income, which lowers your bill. They vary widely by country, but common examples include:

- A tax-free personal allowance or basic amount.
- Work-related expenses, such as tools, travel, or a home office.
- Pension or retirement contributions.
- Certain insurance premiums or charitable donations.

Knowing what you can claim is one of the simplest ways to keep more of your money. Our guide to [tax deductions](/guides/tax-deductions-explained) breaks down the main categories.

## Income Tax vs Social Contributions

Here is a point that surprises many people: income tax is not the only thing taken from your salary. Separately, there are social or payroll contributions.

- In the **US**, these are Social Security and Medicare (often labeled FICA).
- In the **UK**, this is National Insurance.
- In **Germany**, these cover pension, health, unemployment, and long-term care insurance.

These contributions fund pensions, healthcare, and unemployment support. They are calculated differently from income tax and often have their own thresholds and caps. Because they can add up to a significant share of your pay, ignoring them gives a misleading picture of your real take-home. Learn more in our overview of [social security contributions](/guides/social-security-contributions-guide).

## How It All Becomes Take-Home Pay

Putting the pieces together, your take-home pay (also called net pay) generally looks like this:

1. Start with **gross income**.
2. Subtract **allowances and deductions** to find taxable income.
3. Apply the **progressive brackets** to calculate income tax.
4. Subtract **social contributions**.
5. What remains is your **net, take-home pay**.

A worker earning the same gross salary in the US, the UK, and Germany can end up with very different take-home amounts, because each country mixes tax and contributions differently. We compare the three side by side in our guide to [take-home pay compared across countries](/guides/take-home-pay-us-uk-germany).

Want a number for your own situation? Try our free [salary calculator](/salary-calculator) to estimate your net pay in seconds.

## Final Thoughts

Income tax can feel intimidating, but the core idea is simple: you are taxed in slices, only on what is left after your tax-free allowance and deductions, and that tax sits alongside separate social contributions. Once you see how gross income becomes take-home pay step by step, your payslip stops being a mystery. Because rates and thresholds shift each year, use official sources and a qualified professional for decisions that matter.`,
    sources: [
      { label: `IRS — Federal income tax rates and brackets`, url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
      { label: `GOV.UK — Income Tax rates and Personal Allowances`, url: 'https://www.gov.uk/income-tax-rates' },
      { label: `German Federal Ministry of Finance`, url: 'https://www.bundesfinanzministerium.de' },
    ],
    faqs: [
      {
        question: `Does earning more money ever leave me worse off?`,
        answer: `In a normal progressive system, no. Only the income inside a higher band is taxed at the higher rate, so a raise always increases your take-home pay. Specific benefit cliffs are a separate issue and not part of how income tax brackets work.`,
      },
      {
        question: `What is the difference between income tax and social contributions?`,
        answer: `Income tax is a general tax on earnings that funds public services. Social contributions (like National Insurance, FICA, or German social insurance) are separate payments that fund pensions, healthcare, and unemployment support, and they are calculated under their own rules.`,
      },
      {
        question: `Why is my take-home pay lower than I expected?`,
        answer: `Your gross salary has both income tax and social contributions deducted, and sometimes pension or other withholdings too. The combined effect can be larger than people expect, which is why an estimate from a calculator helps set realistic expectations.`,
      },
      {
        question: `Do freelancers pay income tax differently from employees?`,
        answer: `The rates are usually the same, but the process differs. Employees have tax withheld automatically each payday, while freelancers typically calculate and pay it themselves, often in installments, and may be able to claim more business expenses.`,
      },
    ],
  },
  {
    slug: 'take-home-pay-us-uk-germany',
    pillar: 'income-tax',
    title: `Take-Home Pay Compared: US vs Germany vs UK`,
    description: `Compare take-home pay in the US, Germany, and the UK. See how income tax and social contributions shape net pay, with an illustrative country table.`,
    date: '2026-06-14',
    updated: '2026-06-20',
    keywords: ['take-home pay comparison', 'US vs Germany vs UK salary', 'net pay by country', 'social contributions', 'income tax comparison', 'payroll deductions'],
    content: `## Why the Same Salary Feels Different in Each Country

Imagine three workers, each earning the equivalent of a solid middle-income salary, living in the United States, Germany, and the United Kingdom. They might agree on the same gross pay, yet the amount that actually lands in their bank accounts can look surprisingly different. The reason is not just the income tax rate. It is the full stack of deductions, including social contributions, that each country layers on top of (or alongside) income tax.

Understanding these differences helps you compare job offers, plan a move abroad, or simply make sense of your own payslip. If you want to see how the pieces fit together first, our guide on [how income tax works](/guides/how-income-tax-works) is a helpful starting point, along with the difference between [gross vs net income](/guides/gross-income-vs-net-income).

## The Building Blocks of Take-Home Pay

Every country in this comparison uses a progressive income tax, meaning higher slices of income are taxed at higher rates. But each adds its own twist.

### United States

In the US, federal income tax uses graduated brackets, and most states add their own income tax on top (a few charge none). On top of that, workers pay FICA, which funds Social Security and Medicare. FICA is a flat-rate payroll contribution split between employee and employer, so it applies even to lower earners who may owe little federal income tax.

### Germany

Germany combines a progressive income tax with the Solidaritaetszuschlag (the solidarity surcharge), which today mainly affects higher earners. The bigger story, though, is statutory social insurance. German workers contribute to public health insurance, pension insurance, long-term care insurance, and unemployment insurance. These contributions are substantial and are a major reason German take-home pay is often lower than in the US or UK at a similar gross figure.

### United Kingdom

The UK applies a progressive income tax with a tax-free Personal Allowance, an amount you can earn before any income tax applies. Alongside income tax, employees pay National Insurance contributions, which fund the state pension and other benefits. The combined burden typically sits between the US and Germany for many earners.

## An Illustrative Comparison

The table below is a rough, simplified illustration for a single worker with no dependents, using an approximate gross salary of 60,000 in each local currency. These figures are estimates for learning purposes only. They are not exact, do not reflect every personal circumstance, and should not be used for real planning. Currencies are not converted, so do not read across as a like-for-like exchange.

| Item | United States | Germany | United Kingdom |
|---|---|---|---|
| Currency | USD | EUR | GBP |
| Approx. gross | 60,000 | 60,000 | 60,000 |
| Income tax | Moderate | Higher | Moderate |
| Social contributions | FICA (lower) | Health, pension, care, unemployment (higher) | National Insurance (moderate) |
| Approx. take-home share | Roughly 70-78% | Roughly 58-65% | Roughly 68-74% |

Treat those take-home percentages as broad illustrative ranges, not promises. State or local taxes, marital status, children, pension choices, and health-insurance details can move them significantly.

## Why Germany Often Deducts More

The headline reason is social insurance. Germany funds a comprehensive system of public health, pension, care, and unemployment coverage largely through mandatory payroll contributions. In the US, healthcare is more commonly tied to private or employer plans rather than a single statutory deduction, and in the UK much healthcare is funded through general taxation rather than a separate large contribution. So a German payslip bundles more services into visible deductions, which lowers net pay but also reflects benefits the worker receives in return.

This is why comparing only the income tax rate can be misleading. A country with a lower income tax rate may still leave you with less take-home pay once social contributions are included, and what looks like a higher deduction may come with broader public services.

## Run the Real Numbers for Your Situation

Because rates, thresholds, and allowances change every year and depend heavily on your personal circumstances, the only reliable way to see your figure is to calculate it. You can try the [US salary calculator](/salary-calculator/us), the [Germany salary calculator](/salary-calculator/de), and the [UK salary calculator](/salary-calculator/uk) to estimate your own net pay in each country.

## Final Thoughts

Take-home pay is shaped by far more than a single tax rate. Across the US, Germany, and the UK, the mix of progressive income tax and social contributions tells the real story, and Germany's higher deductions largely reflect its broad statutory insurance system. Use the illustrative ranges here to build intuition, but always run the calculators for current estimates, and consult a qualified tax professional for decisions that affect your finances. Rates and thresholds vary by year and by individual situation.`,
    sources: [
      { label: `IRS — Federal income tax rates and brackets`, url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets' },
      { label: `GOV.UK — Income Tax rates`, url: 'https://www.gov.uk/income-tax-rates' },
      { label: `German Federal Ministry of Finance`, url: 'https://www.bundesfinanzministerium.de' },
    ],
    faqs: [
      {
        question: `Why is my take-home pay lower in Germany than in the US for the same gross salary?`,
        answer: `Germany funds public health, pension, long-term care, and unemployment insurance through sizable mandatory payroll contributions. These social deductions, more than income tax alone, are the main reason German net pay is often lower at a similar gross figure.`,
      },
      {
        question: `Does a lower income tax rate always mean higher take-home pay?`,
        answer: `No. Social contributions like FICA in the US, National Insurance in the UK, and statutory insurance in Germany can change the picture significantly. A country with a lower income tax rate may still leave you with less net pay once these contributions are added in.`,
      },
      {
        question: `Are the percentages in the comparison table exact?`,
        answer: `No. They are illustrative ranges for a single worker with no dependents, meant to build intuition only. Your actual figure depends on your state or region, marital status, children, pension choices, and the current year's rates. Use the calculators for an estimate.`,
      },
      {
        question: `Can I compare the three countries by reading across the table?`,
        answer: `Not directly. Each column uses its own local currency with no exchange-rate conversion, so the numbers are not like-for-like. The table is designed to show patterns in deductions, not to convert salaries between countries.`,
      },
    ],
  },
  {
    slug: 'what-is-a-good-salary',
    pillar: 'salary-career',
    isPillar: true,
    title: `What Is a Good Salary? How to Benchmark Your Pay`,
    description: `What is a good salary? Learn how to benchmark your pay using median wages, percentiles, gross vs net, and purchasing power across the US, UK, and Germany.`,
    date: '2026-06-09',
    updated: '2026-06-20',
    keywords: ['what is a good salary', 'salary benchmarking', 'median vs average salary', 'gross vs net pay', 'salary percentiles', 'purchasing power'],
    content: `## What Counts as a Good Salary?

Ask ten people what a good salary is and you will get ten different answers. That is because pay is relative. A number that feels generous for a recent graduate in a small town might feel tight for a parent of three in an expensive city. Instead of chasing one magic figure, it helps to learn how to benchmark your pay against real data and your own situation.

This guide walks through the main ways to judge a salary, what statistics to trust, and why the headline number is only half the story.

## Why There Is No Single Good Number

Several factors shift what good means for you:

- **Location.** Wages and prices differ by country, region, and even neighborhood.
- **Role and industry.** A skilled trade, a teacher, and a software developer sit at very different points on the pay scale.
- **Experience.** Entry-level pay and senior pay for the same job title can differ widely.
- **Household size.** One income supporting four people stretches differently than one income supporting one person.
- **Cost of living.** Rent, food, transport, and taxes eat into every paycheck before it reaches your savings.

Because of this, the smartest question is not whether a salary is good in the abstract, but whether it is good for your role, in your area, at your stage. For a deeper look at how prices reshape your pay, see our guide on [cost of living vs salary](/guides/cost-of-living-vs-salary).

## Benchmarking With Median, Average, and Percentiles

To compare your pay fairly, you need a reference point. Official wage statistics give you three useful tools.

- **Median:** the middle value. Half of workers earn more, half earn less. The median is usually the most honest benchmark because it is not skewed by a handful of very high earners.
- **Average (mean):** add all salaries and divide by the number of workers. A few enormous salaries can pull the average well above what a typical person earns.
- **Percentiles:** these show where you stand in the pack. If you are at the 75th percentile, you earn more than 75 percent of workers in that group.

Here is a simplified example for one imaginary job. Figures change over time and vary by region, so treat this as illustration only.

| Measure | Annual figure | What it tells you |
|---|---|---|
| 25th percentile | 38,000 | Lower end of typical pay |
| Median (50th) | 52,000 | A typical worker in this role |
| Average (mean) | 57,000 | Pulled up by top earners |
| 75th percentile | 68,000 | Strong pay for the role |

If you earn close to the median for your job and region, you are roughly in line with peers. Sitting near the 75th percentile suggests strong pay, while the 25th percentile may be a signal to plan a [salary negotiation](/guides/salary-negotiation-tips).

## Gross vs Net: Judge the Money You Keep

A job offer almost always quotes a gross figure, the amount before taxes and deductions. What lands in your bank account is your net pay, and the gap between the two can be large.

- Income tax, social security, and health contributions all come out first.
- Two offers with the same gross salary can deliver very different net pay across countries or tax situations.
- A higher gross figure in a high-tax setting can leave you with less than a lower gross figure elsewhere.

So when you compare numbers, compare net where you can. Run any offer through our free [salary calculator](/salary-calculator) to estimate take-home pay in the US, Germany, or the UK before you decide.

## Using Official Wage Statistics

Government agencies publish reliable, regularly updated wage data. They are free and far more trustworthy than anonymous forum posts.

- **United States:** the Bureau of Labor Statistics publishes pay by occupation and area.
- **United Kingdom:** the Office for National Statistics reports earnings and working hours.
- **European Union and Germany:** Eurostat covers wages and labour costs across member states.

When you read these, note the date, the region, and whether the figure is gross or net. Look up your specific occupation rather than a national average, since job titles vary enormously.

## Why Purchasing Power Beats the Headline Number

Two people can earn the same salary and live very different lives. The reason is purchasing power, or how much your money actually buys where you live.

Consider this simple comparison. The figures are illustrative.

| City | Gross salary | Typical monthly rent | Rough money left after rent |
|---|---|---|---|
| Lower-cost city | 50,000 | 900 | More breathing room |
| Higher-cost city | 60,000 | 1,800 | Less breathing room |

The 60,000 salary looks bigger, but after a much higher rent, the worker in the lower-cost city may save more each month. This is why a raise that comes with a move to a pricey city is not always a real gain.

A few habits help you focus on purchasing power:

- Compare net pay, not gross, against local prices.
- Factor in rent, transport, taxes, and childcare, not just the salary.
- Weigh benefits like pension contributions, paid leave, and health coverage.

When you weigh two roles side by side, our guide on how to [compare job offers](/guides/how-to-compare-job-offers) walks through the full checklist.

## Final Thoughts

A good salary is not a fixed number you can look up once. It is a number that fits your role, your location, your experience, and your cost of living, and that leaves you with healthy take-home pay. Use median and percentile data to see where you stand, always check net rather than gross, and judge any offer by what it actually buys.`,
    sources: [
      { label: `U.S. Bureau of Labor Statistics — Occupational Employment and Wage Statistics`, url: 'https://www.bls.gov/oes/' },
      { label: `UK Office for National Statistics — Earnings and working hours`, url: 'https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours' },
      { label: `Eurostat — Wages and labour costs`, url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Wages_and_labour_costs' },
    ],
    faqs: [
      {
        question: `Should I look at the median or the average salary when benchmarking?`,
        answer: `The median is usually more reliable because it shows the middle worker and is not distorted by a few very high earners. The average can look higher than what most people actually earn. Where possible, check both, plus percentiles for your specific role and region.`,
      },
      {
        question: `Is a higher gross salary always better?`,
        answer: `Not necessarily. After income tax, social security, and other deductions, a higher gross figure in a high-tax area can leave you with less net pay than a lower gross figure elsewhere. Always compare take-home pay, and weigh local cost of living before deciding.`,
      },
      {
        question: `Where can I find trustworthy salary data?`,
        answer: `Government statistics agencies are a strong starting point: the U.S. Bureau of Labor Statistics, the UK Office for National Statistics, and Eurostat for the EU and Germany. Look up your specific occupation and region, and note the date and whether figures are gross or net.`,
      },
      {
        question: `How does cost of living change what counts as a good salary?`,
        answer: `A larger salary in an expensive city can leave you with less spare money than a smaller salary in a cheaper area once rent, taxes, and daily costs are paid. Purchasing power, what your net pay actually buys locally, often matters more than the headline number.`,
      },
    ],
  },
  {
    slug: 'how-to-compare-job-offers',
    pillar: 'salary-career',
    title: `How to Compare Job Offers (Beyond the Salary)`,
    description: `Learn how to compare job offers beyond salary: convert to annual gross and net, value benefits, and factor in taxes, commute, and non-financial perks.`,
    date: '2026-06-16',
    updated: '2026-06-20',
    keywords: ['compare job offers', 'total compensation', 'net pay comparison', 'employee benefits value', 'evaluating job offers', 'take-home pay'],
    content: `A higher number on the offer letter does not always mean more money in your pocket. Two jobs with the same gross salary can leave you with very different amounts once taxes, benefits, and commuting costs are counted. Comparing offers well means looking at the full picture, not just the headline figure.

## Start by Putting Every Offer on the Same Basis

Offers arrive in different shapes. One is quoted per year, another per month, another per hour. Before you can compare anything, convert each one to annual gross pay.

- Hourly to annual: multiply the hourly rate by hours per week, then by 52. A rate of 25 per hour at 40 hours a week is about 52,000 per year.
- Monthly to annual: multiply by 12. A salary of 4,500 EUR per month is 54,000 EUR per year.

Once every offer is annual gross, take the next step that most people skip: estimate the [take-home pay](/guides/what-is-take-home-pay). Gross is what you are promised; net is what actually lands in your bank account after income tax and social contributions. You can run each figure through our [salary calculator](/calculator) or the [net salary calculator](/net-salary-calculator) to compare net side by side.

## Put a Number on the Benefits

Benefits are real money, even though they never show up as salary. According to the U.S. Bureau of Labor Statistics, benefits make up a meaningful share of total employee compensation, so ignoring them can hide a large gap.

Things worth valuing:

- Health insurance: how much is the premium, and how much does the employer cover?
- Pension or retirement match: a 5 percent match on a 60,000 salary is 3,000 a year of effectively free money.
- Paid time off: an extra week of leave has a cash value roughly equal to one week of pay.
- Bonuses: confirm whether they are guaranteed or discretionary, and use a conservative estimate.

## Account for Location and Taxes

Where a job is based changes your net pay and your costs. Tax rules differ by country and sometimes by region, and the same gross salary nets out differently in the US, Germany, and the UK. See how the three compare in [take-home pay compared across countries](/guides/take-home-pay-us-uk-germany).

A salary that looks bigger in an expensive city may stretch less than a smaller one in a cheaper area. Weigh the offer against local prices using our guide on [cost of living](/guides/cost-of-living-vs-salary) before you decide.

## Two Offers Side by Side

Here is a simplified example comparing two offers with identical gross pay.

| Factor | Offer A | Offer B |
| --- | --- | --- |
| Annual gross | 60,000 | 60,000 |
| Estimated net | 45,000 | 44,000 |
| Retirement match | 0 | 3,000 |
| Paid time off | 20 days | 28 days |
| Commute cost (yearly) | 2,400 | 0 (remote) |
| Rough total value | 42,600 | 47,000 |

On paper they tied. Once benefits and commuting are included, Offer B is clearly ahead.

### Commute and Remote Work

Commuting costs money and time. A 2,400 yearly commute is effectively a pay cut. Remote or hybrid roles can also save on lunches, parking, and work clothes, and give you hours back each week.

## Do Not Forget the Non-Financial Factors

Numbers matter, but so does the rest of the job:

- Growth: training, promotion paths, and skills you will build.
- Stability: company health and how secure the role feels.
- Flexibility: schedule control and remote options.
- Culture and manager: often the biggest driver of day-to-day happiness.

If two offers are close on money, these factors should decide it. And if the money is close but not equal, remember you can often ask for more. See our tips on [salary negotiation](/guides/salary-negotiation-tips) before you accept.

## Final Thoughts

The best offer is rarely the one with the biggest gross number. Convert everything to the same basis, compare net pay, add the cash value of benefits, and subtract commuting costs. Then layer in the non-financial factors that shape your daily life. Tax and benefit rules vary by country and personal situation, so treat these examples as a starting point and consult a qualified professional before making a final decision.`,
    sources: [
      { label: `U.S. Bureau of Labor Statistics — Employee Benefits`, url: 'https://www.bls.gov/ebs/' },
      { label: `GOV.UK — Income Tax`, url: 'https://www.gov.uk/income-tax' },
    ],
    faqs: [
      {
        question: `Should I compare job offers by gross or net salary?`,
        answer: `Compare net pay, the amount you actually take home after taxes and contributions. Two offers with the same gross can produce different net amounts depending on location and deductions, so net gives a truer picture.`,
      },
      {
        question: `How do I put a value on benefits like extra vacation days?`,
        answer: `Estimate the cash equivalent. One extra week of paid leave is worth roughly one week of your salary, and a retirement match is real money, for example a 5 percent match on 60,000 equals 3,000 a year.`,
      },
      {
        question: `Is a higher salary in an expensive city worth it?`,
        answer: `Not always. A bigger salary can buy less if rent, transport, and daily costs are much higher. Compare the offer against local living costs and your estimated net pay before deciding.`,
      },
      {
        question: `How much does commuting really affect a job offer?`,
        answer: `More than people expect. Travel costs act like a pay cut, and the lost time has value too. A remote role that removes a 2,400 yearly commute can outweigh a slightly higher gross salary.`,
      },
    ],
  },
  {
    slug: 'cost-of-living-vs-salary',
    pillar: 'salary-career',
    title: `Cost of Living vs Salary: Understanding Your Real Income`,
    description: `Learn how cost of living shapes your real income. Compare nominal vs real pay, purchasing power, and net salary across cities to see what you truly earn.`,
    date: '2026-06-15',
    updated: '2026-06-20',
    keywords: ['cost of living vs salary', 'real income', 'purchasing power', 'nominal vs real income', 'net pay comparison', 'salary by city'],
    content: `## What Your Salary Is Really Worth

A job offer with a bigger number on it can feel like an automatic win. But the size of your paycheck only tells half the story. What truly matters is how much that money can buy where you live. This is the difference between nominal income and real income, and understanding it can change how you judge any job offer.

## Nominal Income vs Real Income

Nominal income is the raw amount you earn, measured in plain currency. Real income adjusts that figure for the cost of the things you actually buy.

- Nominal income: the number on your contract, for example 60,000 USD a year.
- Real income: what that 60,000 can cover after you account for rent, food, transport, and taxes.

Two people can earn the same nominal salary and live very differently, depending on local prices.

## Purchasing Power and Inflation

Purchasing power is how much one unit of currency buys. It shrinks when prices rise. If your pay stays flat while prices climb 4 percent in a year, you have effectively taken a pay cut, because your money buys less.

Inflation is measured by official price indices such as the Consumer Price Index. Note that prices and inflation rates change constantly, so any figure you see is a snapshot, not a permanent rule.

## The Costs That Eat Your Salary

A few large expenses shape your standard of living more than anything else:

- Housing: usually the biggest cost, and the one that varies most between locations.
- Transport: car ownership, fuel, or public transit passes.
- Food and groceries: everyday spending that adds up quickly.
- Taxes and contributions: these reduce gross pay before you spend a cent, which is why [gross vs net income](/guides/gross-income-vs-net-income) matters so much.

## Same Salary, Different Reality

Imagine two people both earning 70,000 per year in local currency. The table below uses illustrative figures to show how the same salary can stretch very differently.

| Cost item (per year) | High-cost city | Lower-cost city |
| --- | --- | --- |
| Rent | 24,000 | 12,000 |
| Transport | 4,000 | 2,500 |
| Food | 8,000 | 6,000 |
| Estimated taxes | 18,000 | 18,000 |
| Money left over | 16,000 | 31,500 |

Same gross salary, nearly double the leftover money. The lower-cost city offers a higher real income even though the paycheck is identical.

## Why a Higher Gross Salary Can Mean Less

This is the trap many job seekers miss. A role paying 90,000 in an expensive metro area can leave you with less spending power than a 65,000 role in a more affordable region. Higher rent, pricier transport, and sometimes steeper local taxes can quietly erase the difference and then some.

When weighing offers, look past the headline number and ask what your life will actually cost. To gauge whether an offer is competitive in the first place, see [what is a good salary](/guides/what-is-a-good-salary).

## Comparing Across Cities and Countries

Cross-country comparison adds extra layers: different tax systems, healthcare models, and currencies. A salary in Germany, the UK, and the US can map to very different take-home amounts and living costs. Our guide to [take-home pay compared](/guides/take-home-pay-us-uk-germany) walks through these differences.

A simple, practical approach:

1. Start with net pay, not gross. Use a [salary calculator](/salary-calculator) to estimate what actually lands in your account.
2. Subtract your major local costs, especially housing.
3. Compare the money left over, not the headline salaries.

This keeps you focused on real income rather than an impressive but misleading gross figure.

## Final Thoughts

A salary is only as good as what it lets you afford. By thinking in terms of real income, purchasing power, and local costs, you can compare opportunities far more accurately. Start from your net pay, factor in housing and everyday expenses, and you will have a clear, honest picture of any offer. Remember that prices and tax rules shift over time, so treat every comparison as a current estimate rather than a fixed truth.`,
    sources: [
      { label: `U.S. Bureau of Labor Statistics — Consumer Price Index`, url: 'https://www.bls.gov/cpi/' },
      { label: `UK Office for National Statistics — Inflation and price indices`, url: 'https://www.ons.gov.uk/economy/inflationandpriceindices' },
      { label: `Eurostat — Harmonised Index of Consumer Prices`, url: 'https://ec.europa.eu/eurostat/web/hicp' },
    ],
    faqs: [
      {
        question: `What is the difference between nominal and real income?`,
        answer: `Nominal income is the raw amount you earn in currency, while real income reflects what that money can actually buy after accounting for prices and inflation. Real income is the better measure of your standard of living.`,
      },
      {
        question: `Why can a higher salary leave me worse off?`,
        answer: `A higher gross salary in an expensive area can be outweighed by steep housing, transport, and tax costs. After those expenses, you may have less money left over than someone earning less in a cheaper location.`,
      },
      {
        question: `How do I compare salaries between two cities or countries?`,
        answer: `Start with your estimated net pay rather than gross, subtract major local costs like rent and transport, and then compare the money left over. This reflects real purchasing power instead of headline figures.`,
      },
      {
        question: `Does inflation affect what my salary is worth?`,
        answer: `Yes. When prices rise faster than your pay, your purchasing power falls, meaning the same salary buys less over time. Inflation rates change regularly, so any figure is only a current snapshot.`,
      },
    ],
  },
  {
    slug: 'freelance-vs-employee-income',
    pillar: 'salary-career',
    title: `Freelance vs Employee: How Take-Home Pay Differs`,
    description: `Freelance vs employee take-home pay differs more than rates suggest. Learn about self-employment tax, lost benefits, and how to set a fair freelance rate.`,
    date: '2026-06-17',
    updated: '2026-06-20',
    keywords: ['freelance vs employee pay', 'freelance take-home pay', 'self-employment tax', 'setting freelance rate', 'contractor vs employee income', 'freelance net income'],
    content: `When you switch from a salaried job to freelancing, the numbers can fool you. A contract rate of 50 per hour might look far better than a 60,000 annual salary, but the two are not directly comparable. Freelancers carry costs that employers normally absorb. Before you celebrate a higher headline rate, it helps to understand where the money actually goes.

## Why a Freelance Rate Is Not a Salary

An employee salary is a packaged deal. Your employer handles a slice of your taxes, contributes to social programs on your behalf, and provides paid time off. A freelance rate is just a price for your work, with nothing bundled in. Everything an employer used to cover now comes out of your pocket.

To compare the two fairly, look beyond the gross figure. Learning the difference between [gross vs net income](/guides/gross-income-vs-net-income) is the first step, because your real earnings are what land in your bank account after taxes and costs.

## You Pay Both Halves of Social Contributions

As an employee, you and your employer split social contributions. When you go solo, you usually pay both sides.

- United States: Employees pay 7.65 percent toward Social Security and Medicare, and employers match it. Self-employed workers pay the full self-employment tax of about 15.3 percent on net earnings.
- United Kingdom: The self-employed pay National Insurance through Class 2 and Class 4, calculated on profits, rather than the employee Class 1 rate deducted by an employer.
- Germany: Employees split statutory health, pension, and care contributions with their employer. Many freelancers must arrange their own health insurance and decide whether to pay into the public pension voluntarily, often paying the full amount themselves.

These [social security contributions](/guides/social-security-contributions-guide) are easy to overlook when you set a rate, but they can swallow a large share of your income.

## Benefits You No Longer Get

Employers offer more than a paycheck. As a freelancer, the following typically disappear or become your own responsibility:

- Paid holiday and public-holiday pay
- Paid sick leave
- Employer pension contributions or matching
- Health coverage in some countries
- Notice periods and redundancy protection

If your old job gave 25 days of paid leave, those are days a freelancer earns nothing. That unpaid time has to be priced into your rate.

## Employee vs Freelancer at a Glance

| Factor | Employee | Freelancer |
| --- | --- | --- |
| Social contributions | Split with employer | Often paid in full by you |
| Paid leave and sick pay | Usually included | None unless you fund it |
| Pension contributions | Often matched | Self-funded |
| Income stability | Regular paycheck | Irregular, gap-prone |
| Business expenses | Covered by employer | Deductible but yours to pay |
| Tax filing | Mostly automatic | Your responsibility |

## Business Expenses and Irregular Income

Freelancers often pay for their own laptop, software, insurance, accounting help, and workspace. Many of these are tax-deductible, which lowers taxable profit, but you still front the cash.

Income also arrives unevenly. A strong month can be followed by a quiet one, so you need a buffer for lean periods and for tax bills that land all at once rather than being deducted automatically.

## Setting a Rate That Actually Works

A sustainable freelance rate accounts for time you cannot bill and the taxes you owe. A rough way to think about it:

- Start from the annual income you want to take home.
- Add your expected taxes and social contributions.
- Add costs for benefits you must self-fund, such as pension and insurance.
- Divide by realistic billable hours, not all working hours. Holidays, sick days, admin, and finding clients are unpaid.

### A Quick Example

Suppose you want 60,000 in take-home pay. After roughly 30 percent for taxes and contributions, plus expenses and unfunded benefits, you might need to invoice 90,000 or more. Spread across, say, 1,400 billable hours a year rather than a full 2,080, that points to a rate well above what the salary-to-hour math suggests.

Understanding [take-home pay](/guides/what-is-take-home-pay) on both sides of the comparison keeps your expectations realistic.

## Estimate Before You Decide

Tax rules vary by country and change every year, so treat all figures here as illustrative. Run your own numbers with a [salary calculator](/calculator) to see roughly what an employee salary nets you, then work backward to the freelance rate that matches it. When the decision is significant, consult a qualified tax professional.

## Final Thoughts

Freelancing can pay well, but a higher rate is not automatically more money. Once you account for double social contributions, lost benefits, unpaid time, and business costs, the comparison shifts. Estimate your net income on both paths first, and you will negotiate from a position of clarity rather than guesswork.`,
    sources: [
      { label: `IRS — Self-Employment Tax (Social Security and Medicare Taxes)`, url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
      { label: `GOV.UK — Working for yourself`, url: 'https://www.gov.uk/working-for-yourself' },
    ],
    faqs: [
      {
        question: `Is a freelance hourly rate the same as an employee hourly wage?`,
        answer: `No. An employee wage comes with employer-paid contributions, paid leave, and benefits. A freelance rate must cover all of those itself, so it generally needs to be noticeably higher to match the same take-home pay.`,
      },
      {
        question: `Why do self-employed people pay more in social contributions?`,
        answer: `As an employee, your employer pays a matching share of social contributions. When self-employed, you usually cover both the employee and employer portions, such as the roughly 15.3 percent US self-employment tax or UK Class 2 and Class 4 National Insurance.`,
      },
      {
        question: `How do I figure out a fair freelance rate?`,
        answer: `Start from your desired take-home pay, add taxes, contributions, and self-funded benefits, then divide by realistic billable hours rather than total working hours. Unpaid time for admin, holidays, and finding clients should be built in.`,
      },
      {
        question: `Can business expenses lower my freelance taxes?`,
        answer: `In many countries, legitimate business costs like equipment, software, and insurance are deductible and reduce your taxable profit. You still pay for them up front, and rules differ by country, so check local guidance or a tax professional.`,
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

/**
 * Get all guides that belong to a pillar
 */
export function getGuidesByPillar(pillarId: string): Guide[] {
  return guides.filter((guide) => guide.pillar === pillarId);
}

/**
 * Get related guides (same pillar, excluding the current one).
 * Surfaces the pillar cornerstone first.
 */
export function getRelatedGuides(slug: string, limit = 4): Guide[] {
  const current = getGuideBySlug(slug);
  if (!current) return [];
  const samePillar = guides.filter(
    (guide) => guide.slug !== slug && guide.pillar === current.pillar
  );
  samePillar.sort(
    (a, b) => Number(b.isPillar ?? false) - Number(a.isPillar ?? false)
  );
  return samePillar.slice(0, limit);
}

