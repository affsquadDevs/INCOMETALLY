/**
 * Per-locale guide translations. English lives in src/data/guides.ts; these
 * files carry translated { [slug]: { title, description, content, keywords,
 * sources, faqs } } overrides, deep-merged on top with fallback.
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

export const guideOverrides: Record<string, Record<string, unknown>> = {
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
