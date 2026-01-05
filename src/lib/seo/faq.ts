/**
 * FAQ data and JSON-LD schema generation for SEO
 */

export interface FAQ {
  question: string;
  answer: string;
}

/**
 * Generate JSON-LD structured data for FAQPage schema
 */
export function generateFAQJsonLd(faqs: FAQ[]): string {
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(faqPageSchema, null, 2);
}

/**
 * Get FAQs for the salary calculator hub page
 */
export function getHubFAQs(): FAQ[] {
  return [
    {
      question: 'How accurate are these salary tax calculations?',
      answer: 'Our calculators use official tax brackets and rates for the 2026 tax year. However, these are estimates and may not include all deductions, credits, or local taxes. For the US, state and local taxes are not included. Always consult with a tax professional for advice specific to your situation.',
    },
    {
      question: 'What\'s the difference between gross and net income?',
      answer: 'Gross income is your total earnings before any taxes or deductions. Net income (take-home pay) is what remains after income tax, social security contributions, and other mandatory deductions are subtracted from your gross income.',
    },
    {
      question: 'Do these calculators include state or local taxes?',
      answer: 'For the United States, our calculator only includes federal taxes. State and local income taxes vary significantly by location and are not included. For Germany and the UK, the calculations include national tax systems, but local variations may apply.',
    },
    {
      question: 'Can I use this for self-employment income?',
      answer: 'These calculators are designed for employee income with standard payroll deductions. Self-employed individuals typically have different tax obligations, including self-employment tax in the US, and may need to make estimated tax payments. Consult a tax professional for self-employment scenarios.',
    },
    {
      question: 'How do I convert between hourly, monthly, and yearly income?',
      answer: 'Use our Hourly to Salary Converter for quick conversions. The formulas are: Annual = Hourly × Hours per Week × Weeks per Year; Monthly = Annual ÷ 12; Hourly = Annual ÷ (Hours per Week × Weeks per Year). Standard assumptions are 40 hours per week and 52 weeks per year.',
    },
    {
      question: 'Which countries are supported?',
      answer: 'Currently, we support detailed tax calculations for the United States (federal taxes only), Germany, and the United Kingdom. Each country page includes specific information about that country\'s tax system and social security contributions.',
    },
    {
      question: 'Are the calculations updated for 2026?',
      answer: 'Yes, all calculators use 2026 tax brackets, rates, and thresholds. Tax systems are updated annually, and we strive to keep our data current. However, tax laws can change throughout the year, so verify with official sources for the most up-to-date information.',
    },
    {
      question: 'What information do I need to use the calculator?',
      answer: 'You need your gross income (hourly, monthly, or yearly), your country, and the tax year. For hourly calculations, you\'ll also need your hours per week and weeks per year. The calculator will then estimate your net income after taxes and deductions.',
    },
  ];
}

/**
 * Get FAQs for US salary calculator page
 */
export function getUSFAQs(): FAQ[] {
  return [
    {
      question: 'Does the US calculator include state and local taxes?',
      answer: 'No, our US calculator only includes federal income tax and FICA taxes (Social Security and Medicare). State and local income taxes are not included and can significantly affect your total tax liability, especially in high-tax states like California and New York.',
    },
    {
      question: 'What is the standard deduction for 2026?',
      answer: 'The standard deduction amounts for 2026 are adjusted for inflation and vary by filing status. Single filers, married filing jointly, married filing separately, and head of household each have different amounts. The standard deduction reduces your taxable income without needing to itemize deductions.',
    },
    {
      question: 'How are Social Security and Medicare taxes calculated?',
      answer: 'Social Security tax is 6.2% on wages up to the Social Security wage base (which adjusts annually). Medicare tax is 1.45% on all wages with no cap. High earners may also pay an additional 0.9% Medicare surtax on income above certain thresholds. These are separate from federal income tax.',
    },
    {
      question: 'What\'s the difference between marginal and effective tax rate?',
      answer: 'Your marginal tax rate is the rate applied to your highest income bracket. Your effective tax rate is the percentage of your total income paid in taxes, which is typically lower because different portions of income are taxed at different rates. The calculator shows your effective tax rate.',
    },
    {
      question: 'Can I calculate taxes for different filing statuses?',
      answer: 'The calculator uses standard assumptions for a single filer. Different filing statuses (married filing jointly, head of household, etc.) have different standard deductions and tax brackets. For accurate calculations for your specific filing status, consult a tax professional or use IRS tax tables.',
    },
    {
      question: 'Are tax credits and deductions included in the calculation?',
      answer: 'The calculator includes the standard deduction but does not include itemized deductions or tax credits like the Earned Income Tax Credit, child tax credits, or education credits. These can significantly reduce your tax liability, so actual take-home pay may be higher than estimated.',
    },
    {
      question: 'How do I calculate my net income if I work hourly?',
      answer: 'Enter your hourly rate and select hourly mode. The calculator will ask for hours per week (default 40) and weeks per year (default 52). It will then calculate your annual gross income and apply federal taxes and FICA contributions to show your net hourly, monthly, and annual income.',
    },
    {
      question: 'What if I have multiple jobs or additional income sources?',
      answer: 'The calculator estimates taxes for a single income source. If you have multiple jobs or additional income, your total tax liability may be different due to combined income pushing you into higher brackets. Consult a tax professional for complex income situations.',
    },
    {
      question: 'Are retirement contributions (401k, IRA) included?',
      answer: 'No, pre-tax retirement contributions are not included in the calculation. Contributions to 401(k) plans and traditional IRAs reduce your taxable income, which would lower your tax liability. If you make retirement contributions, your actual take-home pay and tax savings may differ from the estimate.',
    },
    {
      question: 'How accurate is the estimate for high earners?',
      answer: 'For high earners, the estimate may be less accurate because it doesn\'t account for the Alternative Minimum Tax (AMT), additional Medicare tax, or limitations on certain deductions. High earners should consult a tax professional for more accurate estimates.',
    },
  ];
}

