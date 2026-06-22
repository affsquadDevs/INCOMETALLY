/**
 * Maps an English social-contribution / line-item display name (as produced by
 * the tax calculation libraries and tax-data JSON) to a stable translation slug
 * used under the `calculator.contrib.<key>` message namespace.
 *
 * This is display-only: the calculation code still keys off the raw English
 * `contrib.name` strings, which are left untouched. Components use:
 *   t.has(`contrib.${contribKey(name)}`) ? t(`contrib.${contribKey(name)}`) : name
 * so a missing/unmapped name always falls back to the original English text.
 */
const CONTRIB_KEY_MAP: Record<string, string> = {
  // Germany
  'Health Insurance': 'healthInsurance',
  'Long-term Care Insurance': 'longTermCareInsurance',
  'Pension Insurance': 'pensionInsurance',
  'Unemployment Insurance': 'unemploymentInsurance',
  // United States
  'Social Security': 'socialSecurity',
  Medicare: 'medicare',
  'Additional Medicare Tax': 'additionalMedicareTax',
  'Self-Employment Tax (Social Security)': 'seTaxSocialSecurity',
  'Self-Employment Tax (Medicare)': 'seTaxMedicare',
  // United Kingdom
  'National Insurance (Class 1)': 'nationalInsuranceClass1',
  'National Insurance (Class 1, Higher)': 'nationalInsuranceClass1Higher',
  // Poland
  'Pension insurance (Emerytalne)': 'plPension',
  'Disability insurance (Rentowe)': 'plDisability',
  'Sickness insurance (Chorobowe)': 'plSickness',
  'Health insurance (Zdrowotne)': 'plHealth',
  // Portugal
  'Social Security (Seguranca Social)': 'ptSocialSecurity',
  // Sweden
  'Church fee (kyrkoavgift)': 'seChurchFee',
  // Italy
  'INPS pension contribution': 'itInps',
  'Regional & municipal surtax (addizionali)': 'itRegionalMunicipalSurtax',
  // Spain
  'Common contingencies (Seguridad Social)': 'esCommonContingencies',
  'MEI solidarity contribution': 'esMei',
  'Training (Formacion profesional)': 'esTraining',
  'Unemployment (Desempleo)': 'esUnemployment',
  'Social Security (Seguridad Social)': 'esSocialSecurity',
  // France
  'CSG (deductible)': 'frCsgDeductible',
  'CSG/CRDS (non-deductible)': 'frCsgCrdsNonDeductible',
  'Social security & pension contributions': 'frSocialSecurityPension',
  'Pension (vieillesse + Agirc-Arrco)': 'frPension',
  CSG: 'frCsg',
  CRDS: 'frCrds',
};

/**
 * Returns the stable slug for a contribution name, or a sanitized fallback
 * (which will simply miss the namespace and fall back to the English name).
 */
export function contribKey(name: string): string {
  return CONTRIB_KEY_MAP[name] ?? name.replace(/[^a-zA-Z0-9]+/g, '');
}
