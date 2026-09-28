import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('site');
const origin = 'https://www.esteline.ca';
const routes = [
  '/', '/services/', '/services/tattoo-removal/', '/services/permanent-makeup/',
  '/services/permanent-makeup/brows/', '/services/permanent-makeup/lips/',
  '/services/permanent-makeup/eyeliner/', '/services/permanent-makeup/areola-reconstruction/',
  '/services/permanent-makeup/scar-camouflage/', '/services/laser-hair-removal/men/',
  '/services/laser-hair-removal/women/', '/about/', '/contact/', '/booking-policy/', '/privacy/'
];
const failures = [];
const htmlByRoute = new Map();
const fileFor = route => resolve(root, route === '/' ? 'index.html' : `.${route}index.html`);
const localFileFor = pathname => resolve(root, `.${pathname}`);
const first = (html, pattern) => html.match(pattern)?.[1]?.trim() || '';

for (const route of routes) {
  const file = fileFor(route);
  if (!existsSync(file)) {
    failures.push(`${route}: missing index.html`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  htmlByRoute.set(route, html);
  const title = first(html, /<title>([^<]+)<\/title>/i);
  const description = first(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
  const canonical = first(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
  if (!title) failures.push(`${route}: missing title`);
  if (!description) failures.push(`${route}: missing meta description`);
  if (canonical !== `${origin}${route}`) failures.push(`${route}: incorrect canonical ${canonical || '(missing)'}`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) failures.push(`${route}: must contain exactly one H1`);
  if (/noindex/i.test(html)) failures.push(`${route}: contains noindex`);
  if ((html.match(/\/assets\/js\/tracking-config\.js\?v=20260928a/g) || []).length !== 1) failures.push(`${route}: must load the cache-busted tracking config exactly once`);
  if ((html.match(/\/assets\/js\/site\.js\?v=20260928a/g) || []).length !== 1) failures.push(`${route}: must load the cache-busted site script exactly once`);
  for (const block of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch { failures.push(`${route}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/gi)) {
    const value = match[1];
    if (!value.startsWith('/')) continue;
    const pathname = new URL(value, origin).pathname;
    if (routes.includes(pathname)) continue;
    if (!existsSync(localFileFor(pathname))) failures.push(`${route}: missing local target ${pathname}`);
  }
}

const combined = [...htmlByRoute.values(), readFileSync(resolve(root, 'assets/js/shell.js'), 'utf8')].join('\n');
const artifactPattern = /original site|previous site|current site|current-site|existing page|existing site|media library|production|migration|migrated|rebuild|rebuilt|AngularJS|static site|tracking disabled|until configured|reconfirm|confirm with Katherine|Katherine inputs|stock imagery|AI-generated|developer|placeholder/i;
if (artifactPattern.test(combined)) failures.push('customer-visible migration/developer wording remains');
if (/localhost|127\.0\.0\.1|C:\\Coding/i.test([...htmlByRoute.values()].join('\n'))) failures.push('public HTML contains a local development reference');

const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
if (/disallow:\s*\//i.test(robots)) failures.push('robots.txt blocks indexing');
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
for (const route of routes) if (!sitemap.includes(`<loc>${origin}${route}</loc>`)) failures.push(`sitemap missing ${route}`);
const tracking = readFileSync(resolve(root, 'assets/js/tracking-config.js'), 'utf8');
if (!/enabled:\s*true/.test(tracking)) failures.push('tracking is not explicitly enabled');
if (!/consentRequired:\s*true/.test(tracking)) failures.push('marketing consent is not required');
if (!/metaPixelId:\s*["']2588326998328560["']/.test(tracking)) failures.push('Meta Pixel ID is missing or incorrect');
if (!/googleMeasurementId:\s*["']["']/.test(tracking)) failures.push('Google Analytics must remain unconfigured');

const siteJs = readFileSync(resolve(root, 'assets/js/site.js'), 'utf8');
if ((siteJs.match(/fbq\('init'/g) || []).length !== 1) failures.push('Meta Pixel must have exactly one init path');
if ((siteJs.match(/fbq\('track', 'PageView'\)/g) || []).length !== 1) failures.push('Meta Pixel must have exactly one PageView path');
if (!/if \(!config\.consentRequired \|\| consent === 'accepted'\) loadTracking\(\)/.test(siteJs)) failures.push('tracking is not gated by stored consent');
if (!/fbq\('track', eventName, safeProperties\)/.test(siteJs)) failures.push('Meta events are not sent as standard events');
if (/facebook\.com\/tr\?/.test(combined)) failures.push('a noscript Meta pixel would bypass JavaScript consent');

if (failures.length) {
  console.error(`FAIL (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`PASS local verification: ${routes.length} pages, links/assets, SEO, JSON-LD, robots, sitemap, copy scan and consent-gated Meta tracking`);
}
