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
      answer: 'We currently support tax estimates for the United States (federal taxes only), Germany, the United Kingdom, Poland, France, Spain, Italy, Sweden, and Portugal. Each country page explains that country\'s tax system and social contributions.',
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
 * Get FAQs for Poland salary calculator page
 */
export function getPolandFAQs(): FAQ[] {
  return [
    { question: `How do I calculate my net salary in Poland for 2026?`, answer: `Enter your gross salary and the calculator estimates your ZUS social contributions, the 9 percent health contribution, and PIT income tax, then subtracts them to show your estimated net (take-home) pay for the 2026 tax year.` },
    { question: `What is the tax-free amount (kwota wolna) in Poland?`, answer: `For 2026 the tax-free amount is 30,000 PLN per year. Income up to that level effectively carries no income tax, and amounts above it are taxed at the applicable bracket rate. The calculator factors this into its estimate.` },
    { question: `What are the income tax brackets in Poland?`, answer: `Poland uses two PIT brackets. A 12 percent rate applies to the tax base up to 120,000 PLN, and a 32 percent rate applies to the portion above 120,000 PLN. Only income above the threshold is taxed at the higher rate.` },
    { question: `What ZUS contributions are deducted from my salary?`, answer: `Employees pay pension (emerytalne) at 9.76 percent, disability (rentowe) at 1.5 percent, and sickness (chorobowe) at 2.45 percent. These social contributions are deducted before income tax and reduce your taxable base in this estimate.` },
    { question: `Is the health insurance contribution tax-deductible?`, answer: `No. Since 2022 the 9 percent health contribution (skladka zdrowotna) is not tax-deductible, so it lowers your take-home pay without reducing your income tax base. The calculator reflects this in its estimate.` },
    { question: `Can the calculator estimate hourly, monthly, or yearly net pay?`, answer: `The tool works from your gross figure to produce an estimated net amount, which you can view on an annual basis or break down to monthly. Any hourly, monthly, or yearly figures are estimates and depend on the gross input you provide.` },
    { question: `How accurate is this Poland salary calculator?`, answer: `It gives a close estimate based on standard 2026 rules for a single taxpayer, but it is not exact. It computes the health contribution on gross for simplicity and excludes joint filing and special reliefs, so your real result may differ.` },
    { question: `What are the limitations of this calculator?`, answer: `It assumes a single taxpayer under standard rules and does not include joint filing with a spouse, allowances for young workers, special reliefs, or non-standard contract types. These factors can change your actual outcome, so treat the result as an estimate.` },
    { question: `What is the PIT-37 annual return?`, answer: `PIT-37 is the annual income tax return most employees file in Poland. Employers withhold monthly tax advances (zaliczka) during the year, and the return reconciles those advances with the actual tax due, which may lead to a refund or extra payment.` },
    { question: `Are the pension and disability contributions capped?`, answer: `Yes. Pension and disability contributions apply until your cumulative annual gross income reaches roughly 260,190 PLN, after which they stop for the rest of the year. Sickness and health contributions are not subject to that annual cap.` },
  ];
}

/**
 * Get FAQs for France salary calculator page
 */
export function getFranceFAQs(): FAQ[] {
  return [
    { question: `How is net salary calculated in France?`, answer: `Net salary is your gross pay minus social contributions (roughly 21 to 22 percent, including CSG and CRDS) and income tax withheld at source. Our calculator estimates each of these to show an approximate take-home figure for a single person in 2026.` },
    { question: `What income tax rates apply in France for 2026?`, answer: `For a single person, the progressive bareme is 0 percent up to about 11,497 EUR, 11 percent to about 29,315, 30 percent to about 83,823, 41 percent to about 180,294, and 45 percent above that. Each rate applies only to the income within its band.` },
    { question: `What are CSG and CRDS?`, answer: `CSG (contribution sociale generalisee) is a 9.2 percent social levy on earned income, of which 6.8 percentage points are deductible for income tax and 2.4 are not. CRDS is a 0.5 percent levy that is not deductible. Both reduce your net pay.` },
    { question: `How much social contribution is deducted from my salary?`, answer: `Employee social contributions total roughly 21 to 22 percent of gross salary. This includes about 11.31 percent for social security and pensions, plus 9.2 percent CSG and 0.5 percent CRDS. These are all estimates and can vary by situation.` },
    { question: `Can I estimate hourly, monthly, or yearly take-home pay?`, answer: `Yes. Enter your salary on whichever basis you use, and the calculator estimates net income on a consistent basis. Remember these are approximate figures intended to help you compare salaries, not exact payslip amounts.` },
    { question: `What does withholding at source (prelevement a la source) mean?`, answer: `Since 2019, income tax is deducted from each paycheck by your employer using a rate set by the tax authorities, so tax is paid throughout the year. You still file an annual return that reconciles what was withheld with what you actually owe.` },
    { question: `Do I still need to file a tax return if tax is withheld at source?`, answer: `Yes. Withholding at source collects tax during the year, but you must still file an annual income tax declaration. The return accounts for your full circumstances and may produce a refund or an additional amount to pay.` },
    { question: `How accurate is this calculator?`, answer: `It provides a simplified estimate for a single person counted as one part. It excludes the 10 percent professional expense deduction and the family quotient (parts) system, so your real income tax may be lower. Treat results as a rough guide only.` },
    { question: `Why might my actual tax be lower than the estimate?`, answer: `Our estimate leaves out the standard 10 percent deduction for professional expenses and the family quotient, both of which usually reduce income tax in real life. Deductible CSG also lowers your taxable base. These factors can make your actual tax lower.` },
    { question: `Are these figures official or guaranteed?`, answer: `No. All results are estimates for the 2026 tax year, provided for educational purposes. Tax bands and rates change yearly and individual situations differ, so for precise figures consult a qualified tax professional or the official French tax administration.` },
  ];
}

