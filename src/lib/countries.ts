/**
 * Country metadata and content for salary calculator pages
 */

export type CountryCode = 'US' | 'DE' | 'UK' | 'PL' | 'FR' | 'ES' | 'IT' | 'SE' | 'PT';

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
  PL: {
    code: 'PL',
    name: 'Poland',
    displayName: 'Poland',
    currency: 'PLN',
    flag: '🇵🇱',
    title: 'Poland Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Estimate your Poland net salary for 2026. Free calculator shows PIT, ZUS social and health contributions, and take-home pay from your gross income.',
    taxExplanation: `Poland operates a progressive personal income tax system known as PIT (podatek dochodowy od osob fizycznych), layered on top of mandatory social and health contributions collected through ZUS, the national social insurance institution. For most employees working under an employment contract (umowa o prace), the journey from a gross salary (brutto) to take-home pay (netto) involves several deductions that happen in a specific order. Understanding that order is the key to seeing why your net income is lower than your headline gross figure, and it is exactly what this calculator models for the 2026 tax year.

Income tax in Poland uses two brackets. There is a tax-free amount, the kwota wolna, of 30,000 PLN per year, meaning the first portion of your income effectively carries no tax. Above that threshold, a rate of 12 percent applies to the tax base up to 120,000 PLN. Any portion of the tax base above 120,000 PLN is taxed at the higher rate of 32 percent. Because only the amount over each threshold is taxed at the higher figure, moving into the upper bracket does not penalize your entire salary; it affects only the income above the cut-off point.

Before income tax is even calculated, employee ZUS social contributions are deducted from gross pay. These cover three areas: the pension contribution (emerytalne) at 9.76 percent, the disability contribution (rentowe) at 1.5 percent, and the sickness contribution (chorobowe) at 2.45 percent. An important feature is that these social contributions are tax-deductible, so they reduce the base on which your income tax is computed. The pension and disability contributions are also subject to an annual cap, applied once your cumulative gross income reaches roughly 260,190 PLN, after which those two contributions stop for the remainder of the year.

Alongside social contributions sits the health insurance contribution (skladka zdrowotna) at 9 percent. This one behaves differently. Since 2022, the health contribution is no longer tax-deductible, which means it reduces your take-home pay without lowering your income tax base. For simplicity, this calculator computes the health contribution on your gross figure, which gives a clear and consistent estimate, though individual circumstances can produce small variations from the exact amount on a payslip.

In practice, you rarely pay all of this in one lump sum. Employers act as withholding agents, deducting ZUS contributions and an income tax advance (zaliczka) from each paycheck and remitting them to the authorities on your behalf. This pay-as-you-earn approach spreads your tax across the year. After the year ends, employees file an annual return, the PIT-37, which reconciles the advances already paid against the actual tax owed. Depending on your situation, this reconciliation can result in a refund or an additional amount due.

This calculator is built for general workers, job seekers comparing offers, and anyone who wants a quick sense of how a gross salary translates into money in their pocket. By entering a gross figure, you can see an estimated breakdown of social contributions, the health contribution, income tax, and the resulting net amount. It assumes a single taxpayer under standard rules and does not model joint filing with a spouse, special reliefs, allowances for young workers, or other individualized adjustments that could change the final outcome.

Because of those simplifying assumptions, the numbers you see should be treated as estimates rather than an exact statement of your tax position. The figures here reflect the rules and thresholds for the 2026 tax year, and Polish tax rates, contribution percentages, and thresholds are reviewed and can change from one year to the next. Your real result may differ based on contract type, reliefs you qualify for, and other personal factors. For an exact figure on an important decision, or if your situation involves anything beyond a standard single-taxpayer employment arrangement, it is wise to consult a qualified tax professional or accountant who can review your specific circumstances.`,
    exampleGross: 90000,
    exampleMode: 'yearly',
  },
  FR: {
    code: 'FR',
    name: 'France',
    displayName: 'France',
    currency: 'EUR',
    flag: '🇫🇷',
    title: 'France Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Estimate your France net salary for 2026. Free calculator applies the income tax bareme, social contributions, CSG and CRDS to show take-home pay.',
    taxExplanation: `France operates a comprehensive system of income tax and social contributions that together determine how much of your gross salary you take home. The two main components are the income tax (impot sur le revenu) and a set of mandatory social contributions deducted directly from your pay. Understanding how these fit together helps you estimate your net income and plan your finances, whether you are comparing job offers, negotiating a salary, or simply trying to understand your payslip. The figures below reflect the 2026 tax year and apply to a single person.

The income tax follows a progressive scale known as the bareme, meaning different portions of your income are taxed at different rates. For a single person counted as one part, the first roughly 11,497 EUR of taxable income is taxed at 0 percent. Income between about 11,497 and 29,315 EUR is taxed at 11 percent, the band from about 29,315 to 83,823 EUR at 30 percent, the band from about 83,823 to 180,294 EUR at 41 percent, and anything above about 180,294 EUR at 45 percent. A common misunderstanding is that moving into a higher band taxes all of your income at the higher rate. In reality, only the portion of income that falls within each band is taxed at that band's rate, so your overall effective rate is always lower than the top rate that applies to you.

Before income tax is calculated, employees pay social contributions that fund social security, healthcare, and pensions. These contributions total roughly 21 to 22 percent of gross salary. A first group, covering social security and pension contributions, amounts to about 11.31 percent and is deducted before income tax is assessed. On top of this sit two specific levies: the CSG (contribution sociale generalisee) at 9.2 percent and the CRDS (contribution au remboursement de la dette sociale) at 0.5 percent. These two are broad social levies applied to earned income and are an important part of the gap between gross and net pay.

The treatment of these contributions for income tax purposes varies. Of the 9.2 percent CSG, 6.8 percentage points are deductible, meaning that portion reduces the income on which your income tax is calculated, while the remaining 2.4 percentage points are not deductible. The 0.5 percent CRDS is not deductible. The social security and pension contributions of about 11.31 percent are deducted before income tax. These distinctions matter because deductible contributions lower your taxable base, which in turn lowers the income tax you ultimately owe.

Since 2019, income tax in France is collected through withholding at source, known as the prelevement a la source (PAS). This means your employer deducts an estimated amount of income tax from each paycheck based on a rate provided by the tax authorities, so tax is paid gradually throughout the year rather than in a lump sum. Withholding at source does not replace the annual income tax return. You still file a declaration each year, which reconciles the amounts withheld against what you actually owe, accounting for your full circumstances. This can result in either a refund or an additional payment.

Our calculator is designed to give you a quick, simplified estimate rather than a precise tax assessment. It assumes a single person counted as one part and applies the bareme and social contribution rates described above. To keep things straightforward, it excludes two important features of the real system. First, it does not apply the standard 10 percent deduction for professional expenses, which normally reduces taxable salary income for most employees. Second, it does not use the family quotient, or parts system, which adjusts taxable income based on household composition such as a spouse or dependent children. Both of these features generally reduce the amount of income tax due in real life.

Because of these simplifications, your actual income tax may be lower than the estimate this calculator produces, particularly once the 10 percent deduction and any family parts are taken into account. The estimate is most useful as a rough guide to the scale of taxes and contributions on a given salary, and for comparing salaries against one another on a consistent basis. Please treat all results as estimates for educational purposes only. Tax bands, contribution rates, and the rules governing deductions are reviewed and can change every year, and individual situations vary widely. For decisions that depend on precise figures, or for guidance on your specific circumstances, consult a qualified tax professional or the official French tax administration.`,
    exampleGross: 45000,
    exampleMode: 'yearly',
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    displayName: 'Spain',
    currency: 'EUR',
    flag: '🇪🇸',
    title: 'Spain Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Estimate your 2026 net salary in Spain. Free calculator covering IRPF income tax bands, Social Security contributions, and regional rate variation.',
    taxExplanation: `Spain taxes the income of its residents through the Impuesto sobre la Renta de las Personas Fisicas, commonly known as IRPF. For most employees, the largest deductions from a gross salary are this personal income tax and mandatory Social Security contributions. Your employer typically handles both, withholding amounts from each paycheck throughout the year and forwarding them to the tax authorities and the Social Security system. The figures below describe a simplified, representative picture for the 2026 tax year and are intended to help you estimate your take-home pay, not to replace official calculations.

One feature that makes the Spanish system distinctive is that IRPF is shared between the central state and the autonomous communities. Each region sets part of the scale, so the exact rates you pay depend on where you live. Because of this, our calculator uses a representative combined scale rather than any single region's figures. Under that representative scale, income is taxed at 19 percent up to 12,450 euros, 24 percent on the portion from 12,450 to 20,200 euros, 30 percent from 20,200 to 35,200 euros, 37 percent from 35,200 to 60,000 euros, 45 percent from 60,000 to 300,000 euros, and 47 percent on anything above 300,000 euros. The system is progressive, so each rate applies only to the income that falls within its band, not to your whole salary.

The system also recognizes a personal minimum, an amount of income considered necessary for basic living and broadly treated as tax-free. In our representative model this personal minimum is about 5,550 euros. In practice it works as a reduction that lowers the tax due on your lowest income, which helps keep the effective tax rate on modest salaries below the headline percentages in the scale.

Beyond income tax, employees in Spain pay Social Security contributions that fund pensions, healthcare, unemployment benefits, and related programs. These contributions total roughly 6.48 percent of your contribution base. That figure is made up of common contingencies at 4.7 percent, unemployment at 1.55 percent, vocational training at 0.1 percent, and the MEI solidarity contribution at 0.13 percent. There is an upper limit: contributions are calculated only up to the maximum contribution base, which is about 59,059 euros per year. Earnings above that ceiling do not increase your Social Security contributions, although they remain fully subject to income tax.

The order in which these are applied matters for your final result. Social Security contributions are deducted before income tax is calculated, so they reduce the income on which IRPF is assessed. This is why the two amounts are not simply added together. After subtracting Social Security contributions and applying the personal minimum, the progressive IRPF scale is applied to what remains, and the result is the income tax portion of your deductions.

Throughout the year, your employer applies withholdings, known as retenciones, on account of your IRPF. These are advance payments toward your eventual tax bill, estimated from your salary and personal circumstances. Because they are only estimates, most workers later file an annual income tax return, the declaracion de la Renta, usually in the spring following the tax year. This return reconciles what was withheld against what you actually owe. If too much was withheld you may receive a refund, and if too little was withheld you may need to pay the difference.

It is worth repeating that regional rates vary across Spain's autonomous communities. Two people earning identical salaries can end up with different net pay simply because they live in different regions, and some regions also offer their own deductions and adjustments. Our calculator assumes a single taxpayer using a representative combined scale, so it cannot reflect every regional rule, family situation, or special deduction that might apply to you. For all of these reasons, the numbers our calculator produces are estimates for the 2026 tax year, not exact figures. Tax rates, contribution bases, and the personal minimum can change from year to year, and your real outcome depends on your region and personal circumstances. Use these results as a helpful starting point for planning, and consult a qualified tax professional or the official tax agency for guidance specific to your situation.`,
    exampleGross: 30000,
    exampleMode: 'yearly',
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    displayName: 'Italy',
    currency: 'EUR',
    flag: '🇮🇹',
    title: 'Italy Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Estimate your Italy net salary for 2026. Free calculator using IRPEF brackets, INPS contributions, and local surtaxes to estimate your take-home pay.',
    taxExplanation: `Italy taxes the income of resident workers through a national personal income tax called IRPEF (Imposta sul Reddito delle Persone Fisiche), layered with smaller local surtaxes and reduced by social security contributions and a set of tax credits. For most employees, the tax is calculated on annual gross salary, with pension contributions removed first and then progressive rates applied to what remains. The figures below reflect the 2026 tax year and are intended as general, educational information to help you understand roughly how your gross pay becomes net pay. They are estimates only, and your actual result will depend on your specific circumstances.

IRPEF is progressive, meaning higher portions of income are taxed at higher rates while lower portions keep their lower rates. For 2026, our calculator applies three brackets: 23 percent on taxable income up to 28,000 EUR, 35 percent on the portion between 28,000 and 50,000 EUR, and 43 percent on any income above 50,000 EUR. Only the slice of income within each band is taxed at that band's rate, so moving into a higher bracket does not raise the rate on the income you already earned in the lower bands.

On top of national IRPEF, Italy adds two local surtaxes: a regional surtax (addizionale regionale) set by each region and a municipal surtax (addizionale comunale) set by each city or town. These vary noticeably depending on where you live, so a worker in one municipality may pay a different combined local rate than someone with identical income elsewhere. Because our calculator cannot know your exact address, it approximates these two surtaxes together at roughly 2.5 percent of taxable income. Your real local rates could be higher or lower.

Italian employees also benefit from tax credits known as detrazioni, which reduce the tax owed and effectively create a no-tax area for lower earners. In practice, this means people below a certain income level may owe little or no IRPEF once their credits are applied. The detrazioni depend on income level and personal factors, so they differ from one worker to another. Our calculator approximates this benefit with a simplified no-tax allowance rather than modeling every credit individually, which keeps the estimate straightforward while still reflecting the general relief lower earners receive.

Before income tax is calculated, employees pay social security contributions to INPS, the national pension and welfare institute. The employee share is approximately 9.19 percent of gross salary and is deducted before IRPEF is applied, so it lowers the taxable base. These contributions apply up to a contribution ceiling of roughly 120,607 EUR; income above that ceiling is generally not subject to the additional pension contribution. Because INPS is removed first, it reduces both your take-home pay and the amount of income that IRPEF and the local surtaxes are charged on.

Most Italian employees do not pay tax directly to the authorities during the year. Instead, the employer acts as a withholding agent (sostituto d'imposta), deducting IRPEF, the local surtaxes, and INPS contributions from each paycheck and forwarding them on the worker's behalf. After the year ends, many workers file an annual return, typically the Modello 730 or the Redditi form, to reconcile what was withheld with what is actually owed, claim additional credits, and receive a refund or settle any balance.

Keep in mind that regional and municipal surtaxes, detrazioni, and individual circumstances all affect the final number, and our tool is a simplified estimate built for a single employee. Tax brackets, contribution ceilings, and local rates can change from year to year, and the 2026 figures used here are approximations. For decisions that depend on precise amounts, or to understand how your specific situation is treated, consult a qualified tax professional or commercialista.`,
    exampleGross: 35000,
    exampleMode: 'yearly',
  },
  SE: {
    code: 'SE',
    name: 'Sweden',
    displayName: 'Sweden',
    currency: 'SEK',
    flag: '🇸🇪',
    title: 'Sweden Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Estimate your Sweden net salary for 2026. Free calculator showing municipal and state income tax take-home pay from gross wages in Swedish krona (SEK).',
    taxExplanation: `Sweden's income tax system is built primarily around local taxation, which makes it somewhat different from many other countries. The largest portion of the tax that most workers pay is municipal income tax, collected by the municipality (kommun) and region where you live. On top of this, a separate state income tax applies only to higher earners. Because the system relies on where you live rather than a single national rate, the amount of tax you pay on the same salary can differ depending on your municipality. Our calculator uses an average municipal rate to give you a reasonable estimate of your net, take-home pay for the 2026 tax year.

Municipal income tax is the main tax for ordinary earners. It averages roughly 32 percent, though the exact figure varies from one municipality to another. This tax does not apply to your entire gross salary. First, a basic allowance known as the grundavdrag is subtracted, and only the income above that allowance is taxed. The grundavdrag is calculated on a sliding scale in reality, but our calculator applies a simplified version of it. As a result, the effective rate you pay on your full salary is somewhat lower than the headline municipal percentage, especially at lower income levels where the allowance has a larger proportional effect.

State income tax is an additional layer that only affects higher incomes. It is charged at a flat 20 percent, but only on the portion of your taxable income that exceeds a national breakpoint, which is about 625,800 SEK for 2025. If your income falls below this threshold, you pay no state income tax at all and only municipal tax applies. If you earn above it, the 20 percent rate applies solely to the amount over the breakpoint, not to your whole salary. This means most workers in Sweden are taxed only at the municipal level, and the state tax becomes relevant primarily for those with above-average earnings.

Employees in Sweden also pay a public pension contribution, the allman pensionsavgift, set at 7 percent of earned income. At first glance this looks like a significant deduction, but in practice it is offset almost entirely by a matching tax reduction granted on the same amount. Because the contribution and the corresponding tax credit cancel each other out for most people, the pension fee has little to no net effect on take-home pay. For this reason our calculator does not display it as a separate deduction, since showing it would distort the picture of what you actually keep.

A point that often surprises people comparing Sweden to other countries is the treatment of social security contributions. Sweden has large social security charges, employer contributions of roughly 31.42 percent, but these are paid by the employer on top of your gross salary. They are not withheld from your pay and do not reduce the amount that lands in your bank account. Because of this, our calculator shows no employee social contributions in your deductions. Your gross salary is the agreed figure, and these employer costs sit outside it rather than coming out of it.

Throughout the year, your employer handles tax collection through a withholding system. Each month they deduct preliminary tax, known as A-skatt, based on tax tables and an estimate of your annual income, and pay it to the Swedish Tax Agency, Skatteverket. Because this is only a preliminary estimate, an annual reconciliation takes place after the year ends. You file or confirm a tax return, and Skatteverket compares the tax actually owed against what was withheld. If too much was deducted, you receive a refund; if too little, you make an additional payment.

It is worth repeating that the municipal rate varies by where you live, and the average we use will not exactly match your own municipality. Combined with our simplified basic allowance, this means the numbers you see here are estimates rather than exact figures. They are intended to give you a clear, realistic sense of your net income, not a precise tax statement. Tax rates, breakpoints, allowances, and rules change from year to year, and individual circumstances such as deductions, benefits, and personal credits can affect your real outcome. For advice tailored to your situation, consult a qualified tax professional or refer to Skatteverket.`,
    exampleGross: 500000,
    exampleMode: 'yearly',
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    displayName: 'Portugal',
    currency: 'EUR',
    flag: '🇵🇹',
    title: 'Portugal Salary Tax Calculator 2026 - Calculate Your Net Income',
    description: 'Estimate your net salary in mainland Portugal for 2026. Free calculator covering IRS income tax brackets and 11% social security to show your take-home pay.',
    taxExplanation: `Portugal taxes the income of its residents through a personal income tax known as IRS (Imposto sobre o Rendimento das Pessoas Singulares). For most employed workers on mainland Portugal, the amount you take home each month depends on two main charges: the IRS itself and a contribution to the social security system. Together these reduce your gross salary to your net, or take-home, pay. The figures shown by this calculator are simplified estimates for the 2026 tax year and are intended to help you understand roughly how your salary breaks down, not to serve as an official assessment.

IRS in mainland Portugal is a progressive tax, which means the rate climbs in steps as your income rises. The lowest band is taxed at 13 percent, and the rates increase through several brackets up to a top rate of 48 percent that applies to income above roughly 83,696 EUR. A common point of confusion is the belief that moving into a higher bracket taxes all of your income at that higher rate. In practice, only the portion of your income that falls within each band is taxed at that band's rate, so the higher rates apply only to the slice of earnings above each threshold, not to your entire salary.

Before the brackets are applied, your employment income is reduced by a standard specific deduction of about 4,104 EUR. This is an automatic allowance that lowers the amount of income subject to tax. If the social security contributions you actually paid during the year are higher than this standard amount, the larger figure is used instead, so the deduction reflects whichever is more favorable in that comparison. This is one of the main mechanisms that reduces your taxable base before the progressive rates take effect.

Separately from IRS, employees pay into Seguranca Social, the Portuguese social security system. For workers this contribution is a flat 11 percent of gross earnings, and unlike some other countries there is no upper ceiling, so the 11 percent applies across the whole salary regardless of how high it is. This contribution funds benefits such as pensions, sickness, and unemployment support, and it is deducted in addition to the IRS withheld from your pay.

In practice, most of the tax you owe is collected gradually throughout the year rather than in one lump sum. Employers operate a withholding system known as retencao na fonte, deducting an estimated amount of IRS from each monthly paycheck and passing it to the tax authority on your behalf. Because this is only an estimate based on tables, the monthly withholding may not exactly match your final liability. Each year workers then file an annual IRS return that reconciles the tax actually due against what was withheld, which can result in either a refund or an additional payment.

It is important to note that this calculator estimates tax for mainland Portugal only. The autonomous regions of the Azores and Madeira apply their own, generally lower, regional IRS rates, which are not reflected in our mainland figures. If you live or work in one of these regions, your actual IRS could be lower than the estimate shown here, so the mainland numbers should be treated as a general guide rather than a precise figure for those areas.

This tool is built as a simplified estimate for a single mainland taxpayer. It does not account for the many personal circumstances that can change a real tax bill, such as family situation, dependents, additional itemized deductions, other sources of income, or specific regional and special regimes. Tax rates, brackets, deductions, and contribution rules in Portugal can change from one year to the next, and the values used here are estimates for the 2026 tax year. This content is educational information only and is not tax, legal, or accounting advice. For decisions about your own situation, or for an accurate calculation, consult a qualified professional or the official Portuguese tax authority.`,
    exampleGross: 25000,
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

