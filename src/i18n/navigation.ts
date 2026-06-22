import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation helpers. Use these instead of next/link and
 * next/navigation so links automatically point at the active locale
 * (and the default locale stays unprefixed).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
