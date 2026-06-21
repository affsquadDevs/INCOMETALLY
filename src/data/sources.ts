/**
 * Official data sources per country, shown in the "Data sources" box on each
 * country calculator page. Figures used by our calculators are checked against
 * these government / tax-authority sources. See docs/TAX_DATA_SOURCES.md.
 */

export interface DataSource {
  label: string;
  url: string;
}

export const countrySources: Record<string, DataSource[]> = {
  US: [
    {
      label: 'IRS — Federal income tax rates and brackets',
      url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets',
    },
    {
      label: 'IRS — Standard deduction',
      url: 'https://www.irs.gov/credits-deductions/individuals/standard-deduction',
    },
    {
      label: 'IRS — Tax Topic 751 (Social Security & Medicare withholding)',
      url: 'https://www.irs.gov/taxtopics/tc751',
    },
  ],
  DE: [
    {
      label: 'Bundesfinanzministerium (Federal Ministry of Finance)',
      url: 'https://www.bundesfinanzministerium.de',
    },
    {
      label: 'Bundeszentralamt für Steuern (Federal Central Tax Office)',
      url: 'https://www.bzst.de',
    },
  ],
  UK: [
    {
      label: 'GOV.UK — Income Tax rates and Personal Allowances',
      url: 'https://www.gov.uk/income-tax-rates',
    },
    {
      label: 'GOV.UK — National Insurance rates and categories',
      url: 'https://www.gov.uk/national-insurance-rates-letters',
    },
    {
      label: 'GOV.UK — Repaying your student loan',
      url: 'https://www.gov.uk/repaying-your-student-loan',
    },
  ],
  PL: [
    {
      label: 'podatki.gov.pl — PIT tax scale (Ministry of Finance)',
      url: 'https://www.podatki.gov.pl/pit/abc-pit/skala-podatkowa-pit/',
    },
    {
      label: 'podatki.gov.pl — Relief for the young (under 26)',
      url: 'https://www.podatki.gov.pl/ulgi-i-odliczenia/ulga-dla-mlodych-pit',
    },
    {
      label: 'biznes.gov.pl — ZUS social contribution rates',
      url: 'https://www.biznes.gov.pl/pl/portal/00274',
    },
  ],
  FR: [
    {
      label: "service-public.gouv.fr — Barème de l'impôt sur le revenu",
      url: 'https://www.service-public.gouv.fr/particuliers/actualites/A18045',
    },
    {
      label: 'service-public.gouv.fr — Quotient familial',
      url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2705',
    },
    {
      label: 'URSSAF — Plafond de la Sécurité sociale & cotisations',
      url: 'https://www.urssaf.fr/accueil/actualites/plafond-annuel-securite-sociale.html',
    },
  ],
  ES: [
    {
      label: 'Agencia Tributaria (AEAT) — IRPF state scale',
      url: 'https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-estatal.html',
    },
    {
      label: 'AEAT — Personal and family minimums',
      url: 'https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/cuadro-resumen-minimo-personal-familiar.html',
    },
    {
      label: 'Seguridad Social — Contribution bases and rates',
      url: 'https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537',
    },
  ],
  IT: [
    {
      label: 'Agenzia delle Entrate — IRPEF rates and calculation',
      url: 'https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef',
    },
    {
      label: 'MEF — Regional IRPEF surtax lookup',
      url: 'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/sceltaregione.htm',
    },
    {
      label: 'MEF — Municipal IRPEF surtax lookup',
      url: 'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/sceltaregione.htm',
    },
    {
      label: 'INPS — Contribution rates (circolari)',
      url: 'https://www.inps.it/it/it/inps-comunica/diritti-e-obblighi-in-materia-di-sicurezza-sociale-nell-unione-e/per-le-imprese/aliquote-contributive.html',
    },
  ],
  SE: [
    {
      label: 'Skatteverket — Amounts and percentages (income year)',
      url: 'https://www.skatteverket.se/privat/skatter/beloppochprocent/2026.4.1522bf3f19aea8075ba21.html',
    },
    {
      label: 'Skatteverket — Grundavdrag (basic allowance)',
      url: 'https://www.skatteverket.se/privat/skatter/arbeteochinkomst/askattsedelochskattetabeller/grundavdrag.4.6d02084411db6e252fe80009078.html',
    },
    {
      label: 'SCB — Municipal tax rates',
      url: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/offentlig-ekonomi/finanser-for-den-kommunala-sektorn/kommunalskatterna/',
    },
  ],
  PT: [
    {
      label: 'Portal das Finanças — CIRS Article 68 (IRS rates)',
      url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68.aspx',
    },
    {
      label: 'Portal das Finanças — CIRS Article 25 (specific deduction)',
      url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs25.aspx',
    },
    { label: 'Segurança Social — Contributions', url: 'https://www.seg-social.pt/contribuicoes' },
  ],
};

export function getCountrySources(countryCode: string): DataSource[] {
  return countrySources[countryCode.toUpperCase()] ?? [];
}
