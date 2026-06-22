/**
 * Per-locale content overrides for the country calculator pages. English stays
 * in src/lib/countries.ts (metadata + taxExplanation) and src/lib/seo/faq.ts
 * (FAQs); these files only carry translations, deep-merged on top with fallback.
 *
 * Shape per locale:
 *   { [CODE]: { displayName, title, description, taxExplanation, faqs[] }, hub: { faqs[] } }
 */
import pl from './pl.json';
import es from './es.json';
import pt from './pt.json';
import fr from './fr.json';
import it from './it.json';
import de from './de.json';
import uk from './uk.json';
import sv from './sv.json';
import cs from './cs.json';
import el from './el.json';

export const countryOverrides: Record<string, Record<string, unknown>> = {
  pl,
  es,
  pt,
  fr,
  it,
  de,
  uk,
  sv,
  cs,
  el,
};
