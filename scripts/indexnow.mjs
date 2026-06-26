#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, … share api.indexnow.org).
 *
 * Modes:
 *   node scripts/indexnow.mjs --all
 *       Submit every URL in the live sitemap (full refresh / manual use).
 *   node scripts/indexnow.mjs --diff [<baseRef> <headRef>]
 *       Submit ONLY the URLs affected by the changed files in a deploy. Changed
 *       files come from `git diff --name-only <baseRef>..<headRef>` (defaults to
 *       HEAD~1..HEAD — i.e. the latest merge commit's changes). A change to a
 *       genuinely site-wide file (shared components, layout, chrome config,
 *       English source catalog, etc.) falls back to a full submit, since it
 *       affects every page.
 *
 * Requires the key file live at https://incometally.com/<KEY>.txt
 */
import { execSync } from 'node:child_process';

const HOST = 'incometally.com';
const KEY = '257f9f131c414b708b7e92e30b4f9e83';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const LOCALES = ['en', 'pl', 'es', 'pt', 'fr', 'it', 'de', 'uk', 'sv', 'cs', 'el'];
const STATIC_PATHS = ['/about-us', '/contact', '/privacy', '/terms'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getSitemapUrls() {
  const res = await fetch(SITEMAP, { headers: { 'User-Agent': 'IndexNow-submitter' } });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
}

/** Parse a full URL into { locale, path } using the as-needed prefix scheme. */
function parseUrl(url) {
  const pathname = url.replace(/^https?:\/\/[^/]+/, '') || '/';
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length && LOCALES.includes(segs[0]) && segs[0] !== 'en') {
    const rest = '/' + segs.slice(1).join('/');
    return { locale: segs[0], path: rest === '/' ? '/' : rest.replace(/\/$/, '') };
  }
  return { locale: 'en', path: pathname === '' ? '/' : pathname.replace(/\/$/, '') || '/' };
}

function isIgnored(f) {
  return (
    f.startsWith('.github/') ||
    f.startsWith('scripts/') ||
    f.startsWith('public/') ||
    f.startsWith('docs/') ||
    f.startsWith('tests/') ||
    f.includes('__tests__') ||
    f.endsWith('.md') ||
    f.endsWith('.test.ts') ||
    f.endsWith('.test.tsx') ||
    f.endsWith('.spec.ts') ||
    f === 'package-lock.json' ||
    f === '.gitignore' ||
    f.startsWith('.')
  );
}

function isGlobal(f) {
  return (
    f.startsWith('src/components/') ||
    f === 'src/app/[locale]/layout.tsx' ||
    f.startsWith('src/app/[locale]/opengraph-image') ||
    f.startsWith('src/app/globals') ||
    f.startsWith('src/i18n/') ||
    f.startsWith('src/lib/') ||
    f === 'src/config/site.ts' ||
    f === 'messages/en.json' ||
    f === 'src/app/sitemap.ts' ||
    f === 'src/middleware.ts' ||
    f === 'next.config.js' ||
    f.startsWith('tailwind') ||
    f.startsWith('postcss') ||
    f === 'package.json' ||
    f === 'tsconfig.json' ||
    f.startsWith('src/data/tax/')
  );
}

/** A predicate over { locale, path } for a changed file, 'GLOBAL', or null (ignore). */
function matcherFor(f) {
  if (isIgnored(f)) return null;
  if (isGlobal(f)) return 'GLOBAL';

  let m;
  if ((m = f.match(/^messages\/([a-z]{2})\.json$/))) {
    const loc = m[1];
    return loc === 'en' ? 'GLOBAL' : (p) => p.locale === loc;
  }
  if ((m = f.match(/^src\/content\/pages\/([a-z]{2})\.json$/))) {
    const loc = m[1];
    return (p) => p.locale === loc && STATIC_PATHS.includes(p.path);
  }
  if ((m = f.match(/^src\/content\/guides\/([a-z]{2})\.json$/))) {
    const loc = m[1];
    return (p) => p.locale === loc && p.path.startsWith('/guides');
  }
  if ((m = f.match(/^src\/content\/countries\/([a-z]{2})\.json$/))) {
    const loc = m[1];
    return (p) => p.locale === loc && (p.path === '/' || p.path.startsWith('/salary-calculator'));
  }
  if (f === 'src/config/privacy.ts') return (p) => p.path === '/privacy';
  if (f === 'src/config/terms.ts') return (p) => p.path === '/terms';
  if (f === 'src/data/guides.ts') return (p) => p.path.startsWith('/guides');
  if (f === 'src/data/pillars.ts') return (p) => p.path === '/' || p.path.startsWith('/guides');
  if (f === 'src/data/authors.ts') return (p) => p.path.startsWith('/guides');

  if (f === 'src/app/[locale]/page.tsx') return (p) => p.path === '/';
  if ((m = f.match(/^src\/app\/\[locale\]\/(.+)\/page\.tsx$/))) {
    const route = m[1];
    if (route.includes('[country]')) return (p) => p.path.startsWith('/salary-calculator/');
    if (route.includes('[slug]')) return (p) => p.path.startsWith('/guides/');
    const path = '/' + route;
    return (p) => p.path === path;
  }

  // Unknown source file → fall back to a full submit (safe for crawling).
  if (f.startsWith('src/')) return 'GLOBAL';
  return null;
}

function getChangedFiles(base, head) {
  // Allow an explicit override (handy for testing / custom CI wiring).
  if (process.env.CHANGED_FILES) {
    return process.env.CHANGED_FILES.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  }
  try {
    const range = base && head ? `${base} ${head}` : 'HEAD~1 HEAD';
    const out = execSync(`git diff --name-only ${range}`, { encoding: 'utf8' });
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    console.warn('git diff failed (' + e.message + '); falling back to full submit.');
    return null; // signal: submit all
  }
}

async function resolveUrls(args) {
  const all = await getSitemapUrls();
  const positional = args.filter((a) => !a.startsWith('--'));
  const mode = args.includes('--diff') ? 'diff' : 'all';
  if (mode === 'all') return { urls: all, reason: 'full sitemap' };

  const changed = getChangedFiles(positional[0], positional[1]);
  if (changed === null) return { urls: all, reason: 'git diff unavailable → full' };

  const considered = changed.map(matcherFor).filter((x) => x !== null);
  if (considered.length === 0) return { urls: [], reason: 'no content-affecting files changed' };
  if (considered.includes('GLOBAL')) return { urls: all, reason: 'site-wide change → full' };

  const predicates = considered; // all are functions here
  const urls = all.filter((u) => {
    const parsed = parseUrl(u);
    return predicates.some((fn) => fn(parsed));
  });
  return { urls, reason: `changed files: ${changed.join(', ')}` };
}

async function submitChunk(chunk) {
  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: chunk }),
    });
    const text = await res.text();
    console.log(`  -> ${res.status} ${res.statusText} ${text ? '· ' + text.slice(0, 200) : ''}`);
    if (res.status === 200 || res.status === 202) return;
    const transient = res.status === 429 || /SiteVerificationNotCompleted/i.test(text);
    if (transient && attempt < maxAttempts) {
      const wait = Math.min(60, 10 * attempt);
      console.log(`  (transient; retrying in ${wait}s — attempt ${attempt + 1}/${maxAttempts})`);
      await sleep(wait * 1000);
      continue;
    }
    console.error('IndexNow submission was not accepted. See status/reason above.');
    process.exitCode = 1;
    return;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const { urls, reason } = await resolveUrls(args);
  if (urls.length === 0) {
    console.log(`Nothing to submit (${reason}).`);
    return;
  }
  if (dryRun) {
    console.log(`[dry-run] would submit ${urls.length} URL(s) — ${reason}`);
    urls.slice(0, 20).forEach((u) => console.log('   ' + u));
    if (urls.length > 20) console.log(`   … and ${urls.length - 20} more`);
    return;
  }
  console.log(`Submitting ${urls.length} URL(s) to IndexNow — ${reason}`);
  const CHUNK = 10000;
  for (let i = 0; i < urls.length; i += CHUNK) {
    await submitChunk(urls.slice(i, i + CHUNK));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