/**
 * Get FAQs for Spain salary calculator page
 */
export function getSpainFAQs(): FAQ[] {
  return [
    { question: `How do I estimate my net salary in Spain for 2026?`, answer: `Enter your gross annual salary and the calculator estimates your net pay by deducting Social Security contributions first, then applying the representative IRPF income tax scale and personal minimum. The result is an estimate for the 2026 tax year.` },
    { question: `What is IRPF and how much will I pay?`, answer: `IRPF is Spain's personal income tax. It is progressive, so our representative scale runs from 19 percent on income up to 12,450 euros to 47 percent above 300,000 euros. Each rate applies only to income within its band, so your effective rate is usually lower than your top band. All results are estimates.` },
    { question: `How much are employee Social Security contributions?`, answer: `Employee contributions total about 6.48 percent of your contribution base, combining common contingencies (4.7 percent), unemployment (1.55 percent), vocational training (0.1 percent), and the MEI solidarity contribution (0.13 percent). They are deducted before income tax. This is an estimate.` },
    { question: `Is there a cap on Social Security contributions?`, answer: `Yes. Contributions are calculated only up to the maximum contribution base of about 59,059 euros per year. Earnings above that ceiling do not raise your Social Security contributions, though they are still subject to income tax. Figures are estimates.` },
    { question: `What is the personal minimum?`, answer: `The personal minimum is an amount of income, about 5,550 euros in our representative model, that is broadly treated as tax-free. It reduces the tax due on your lowest income and helps lower the effective rate on modest salaries. This is an estimate.` },
    { question: `Can the calculator show hourly, monthly, and yearly figures?`, answer: `The calculator works from your gross annual salary, and you can divide the estimated net result to approximate monthly or hourly take-home pay. These breakdowns are estimates and do not account for variable hours, bonuses, or extra payments common in Spain.` },
    { question: `Why might my actual net pay differ from the estimate?`, answer: `Spanish IRPF is shared between the state and the autonomous communities, so rates vary by region. Our calculator uses a representative combined scale for a single taxpayer and cannot reflect every regional rule, family circumstance, or deduction, so your real net pay may differ.` },
    { question: `Do regional differences really change my take-home pay?`, answer: `Yes. Because each autonomous community sets part of the IRPF scale and may offer its own deductions, two people with the same salary in different regions can have different net pay. Our estimate uses one representative scale rather than any specific region.` },
    { question: `What are retenciones and the declaracion de la Renta?`, answer: `Retenciones are the withholdings your employer applies on account of IRPF throughout the year. The declaracion de la Renta is the annual income tax return that reconciles what was withheld against what you actually owe, which may lead to a refund or an additional payment.` },
    { question: `How accurate is this calculator?`, answer: `It is a simplified estimate for a single taxpayer using a representative combined IRPF scale for the 2026 tax year. Actual regional rates, contribution limits, and the personal minimum change over time, so treat the output as a planning estimate and consult a qualified tax professional for your specific situation.` },
  ];
}

/**
 * Get FAQs for Italy salary calculator page
 */
