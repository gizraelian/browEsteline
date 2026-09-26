const base = "https://www.esteline.ca";
const paths = [
  "/",
  "/services/",
  "/services/tattoo-removal/",
  "/services/permanent-makeup/",
  "/services/permanent-makeup/brows/",
  "/services/permanent-makeup/lips/",
  "/services/permanent-makeup/eyeliner/",
  "/services/permanent-makeup/areola-reconstruction/",
  "/services/permanent-makeup/scar-camouflage/",
  "/services/laser-hair-removal/men/",
  "/services/laser-hair-removal/women/",
  "/about/",
  "/contact/",
  "/booking-policy/",
  "/privacy/",
];

const failures = [];
const resources = new Set();

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

for (const path of paths) {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const description = match(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (response.status !== 200) failures.push(`${path}: HTTP ${response.status}`);
  if (!title) failures.push(`${path}: missing title`);
  if (!description) failures.push(`${path}: missing meta description`);
  if (canonical !== `${base}${path}`) failures.push(`${path}: canonical ${canonical || "missing"}`);
  if (h1Count !== 1) failures.push(`${path}: ${h1Count} H1 elements`);
  if (/noindex/i.test(html)) failures.push(`${path}: contains noindex`);

  for (const script of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(script[1]);
    } catch {
      failures.push(`${path}: invalid JSON-LD`);
    }
  }

  for (const item of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/gi)) {
    const url = new URL(item[1], `${base}${path}`);
    if (url.origin === base && !paths.includes(url.pathname) && url.pathname !== "/") {
      resources.add(url.href);
    }
  }

  console.log(`PAGE ${response.status} ${path}`);
}

for (const url of resources) {
  const response = await fetch(url);
  if (!response.ok) failures.push(`resource HTTP ${response.status}: ${url}`);
}

const robotsResponse = await fetch(`${base}/robots.txt`);
const robots = await robotsResponse.text();
if (robotsResponse.status !== 200 || /disallow:\s*\//i.test(robots)) failures.push("robots.txt blocks indexing or failed");

const sitemapResponse = await fetch(`${base}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
if (sitemapResponse.status !== 200) failures.push(`sitemap.xml: HTTP ${sitemapResponse.status}`);
for (const path of paths) {
  if (!sitemap.includes(`<loc>${base}${path}</loc>`)) failures.push(`sitemap missing ${path}`);
}
if (/_staging|localhost|127\.0\.0\.1/i.test(sitemap)) failures.push("sitemap contains a staging or local URL");

const trackingResponse = await fetch(`${base}/assets/js/tracking-config.js`);
const tracking = await trackingResponse.text();
if (trackingResponse.status !== 200 || !/enabled:\s*false/.test(tracking)) failures.push("tracking is not explicitly disabled");
if (/G-[A-Z0-9]+|GTM-[A-Z0-9]+|fbq\s*\(\s*["']init/i.test(tracking)) failures.push("tracking config contains a production-style ID/init call");

console.log(`RESOURCES ${resources.size}`);
console.log(`ROBOTS ${robotsResponse.status}`);
console.log(`SITEMAP ${sitemapResponse.status}`);
console.log(`TRACKING ${trackingResponse.status} disabled`);

if (failures.length) {
  console.error("FAILURES");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS production verification");
}
