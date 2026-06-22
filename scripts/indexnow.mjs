#!/usr/bin/env node
/**
 * Submit the site's URLs to IndexNow (Bing, Yandex, Seznam, and other
 * participating search engines share the api.indexnow.org endpoint).
 *
 * It reads the live sitemap, extracts every <loc>, and POSTs the full list.
 * Re-run this after publishing/updating content so engines re-crawl promptly.
 *
 *   node scripts/indexnow.mjs
 *
 * Requires the key file to be live at:
 *   https://incometally.com/257f9f131c414b708b7e92e30b4f9e83.txt
 */

const HOST = 'incometally.com';
const KEY = '257f9f131c414b708b7e92e30b4f9e83';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function getUrlsFromSitemap() {
  const res = await fetch(SITEMAP, { headers: { 'User-Agent': 'IndexNow-submitter' } });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(locs)];
}

async function main() {
  const urlList = await getUrlsFromSitemap();
  if (urlList.length === 0) throw new Error('No URLs found in sitemap');
  console.log(`Submitting ${urlList.length} URLs to IndexNow (${ENDPOINT})...`);

  // IndexNow accepts up to 10,000 URLs per request; chunk defensively.
  const CHUNK = 10000;
  for (let i = 0; i < urlList.length; i += CHUNK) {
    const chunk = urlList.slice(i, i + CHUNK);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: chunk }),
    });
    const text = await res.text();
    console.log(`  -> ${res.status} ${res.statusText} ${text ? '· ' + text.slice(0, 200) : ''}`);
    if (res.status !== 200 && res.status !== 202) {
      console.error('IndexNow submission was not accepted. See status/reason above.');
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