export function getItalyFAQs(): FAQ[] {
  return [
    { question: `How does the Italy salary tax calculator work?`, answer: `It takes your gross salary, deducts an estimated INPS employee contribution of about 9.19 percent, applies the 2026 IRPEF brackets and an approximate local surtax, and factors in a no-tax allowance to estimate your net pay. All results are estimates.` },
    { question: `What are the 2026 IRPEF income tax brackets in Italy?`, answer: `For 2026 our calculator uses three brackets: 23 percent on taxable income up to 28,000 EUR, 35 percent from 28,000 to 50,000 EUR, and 43 percent above 50,000 EUR. Each rate applies only to the income within that band.` },
    { question: `What are the regional and municipal surtaxes?`, answer: `On top of IRPEF, Italy adds a regional surtax (addizionale regionale) and a municipal surtax (addizionale comunale) that vary by location. Because these differ by region and town, our calculator approximates them together at about 2.5 percent, so your local result may differ.` },
    { question: `What is INPS and how much is deducted?`, answer: `INPS is Italy's national social security and pension institute. The employee contribution is approximately 9.19 percent of gross salary, deducted before income tax, up to a contribution ceiling of roughly 120,607 EUR. This estimate lowers both your take-home pay and your taxable base.` },
    { question: `What is the no-tax area or detrazioni?`, answer: `Employees receive tax credits called detrazioni that create an effective no-tax area for lower earners, meaning some pay little or no IRPEF. These credits vary by person, so our calculator approximates the benefit with a simplified no-tax allowance.` },
    { question: `Can I estimate hourly, monthly, or yearly net pay?`, answer: `The calculator works from an annual gross figure, but you can convert it to a monthly or hourly estimate by dividing the yearly net result accordingly. Italian salaries are often paid across multiple installments, so treat any breakdown as a rough estimate.` },
    { question: `How accurate is the calculator, and what are its limitations?`, answer: `It is a simplified estimate for a single employee and does not capture every detrazione, family situation, or exact local surtax. Regional and municipal rates vary by location and individual circumstances, so your actual net pay may be higher or lower than the figure shown.` },
    { question: `Do I need to file a tax return in Italy?`, answer: `Many employees file an annual return, typically the Modello 730 or the Redditi form, to reconcile withheld amounts, claim credits, and settle any balance or refund. Our calculator does not file returns or replace this process; it only provides an estimate.` },
    { question: `Who actually pays my taxes to the government?`, answer: `Your employer normally acts as a withholding agent (sostituto d'imposta), deducting IRPEF, local surtaxes, and INPS from each paycheck and forwarding them on your behalf. The annual return then reconciles what was withheld with what you owe.` },
    { question: `Why might my real net salary differ from the estimate?`, answer: `Local surtax rates, your specific detrazioni, personal and family circumstances, and yearly changes to brackets and ceilings all affect the final number. The 2026 figures here are approximations, so for precise amounts consult a qualified tax professional.` },
  ];
}

/**
 * Get FAQs for Sweden salary calculator page
 */
export function getSwedenFAQs(): FAQ[] {
  return [
    { question: `How much tax will I pay on my salary in Sweden?`, answer: `Most workers pay mainly municipal income tax, which averages around 32 percent but varies by municipality, charged on income after the basic allowance. Higher earners also pay 20 percent state tax above the breakpoint. Our calculator gives you an estimate for the 2026 tax year.` },
    { question: `What is municipal income tax in Sweden?`, answer: `It is the local tax collected by your municipality and region, and it is the main tax for most earners. It averages about 32 percent of your taxable income after the basic allowance, though the exact rate depends on where you live. Our calculator uses an average rate to estimate your net pay.` },
    { question: `When do I pay Swedish state income tax?`, answer: `State income tax of 20 percent applies only to the part of your taxable income above a national breakpoint, about 625,800 SEK for 2025. If you earn below that threshold, you pay no state tax and only municipal tax applies to your income.` },
    { question: `What is the basic allowance (grundavdrag)?`, answer: `It is an amount of income that is deducted before municipal tax is calculated, so you are not taxed on your full salary. Our calculator applies a simplified version of this allowance, which is one reason the results are estimates rather than exact figures.` },
    { question: `Why does the calculator not show the 7 percent pension contribution?`, answer: `Employees pay a 7 percent public pension fee (allman pensionsavgift), but it is offset almost exactly by a matching tax reduction, so its net effect on take-home pay is close to zero. To avoid distorting your results, our calculator does not show it as a separate deduction.` },
    { question: `Why are there no employee social security contributions in my results?`, answer: `Sweden's large social security contributions, roughly 31.42 percent, are employer contributions paid on top of your gross salary. They are not withheld from your pay, so they do not reduce your take-home amount, and our calculator shows no employee social contributions.` },
    { question: `How is tax collected from my pay during the year?`, answer: `Your employer withholds preliminary tax (A-skatt) each month and pays it to Skatteverket. Because it is only an estimate, an annual reconciliation follows after the year ends, which can result in a refund or an additional payment depending on what was actually owed.` },
    { question: `Can I estimate my hourly, monthly, or yearly net pay?`, answer: `Yes. The calculator works from your gross salary and estimates your net income, and you can use it to get a sense of take-home pay whether you think in hourly, monthly, or yearly terms. All figures are estimates for the 2026 tax year and should be used as a guide.` },
    { question: `How accurate is this calculator?`, answer: `It provides estimates, not exact figures. Because we use an average municipal rate and a simplified basic allowance, your real result can differ from what you see here, especially if your municipality's rate is higher or lower than average. Treat the numbers as a helpful approximation.` },
    { question: `Why might my actual tax differ from the estimate?`, answer: `Your true tax depends on your specific municipality's rate, your exact allowances, and any personal deductions or credits, none of which are fully captured by an averaged estimate. Rates and breakpoints also change yearly, so for your situation consult a qualified tax professional or Skatteverket.` },
  ];
}