/**
 * Get FAQs for Germany salary calculator page
 */
export function getGermanyFAQs(): FAQ[] {
  return [
    {
      question: 'What taxes and contributions are deducted in Germany?',
      answer: 'German employees pay income tax (Einkommensteuer), solidarity surcharge (if applicable), church tax (if applicable), and social security contributions including health insurance, long-term care insurance, unemployment insurance, and pension insurance. These are typically split between employer and employee.',
    },
    {
      question: 'What is the tax-free allowance (Grundfreibetrag) in Germany?',
      answer: 'The tax-free allowance is the amount of income you can earn without paying income tax. For 2026, this amount is adjusted annually for inflation. Income above this allowance is taxed progressively, with rates ranging from 14% to 45% depending on your income level.',
    },
    {
      question: 'How does the tax class system (Steuerklassen) work?',
      answer: 'Germany uses tax classes to determine how much tax is withheld from your paycheck. Tax class I is for single individuals, classes III and V are for married couples (with different withholding rates), and class IV is for married couples with similar incomes. Your annual tax liability is the same regardless of class, but withholding varies.',
    },
    {
      question: 'What are social security contributions in Germany?',
      answer: 'Social security contributions include health insurance (Krankenversicherung), long-term care insurance (Pflegeversicherung), unemployment insurance (Arbeitslosenversicherung), and pension insurance (Rentenversicherung). These are calculated as percentages of your gross income, typically split 50/50 between employer and employee.',
    },
    {
      question: 'Do I need public or private health insurance in Germany?',
      answer: 'Employees earning below the insurance obligation threshold (Versicherungspflichtgrenze) must have public health insurance. Above this threshold, you can choose private insurance, though many remain in the public system. The calculator assumes public health insurance rates.',
    },
    {
      question: 'What is the solidarity surcharge (Solidaritätszuschlag)?',
      answer: 'The solidarity surcharge was introduced to fund German reunification. It has been largely eliminated for most taxpayers but may still apply to very high earners. It\'s calculated as a percentage of your income tax and is included in the calculation if applicable.',
    },
    {
      question: 'How do I calculate net income for hourly workers in Germany?',
      answer: 'Enter your hourly rate and select hourly mode. Specify your hours per week and weeks per year. The calculator will annualize your income, apply German income tax brackets, and deduct social security contributions to show your net hourly, monthly, and annual income.',
    },
    {
      question: 'Are child allowances and tax benefits included?',
      answer: 'The calculator uses standard scenarios and may not include all child allowances (Kinderfreibetrag) or other tax benefits you may be eligible for. Parents typically receive additional tax benefits that can reduce tax liability, so actual take-home pay may be higher than estimated.',
    },
    {
      question: 'What if I\'m married or have children?',
      answer: 'Married couples can benefit from income splitting (Ehegattensplitting), which can reduce combined tax liability. Parents receive child allowances and may qualify for additional benefits. The calculator provides estimates based on standard scenarios; actual taxes may be lower for families.',
    },
    {
      question: 'How accurate is the estimate for part-time workers?',
      answer: 'The estimate is accurate for part-time workers as long as you enter your actual hours per week. However, part-time workers earning below certain thresholds may have different social security contribution rates or exemptions. The calculator uses standard contribution rates.',
    },
    {
      question: 'What about the annual tax return (Steuererklärung)?',
      answer: 'Many German taxpayers file an annual tax return to claim additional deductions and potentially receive refunds. The calculator shows estimated withholding amounts, but your final tax liability after filing a return may differ, especially if you have deductible expenses or qualify for additional allowances.',
    },
  ];
}

