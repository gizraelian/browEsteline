import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, "..", "site");

const base = (process.env.SITE_BASE || "https://www.esteline.ca").replace(/\/$/, "");
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

const USER_AGENT = "BrowEsteline-ProductionVerifier/1.0 (+https://www.esteline.ca)";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPaced(url, options = {}) {
  await sleep(200);
  const headers = {
    "User-Agent": USER_AGENT,
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function normalizeLineEndings(str) {
  return str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function isHostingChallenge(html) {
  if (!html || typeof html !== "string") return false;
  const title = match(html, /<title[^>]*>([^<]+)<\/title>/i);
  const hasOneMomentTitle = /One moment,\s*please/i.test(title);
  const hasReload = /location\.(?:reload|replace)\s*\(|<meta[^>]+http-equiv=["']?refresh["']?/i.test(html);
  const hasChallengeMarkers = /imunify360|i360|challenge-platform|_challenge_|protected by|checking your browser/i.test(html);
  return hasOneMomentTitle || (hasChallengeMarkers && hasReload);
}

const FORBIDDEN_WORDS = [
  { label: "original site", pattern: /\boriginal(?:\s+[\w&'-]+){0,3}\s+site\b/i },
  { label: "new site", pattern: /\bnew\s+site\b/i },
  { label: "AngularJS", pattern: /\bangularjs\b/i },
  { label: "static rebuild", pattern: /\bstatic\s+rebuild\b/i },
  { label: "migration", pattern: /\bmigrations?\b/i },
  { label: "production media library", pattern: /\bproduction\s+media\s+library\b/i },
  { label: "stock imagery", pattern: /\bstock(?:\s+(?:photos?|images?|imagery))?\b/i },
  { label: "AI-generated", pattern: /\bai[- ]generated\b/i },
  { label: "tracking disabled", pattern: /\btracking\s+disabled\b/i },
  { label: "developer notes", pattern: /\bdeveloper\s+notes?\b/i },
  { label: "reconfirmation notes", pattern: /\breconfirmation\s+notes?\b/i },
];

function checkCustomerVisibleWording(html) {
  const visible = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const attributes = [];
  for (const m of visible.matchAll(/\b(?:alt|aria-label|title)=["']([^"']+)["']/gi)) {
    attributes.push(m[1]);
  }
  const textContent = visible.replace(/<[^>]+>/g, " ");
  const combined = `${textContent} ${attributes.join(" ")}`;
  const matches = [];
  for (const { label, pattern } of FORBIDDEN_WORDS) {
    if (pattern.test(combined)) {
      matches.push(label);
    }
  }
  return matches;
}

const failures = [];
const resources = new Set();

async function compareToLocal(remoteText, relPath, label) {
  const localPath = path.join(siteDir, relPath);
  try {
    const localText = await fs.readFile(localPath, "utf8");
    if (normalizeLineEndings(remoteText) !== normalizeLineEndings(localText)) {
      failures.push(`${label}: drift detected between production and local site/${relPath.replace(/\\/g, "/")}`);
      return false;
    }
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      failures.push(`${label}: local file site/${relPath.replace(/\\/g, "/")} not found`);
    } else {
      failures.push(`${label}: failed reading local site/${relPath.replace(/\\/g, "/")}: ${err.message}`);
    }
    return false;
  }
}

// Canonical alternate bare / non-www host redirect verification
const baseParsed = new URL(base);
const isWww = baseParsed.hostname.startsWith("www.");
const altHostname = isWww
  ? baseParsed.hostname.replace(/^www\./, "")
  : `www.${baseParsed.hostname}`;
const isIpOrLocal =
  baseParsed.hostname === "localhost" ||
  baseParsed.hostname === "127.0.0.1" ||
  /^(\d{1,3}\.){3}\d{1,3}$/.test(baseParsed.hostname);

if (!isIpOrLocal) {
  const altBaseUrl = `${baseParsed.protocol}//${altHostname}${baseParsed.port ? `:${baseParsed.port}` : ""}/`;
  let currentUrl = altBaseUrl;
  let hops = 0;
  let redirectedToCanonical = false;

  while (hops < 5) {
    let res;
    try {
      res = await fetchPaced(currentUrl, { redirect: "manual" });
    } catch (err) {
      failures.push(`alternate host (${altHostname}): request failed: ${err.message}`);
      break;
    }

    if (res.status === 200) {
      const currentHost = new URL(currentUrl).hostname;
      if (currentHost === altHostname) {
        const body = await res.text();
        if (isHostingChallenge(body)) {
          failures.push(`alternate host ${altHostname}: hosting challenge encountered (HTTP 200 masquerade)`);
        } else {
          failures.push(`alternate host ${altHostname} returned HTTP 200 instead of redirecting to ${baseParsed.hostname}`);
        }
      }
      break;
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        failures.push(`alternate host ${altHostname} returned HTTP ${res.status} without Location header`);
        break;
      }
      const target = new URL(location, currentUrl);
      if (target.hostname === baseParsed.hostname && target.protocol === baseParsed.protocol) {
        redirectedToCanonical = true;
        break;
      }
      currentUrl = target.href;
      hops++;
    } else {
      failures.push(`alternate host ${altHostname} returned unexpected HTTP ${res.status}`);
      break;
    }
  }

  if (!redirectedToCanonical && !failures.some((f) => f.includes(altHostname))) {
    failures.push(`alternate host ${altHostname} did not redirect to expected canonical hostname ${baseParsed.hostname}`);
  }
  console.log(`HOST REDIRECT ${altHostname} -> ${redirectedToCanonical ? baseParsed.hostname : "FAILED"}`);
}

// Deliberately nonexistent path check (genuine 404 vs false 200 / challenge)
const nonexistentPath = "/_deliberately_nonexistent_404_check";
let nonexistentResponse;
let nonexistentHtml = "";
try {
  nonexistentResponse = await fetchPaced(`${base}${nonexistentPath}`);
  nonexistentHtml = await nonexistentResponse.text();
} catch (err) {
  failures.push(`nonexistent path ${nonexistentPath}: request failed: ${err.message}`);
}

if (nonexistentResponse) {
  if (nonexistentResponse.status === 404) {
    console.log(`NONEXISTENT 404 ${nonexistentPath}`);
  } else if (nonexistentResponse.status === 200) {
    if (isHostingChallenge(nonexistentHtml)) {
      failures.push(`nonexistent path ${nonexistentPath}: received hosting challenge (HTTP 200 masquerade) instead of genuine 404`);
    } else {
      failures.push(`nonexistent path ${nonexistentPath}: received false HTTP 200 instead of genuine 404`);
    }
    console.log(`NONEXISTENT ${nonexistentResponse.status} ${nonexistentPath} [UNEXPECTED 200]`);
  } else {
    failures.push(`nonexistent path ${nonexistentPath}: expected HTTP 404, received HTTP ${nonexistentResponse.status}`);
    console.log(`NONEXISTENT ${nonexistentResponse.status} ${nonexistentPath}`);
  }
}

// Page verification loop
for (const path of paths) {
  let response;
  let html;
  try {
    response = await fetchPaced(`${base}${path}`);
    html = await response.text();
  } catch (err) {
    failures.push(`${path}: request failed: ${err.message}`);
    continue;
  }

  console.log(`PAGE ${response.status} ${path}`);

  if (response.status !== 200) {
    failures.push(`${path}: HTTP ${response.status}`);
    continue;
  }

  if (isHostingChallenge(html)) {
    failures.push(`${path}: hosting challenge encountered (HTTP 200 masquerading as content)`);
    continue;
  }

  const responseHostname = new URL(response.url).hostname;
  if (responseHostname !== baseParsed.hostname) {
    failures.push(`${path}: final response hostname ${responseHostname} does not match expected canonical hostname ${baseParsed.hostname}`);
  }

  const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const description = match(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

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

  const forbiddenWords = checkCustomerVisibleWording(html);
  if (forbiddenWords.length > 0) {
    failures.push(`${path}: contains customer-visible developer/migration wording (${forbiddenWords.join(", ")})`);
  }

  const localPageFile = path === "/" ? "index.html" : `${path.replace(/^\//, "")}index.html`;
  await compareToLocal(html, localPageFile, path);

  for (const item of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/gi)) {
    const url = new URL(item[1], `${base}${path}`);
    if (url.origin === base && !paths.includes(url.pathname) && url.pathname !== "/") {
      resources.add(url.href);
    }
  }
}

// Resource verification loop
for (const url of resources) {
  let response;
  try {
    response = await fetchPaced(url);
  } catch (err) {
    failures.push(`resource request failed: ${url} (${err.message})`);
    continue;
  }

  if (!response.ok) {
    failures.push(`resource HTTP ${response.status}: ${url}`);
    continue;
  }

  const parsed = new URL(url);
  const pathname = parsed.pathname;
  if (/\.(css|js)$/i.test(pathname)) {
    const text = await response.text();
    if (isHostingChallenge(text)) {
      failures.push(`resource ${pathname}: hosting challenge encountered (HTTP 200 masquerade)`);
      continue;
    }
    const relPath = pathname.replace(/^\//, "");
    await compareToLocal(text, relPath, pathname);
  }
}

// robots.txt check
let robotsResponse;
let robots = "";
try {
  robotsResponse = await fetchPaced(`${base}/robots.txt`);
  robots = await robotsResponse.text();
} catch (err) {
  failures.push(`robots.txt request failed: ${err.message}`);
}
if (robotsResponse) {
  if (robotsResponse.status !== 200 || /disallow:\s*\//i.test(robots)) {
    failures.push("robots.txt blocks indexing or failed");
  }
  if (isHostingChallenge(robots)) {
    failures.push("robots.txt: hosting challenge encountered (HTTP 200 masquerade)");
  } else {
    await compareToLocal(robots, "robots.txt", "robots.txt");
  }
}

// sitemap.xml check
let sitemapResponse;
let sitemap = "";
try {
  sitemapResponse = await fetchPaced(`${base}/sitemap.xml`);
  sitemap = await sitemapResponse.text();
} catch (err) {
  failures.push(`sitemap.xml request failed: ${err.message}`);
}
if (sitemapResponse) {
  if (sitemapResponse.status !== 200) {
    failures.push(`sitemap.xml: HTTP ${sitemapResponse.status}`);
  }
  if (isHostingChallenge(sitemap)) {
    failures.push("sitemap.xml: hosting challenge encountered (HTTP 200 masquerade)");
  } else {
    for (const path of paths) {
      if (!sitemap.includes(`<loc>${base}${path}</loc>`)) failures.push(`sitemap missing ${path}`);
    }
    if (/_staging|localhost|127\.0\.0\.1/i.test(sitemap)) {
      failures.push("sitemap contains a staging or local URL");
    }
    await compareToLocal(sitemap, "sitemap.xml", "sitemap.xml");
  }
}

// tracking-config.js check
let trackingResponse;
let tracking = "";
try {
  trackingResponse = await fetchPaced(`${base}/assets/js/tracking-config.js`);
  tracking = await trackingResponse.text();
} catch (err) {
  failures.push(`tracking-config.js request failed: ${err.message}`);
}
if (trackingResponse) {
  if (isHostingChallenge(tracking)) {
    failures.push("tracking-config.js: hosting challenge encountered (HTTP 200 masquerade)");
  } else if (trackingResponse.status !== 200 || !/enabled:\s*false/.test(tracking)) {
    failures.push("tracking is not explicitly disabled");
  } else if (/G-[A-Z0-9]+|GTM-[A-Z0-9]+|fbq\s*\(\s*["']init/i.test(tracking)) {
    failures.push("tracking config contains a production-style ID/init call");
  }
  if (!isHostingChallenge(tracking)) {
    await compareToLocal(tracking, "assets/js/tracking-config.js", "tracking-config.js");
  }
}

console.log(`RESOURCES ${resources.size}`);
console.log(`ROBOTS ${robotsResponse?.status ?? "ERR"}`);
console.log(`SITEMAP ${sitemapResponse?.status ?? "ERR"}`);
console.log(`TRACKING ${trackingResponse?.status ?? "ERR"}`);

if (failures.length) {
  console.error("FAILURES");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS production verification");
}
