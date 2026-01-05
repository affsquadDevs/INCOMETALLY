/**
 * Country metadata and content for salary calculator pages
 */

export type CountryCode = 'US' | 'DE' | 'UK';

export interface CountryMetadata {
  code: CountryCode;
  name: string;
  displayName: string;
  currency: string;
  flag: string;
  title: string;
  description: string;
  taxExplanation: string;
  exampleGross: number;
  exampleMode: 'yearly' | 'monthly' | 'hourly';
}

export const countries: Record<CountryCode, CountryMetadata> = {
  US: {
    code: 'US',
    name: 'United States',
    displayName: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    title: 'US Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Calculate your net salary after federal taxes in the United States. Estimate your take-home pay with our free US tax calculator for 2026.',
    taxExplanation: `The United States operates a progressive federal income tax system where tax rates increase as income rises. The Internal Revenue Service (IRS) administers the tax code, which includes seven tax brackets ranging from 10% to 37% for the 2026 tax year. This system is designed to ensure that those with higher incomes contribute a larger percentage of their earnings to federal revenue, while providing relief for lower-income households through lower tax rates and various credits.

Federal income tax is calculated using marginal tax brackets, meaning different portions of your income are taxed at different rates. For example, if you earn $75,000 annually, the first portion of your income falls into lower brackets, and only the amount exceeding each bracket threshold is taxed at the higher rate. This progressive structure ensures that lower-income earners pay a smaller percentage of their income in taxes compared to higher earners. Understanding marginal tax rates is crucial because your effective tax rate—the percentage of your total income paid in taxes—is typically lower than your top marginal rate.

In addition to federal income tax, most employees also pay Social Security and Medicare taxes, commonly referred to as FICA taxes. Social Security tax is levied at 6.2% on wages up to a certain cap (the Social Security wage base), which adjusts annually for inflation. This cap means that once you reach the wage base limit, no additional Social Security tax is withheld for the remainder of the year. Medicare tax is charged at 1.45% on all wages with no cap, meaning high earners continue paying Medicare tax on their entire income. High earners may also be subject to an additional 0.9% Medicare surtax on income above specific thresholds, which applies to wages, self-employment income, and other compensation.

The standard deduction is a key feature of the US tax system, allowing taxpayers to reduce their taxable income without itemizing deductions. For 2026, the standard deduction amounts are adjusted for inflation and vary by filing status—single, married filing jointly, married filing separately, and head of household each have different amounts. This deduction effectively exempts a portion of income from taxation, making the effective tax rate lower than the marginal rate for many taxpayers. Taxpayers can choose between taking the standard deduction or itemizing deductions such as mortgage interest, state and local taxes, and charitable contributions, whichever provides the greater tax benefit.

Tax withholding occurs throughout the year via payroll deductions, where employers withhold estimated taxes from each paycheck based on information provided on Form W-4. This form allows employees to specify their filing status, number of dependents, and other factors that affect tax liability. At the end of the tax year, taxpayers file an annual return to reconcile their actual tax liability with the amounts withheld. If too much was withheld, taxpayers receive a refund; if too little, they must pay the difference. The goal is to have withholding match actual tax liability as closely as possible to avoid large refunds or unexpected tax bills.

The US tax system also includes various credits and deductions that can further reduce tax liability. These include the Earned Income Tax Credit (EITC) for low to moderate-income workers, child tax credits, education credits, and deductions for retirement contributions, among others. Tax credits are particularly valuable because they reduce tax liability dollar-for-dollar, while deductions reduce taxable income. However, this calculator focuses on the basic federal income tax and FICA contributions, providing a baseline estimate before accounting for these additional factors.

It's important to note that state and local taxes are not included in federal calculations. Many states impose their own income taxes, which can range from flat rates to progressive structures similar to the federal system. Some states, like Texas and Florida, have no state income tax, while others like California and New York have relatively high state tax rates. Local jurisdictions may also levy additional income taxes, particularly in major metropolitan areas. These state and local taxes can significantly impact total tax burden, sometimes adding several percentage points to the effective tax rate.

The tax code undergoes periodic changes through legislation, and rates and brackets are adjusted for inflation annually using the Consumer Price Index. Taxpayers should consult the most current IRS publications or a qualified tax professional for advice specific to their situation, as individual circumstances can vary significantly based on filing status, dependents, deductions, and other factors. The complexity of the US tax system means that two individuals with the same gross income may have very different net incomes depending on their specific situation.`,
    exampleGross: 75000,
    exampleMode: 'yearly',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    displayName: 'Germany',
    currency: 'EUR',
    flag: '🇩🇪',
    title: 'Germany Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Calculate your net salary after taxes and social contributions in Germany. Estimate your take-home pay with our free German tax calculator for 2026.',
    taxExplanation: `Germany operates a comprehensive tax and social security system that significantly impacts take-home pay. The income tax system is progressive, with rates ranging from 0% to 45% for the highest earners, plus a solidarity surcharge and church tax in some regions. This system is designed to fund extensive social services while maintaining a progressive structure that places a greater burden on higher earners.

Income tax in Germany is calculated using a progressive scale with multiple tax brackets. The tax-free allowance (Grundfreibetrag) ensures that low-income earners pay no income tax. For 2026, this allowance is adjusted annually to account for inflation and cost of living increases. As income rises, different portions are taxed at increasing rates: 14% for the lowest taxable bracket, rising through intermediate rates to 42% for high earners, and 45% for the highest income bracket. The progressive nature means that only income above each threshold is taxed at the higher rate, not the entire income.

The solidarity surcharge (Solidaritätszuschlag) is an additional tax originally introduced to fund German reunification. While it has been largely eliminated for most taxpayers, it may still apply to very high earners. Church tax (Kirchensteuer) is collected in most German states for members of recognized religious communities, typically adding 8-9% to the income tax amount. This tax is automatically deducted for registered members of churches and religious communities, though individuals can opt out by formally leaving their religious community.

Social security contributions represent a significant portion of deductions in Germany. The system includes four main components: health insurance, long-term care insurance, unemployment insurance, and pension insurance. These contributions are typically split between employer and employee, with each party paying approximately half of the total contribution. This shared responsibility model is designed to distribute the cost of social services between workers and employers, though the employee portion directly reduces take-home pay.

Health insurance contributions are mandatory for all employees earning below a certain threshold (Versicherungspflichtgrenze). Above this threshold, employees can opt for private health insurance, though many remain in the public system. The contribution rate is a percentage of gross income, shared equally between employer and employee. Long-term care insurance follows a similar structure, with contributions calculated as a percentage of income. Both systems provide comprehensive coverage, with public health insurance covering most medical expenses and long-term care insurance providing support for nursing and care services.

Unemployment insurance provides financial support during periods of job loss and is funded through contributions from both employer and employee. The contribution rate is set annually and applies to income up to a contribution assessment ceiling. This insurance provides unemployment benefits (Arbeitslosengeld) for a limited period, typically based on previous earnings and contribution history. Pension insurance contributions fund the state pension system, with rates determined by the government and also split between employer and employee. The pension system provides retirement benefits based on lifetime contributions and is designed to replace a portion of pre-retirement income.

The German tax system includes various deductions and allowances that can reduce taxable income. These include allowances for children, special expenses (Sonderausgaben), and extraordinary expenses (außergewöhnliche Belastungen). The tax class system (Steuerklassen) determines how much tax is withheld, with different classes for single individuals, married couples, and other situations. Tax class III provides the most favorable withholding for one spouse in a married couple, while tax class V provides less favorable withholding for the other spouse, though the total tax liability is the same regardless of class selection.

Tax withholding in Germany occurs through the wage tax (Lohnsteuer) system, where employers calculate and deduct taxes and social contributions from each paycheck based on the employee's tax class and submitted information. The annual tax return process allows taxpayers to claim additional deductions and potentially receive refunds if over-withholding occurred. Many taxpayers receive refunds after filing their annual return, particularly those who can claim additional deductions or who had significant special expenses during the year.

The complexity of the German tax and social security system means that effective tax rates can vary significantly based on individual circumstances, including marital status, number of children, health insurance type, and other factors. Married couples often benefit from income splitting, which can reduce their combined tax burden. Parents receive child allowances and may be eligible for additional tax benefits. This calculator provides estimates based on standard scenarios and should be used as a guide rather than a definitive calculation, as actual take-home pay can vary based on many individual factors.`,
    exampleGross: 55000,
    exampleMode: 'yearly',
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    displayName: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    title: 'UK Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Calculate your net salary after income tax and National Insurance in the United Kingdom. Estimate your take-home pay with our free UK tax calculator for 2026.',
    taxExplanation: `The United Kingdom operates a progressive income tax system administered by HM Revenue and Customs (HMRC). The system includes income tax and National Insurance contributions, which together determine the total deductions from gross salary. These two systems work in parallel, with income tax providing general government revenue and National Insurance specifically funding social security benefits and the National Health Service.

Income tax in the UK is structured around a personal allowance, which is the amount of income an individual can earn before paying any income tax. For the 2026 tax year, this allowance is set at a specific threshold and is adjusted annually, typically in line with inflation. Income above the personal allowance is taxed at different rates depending on which tax band it falls into. The personal allowance is gradually withdrawn for very high earners, creating an effective higher tax rate for those in the withdrawal range.

The UK has three main income tax bands for most taxpayers: the basic rate, the higher rate, and the additional rate. The basic rate of 20% applies to income above the personal allowance up to the basic rate limit. The higher rate of 40% applies to income above the basic rate limit up to the additional rate threshold. The additional rate of 45% applies to income above the additional rate threshold. These thresholds are adjusted annually, and different rates may apply in Scotland due to devolved tax powers. The progressive structure ensures that only income within each band is taxed at that rate, not the entire income.

National Insurance (NI) is a separate system that funds state benefits including the state pension, unemployment benefits, and healthcare through the National Health Service. Employees pay Class 1 National Insurance contributions, which are calculated as a percentage of earnings above a primary threshold. The main rate applies to earnings between the primary threshold and the upper earnings limit, with a reduced rate applying above the upper earnings limit. This creates a regressive element in the overall tax system, as National Insurance rates decrease for very high earners, though the additional income tax rate compensates for this.

National Insurance contributions are calculated on a weekly or monthly basis, depending on how the employee is paid. The rates and thresholds are set annually and can change with each budget announcement. Unlike income tax, National Insurance has a weekly or monthly calculation period, which means the thresholds are applied per pay period rather than annually. This can create situations where employees with irregular pay may pay different amounts of National Insurance depending on their pay pattern, even if their annual income is the same.

The UK tax system operates on a Pay As You Earn (PAYE) basis, where employers calculate and deduct income tax and National Insurance from each paycheck. The tax code system determines how much tax-free allowance an individual receives, with different codes for various circumstances such as multiple jobs, pension income, or other sources of income. At the end of the tax year, HMRC reconciles the amounts paid and issues tax calculations, with refunds or additional payments as necessary. Most employees receive their tax code automatically, but those with complex circumstances may need to contact HMRC to ensure accurate coding.

Various allowances and reliefs can reduce tax liability, including the personal allowance, marriage allowance for eligible couples, and reliefs for pension contributions. Pension contributions receive tax relief, meaning contributions are made from pre-tax income, effectively reducing taxable income. The state pension age and eligibility for various benefits are linked to National Insurance contribution history, with a minimum number of qualifying years required for full state pension entitlement. This creates an incentive for consistent National Insurance contributions throughout working life.

The UK tax system also includes various deductions and credits, though the personal allowance is the primary mechanism for reducing tax for most employees. Higher-rate taxpayers may be subject to restrictions on certain allowances, and the personal allowance is gradually withdrawn for very high earners. Tax-free savings accounts (ISAs) provide additional tax benefits, allowing individuals to save and invest without paying tax on interest, dividends, or capital gains. These accounts have annual contribution limits and can significantly benefit long-term savers.

Scotland has devolved powers over income tax rates and bands, meaning Scottish taxpayers may face different rates and thresholds than those in the rest of the UK. The Scottish government can set different rates and bands, which has resulted in slightly different tax structures, particularly for higher earners. Wales also has some devolved tax powers, though currently uses the same rates as England and Northern Ireland for most taxpayers. This devolution means that taxpayers in different parts of the UK may have different effective tax rates even with the same income.

It's important to note that this calculator provides estimates based on standard scenarios and standard tax codes. Individual circumstances, including pension contributions, benefits in kind, and other factors, can significantly affect actual take-home pay. Benefits in kind, such as company cars or private health insurance, are subject to income tax and National Insurance, which can reduce net pay. Taxpayers should consult HMRC guidance or a qualified tax advisor for advice specific to their situation, particularly if they have multiple income sources, significant deductions, or complex financial arrangements.`,
    exampleGross: 45000,
    exampleMode: 'yearly',
  },
};

export function getCountryByCode(code: string): CountryMetadata | null {
  const upperCode = code.toUpperCase() as CountryCode;
  return countries[upperCode] || null;
}

export function getAllCountryCodes(): CountryCode[] {
  return Object.keys(countries) as CountryCode[];
}

export function getOtherCountries(currentCode: CountryCode): CountryMetadata[] {
  return Object.values(countries).filter(c => c.code !== currentCode);
}