/**
 * Get FAQs for Portugal salary calculator page
 */
export function getPortugalFAQs(): FAQ[] {
  return [
    { question: `How much tax will I pay on my salary in Portugal?`, answer: `It depends on how much you earn, because IRS is progressive: rates start at 13 percent on the lowest band and rise in steps to 48 percent on income above about 83,696 EUR. On top of IRS, employees pay 11 percent to social security. This calculator combines both to give you an estimated net salary for mainland Portugal.` },
    { question: `What is IRS in Portugal?`, answer: `IRS (Imposto sobre o Rendimento das Pessoas Singulares) is Portugal's personal income tax. It applies progressively across several brackets, so only the portion of your income within each band is taxed at that band's rate, from 13 percent on the lowest band up to 48 percent on the highest.` },
    { question: `How much is social security for employees in Portugal?`, answer: `Employees contribute a flat 11 percent of their gross earnings to Seguranca Social, the social security system. There is no upper ceiling, so the 11 percent applies to your whole salary. This is deducted in addition to any IRS withheld from your pay.` },
    { question: `What is the specific deduction for employment income?`, answer: `Employment income benefits from a standard specific deduction of about 4,104 EUR, which lowers the income subject to IRS. If the social security you actually paid during the year is higher than this amount, the larger figure is used instead, whichever is more favorable.` },
    { question: `Can I estimate my hourly, monthly, or yearly net pay?`, answer: `Yes. The calculator works from your gross salary to estimate take-home pay, and you can use it to get a rough sense of monthly or yearly net income. Keep in mind these are estimates; employers withhold tax monthly through retencao na fonte, and the exact monthly figure can vary from a simple yearly division.` },
    { question: `How accurate is this calculator?`, answer: `It is a simplified estimate for a single mainland taxpayer and is meant as a general guide, not an official assessment. It does not capture every personal factor such as dependents, family situation, extra deductions, or other income, so your real result may differ. For an accurate figure, consult a professional or the tax authority.` },
    { question: `Do the Azores and Madeira have different tax rates?`, answer: `Yes. The autonomous regions of the Azores and Madeira apply their own, generally lower, regional IRS rates. This calculator estimates tax for mainland Portugal only and does not include those regional rates, so actual IRS in those regions may be lower than shown here.` },
    { question: `Why is tax taken from my paycheck every month?`, answer: `Portugal uses a withholding system called retencao na fonte, where your employer deducts an estimated amount of IRS from each monthly paycheck and sends it to the tax authority. Because it is based on estimate tables, it may not exactly match your final liability for the year.` },
    { question: `Do I still need to file an annual tax return?`, answer: `Yes. Even though tax is withheld monthly, workers file an annual IRS return that reconciles the tax actually due against what was withheld during the year. This can result in a refund if too much was withheld, or an additional payment if too little was.` },
    { question: `Are these figures final or just estimates?`, answer: `They are estimates for the 2026 tax year. Tax rates, brackets, and rules in Portugal can change from year to year, and this tool is a simplified mainland estimate for educational purposes only. Always confirm your specific situation with a qualified professional or the official tax authority.` },
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
    case 'PL':
      return getPolandFAQs();
    case 'FR':
      return getFranceFAQs();
    case 'ES':
      return getSpainFAQs();
    case 'IT':
      return getItalyFAQs();
    case 'SE':
      return getSwedenFAQs();
    case 'PT':
      return getPortugalFAQs();
    default:
      return getHubFAQs();
  }
}