/**
 * Get FAQs for UK salary calculator page
 */
export function getUKFAQs(): FAQ[] {
  return [
    {
      question: 'What taxes are deducted from UK salaries?',
      answer: 'UK employees pay income tax and National Insurance contributions. Income tax is calculated on income above the personal allowance, with rates of 20% (basic rate), 40% (higher rate), and 45% (additional rate). National Insurance funds state benefits and the NHS.',
    },
    {
      question: 'What is the personal allowance in the UK?',
      answer: 'The personal allowance is the amount of income you can earn before paying income tax. For 2026, this amount is set annually and may be adjusted for inflation. Income above the personal allowance is taxed at progressive rates. The allowance is gradually withdrawn for very high earners.',
    },
    {
      question: 'How is National Insurance calculated?',
      answer: 'National Insurance is calculated on a weekly or monthly basis (depending on pay frequency) on earnings above the primary threshold. The main rate applies between the primary threshold and upper earnings limit, with a reduced rate above the upper limit. Unlike income tax, NI thresholds are applied per pay period, not annually.',
    },
    {
      question: 'What\'s the difference between income tax and National Insurance?',
      answer: 'Income tax provides general government revenue and is calculated annually. National Insurance specifically funds state benefits (pension, unemployment, healthcare) and is calculated per pay period. Both are deducted through PAYE, but they operate under different rules and thresholds.',
    },
    {
      question: 'Do Scottish taxpayers pay different rates?',
      answer: 'Yes, Scotland has devolved powers over income tax rates and bands. Scottish taxpayers may face different rates and thresholds than those in England, Wales, and Northern Ireland. The calculator uses standard UK rates; Scottish taxpayers should verify their specific rates.',
    },
    {
      question: 'How do I calculate net income for hourly workers in the UK?',
      answer: 'Enter your hourly rate and select hourly mode. Specify your hours per week (default 40) and weeks per year (default 52). The calculator will annualize your income, apply UK income tax bands and National Insurance contributions to show your net hourly, monthly, and annual income.',
    },
    {
      question: 'What is the marriage allowance?',
      answer: 'The marriage allowance allows eligible couples to transfer a portion of the personal allowance from one spouse to another, potentially reducing tax liability. The calculator doesn\'t include this allowance, so married couples may pay less tax than estimated.',
    },
    {
      question: 'Are pension contributions included in the calculation?',
      answer: 'No, pension contributions are not included. Pension contributions receive tax relief, meaning they\'re made from pre-tax income, which reduces your taxable income and tax liability. If you make pension contributions, your actual take-home pay and tax savings may differ from the estimate.',
    },
    {
      question: 'How does the PAYE system work?',
      answer: 'PAYE (Pay As You Earn) is the UK system where employers calculate and deduct income tax and National Insurance from each paycheck. Your tax code determines your tax-free allowance. At year-end, HMRC reconciles amounts paid and issues tax calculations with refunds or additional payments as needed.',
    },
    {
      question: 'What if I have multiple jobs or additional income?',
      answer: 'The calculator estimates taxes for a single income source. If you have multiple jobs or additional income, your total tax liability may be different because combined income could push you into higher tax bands. You may need to pay additional tax or receive a refund at year-end.',
    },
    {
      question: 'Are benefits in kind included in the calculation?',
      answer: 'No, benefits in kind (company car, private health insurance, etc.) are not included. These are subject to income tax and National Insurance, which would reduce your net pay. If you receive benefits in kind, your actual take-home pay may be lower than estimated.',
    },
    {
      question: 'How accurate is the estimate for high earners?',
      answer: 'For high earners, the estimate may be less accurate because it doesn\'t account for the personal allowance withdrawal, restrictions on certain allowances, or potential additional tax obligations. High earners should consult HMRC guidance or a tax advisor for more accurate estimates.',
    },
  ];
}

/**
 * Get FAQs based on country code
 */
export function getCountryFAQs(countryCode: string): FAQ[] {
  switch (countryCode.toUpperCase()) {
    case 'US':
      return getUSFAQs();
    case 'DE':
      return getGermanyFAQs();
    case 'UK':
      return getUKFAQs();
    default:
      return getHubFAQs();
  }
}

