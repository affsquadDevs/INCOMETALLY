/**
 * Per-locale content overrides for the static pages (about / contact / privacy /
 * terms). English is NOT stored here — it stays in the source config files and
 * is the fallback. Each locale file may contain any subset of:
 *   { about, contact, privacy, terms }
 * matching the shape of the corresponding English config; missing keys fall back
 * to English via deepMerge.
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

export interface PageOverrides {
  about?: unknown;
  contact?: unknown;
  privacy?: unknown;
  terms?: unknown;
}

export const pageOverrides: Record<string, PageOverrides> = {
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
