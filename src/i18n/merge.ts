/**
 * Deep-merge a per-locale override on top of an English base. Translated keys
 * win; anything missing falls back to English. Arrays are replaced wholesale
 * when an override provides one (translators supply the full array).
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return override as T;
  }
  if (typeof override !== 'object' || Array.isArray(override)) {
    return override as T;
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    result[key] =
      b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b)
        ? deepMerge(b, o)
        : o;
  }
  return result as T;
}
