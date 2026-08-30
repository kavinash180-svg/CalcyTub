#!/usr/bin/env node
/**
 * Build public/sitemap.xml AND public/robots.txt from the calculator +
 * category registry. Parses source files as text (no bundler needed).
 *
 * Usage:
 *   SITE_URL=https://calcytub.com node scripts/build-sitemap.mjs
 *   SITE_URL=https://calcytub.com BACKEND_URL=https://api.example.com node scripts/build-sitemap.mjs
 *
 * Falls back to https://calcytub.com if SITE_URL is not set. Set your real
 * production domain via SITE_URL before deployment.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW_SITE = process.env.SITE_URL || "https://calcytub.com";
const SITE = RAW_SITE.replace(/\/$/, "");
const BACKEND = process.env.BACKEND_URL || "";

function assertProductionUrl(url) {
  if (/localhost|127\.0\.0\.1|emergent(agent)?\.com|preview\./i.test(url)) {
    console.warn(
      `\n⚠  SITE_URL=${url}\n` +
      `   This looks like a development/preview URL. Set SITE_URL to your\n` +
      `   real production domain before publishing the sitemap.\n`
    );
  }
}

function slugsFromFile(file) {
  const txt = fs.readFileSync(file, "utf8");
  return [...txt.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}

function calcSlugs() {
  const dir = path.join(ROOT, "src/lib/calculators");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js") && f !== "index.js");
  const all = new Set();
  for (const f of files) slugsFromFile(path.join(dir, f)).forEach((s) => all.add(s));
  return [...all];
}

function catSlugs() {
  return slugsFromFile(path.join(ROOT, "src/lib/categories.js"));
}

async function fetchArticles() {
  if (!BACKEND) return [];
  try {
    const r = await fetch(`${BACKEND.replace(/\/$/, "")}/api/content/articles`);
    if (!r.ok) return [];
    return (await r.json()).map((a) => a.slug);
  } catch { return []; }
}

const urlEntry = (loc, priority = 0.6, changefreq = "weekly") =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>\n  </url>`;

function buildRobots() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "# Private / internal areas",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE}/sitemap.xml`,
    "",
  ].join("\n");
}

(async () => {
  assertProductionUrl(SITE);

  const calcs = calcSlugs();
  const cats = catSlugs();
  const articles = await fetchArticles();

  const seen = new Set();
  const pushOnce = (arr, entry, key) => { if (!seen.has(key)) { seen.add(key); arr.push(entry); } };

  const entries = [];
  pushOnce(entries, urlEntry("/", 1.0, "daily"), "/");
  pushOnce(entries, urlEntry("/calculators", 0.9, "weekly"), "/calculators");
  pushOnce(entries, urlEntry("/categories", 0.8, "weekly"), "/categories");
  pushOnce(entries, urlEntry("/compare", 0.7, "weekly"), "/compare");
  pushOnce(entries, urlEntry("/articles", 0.6, "weekly"), "/articles");
  pushOnce(entries, urlEntry("/about", 0.4, "monthly"), "/about");
  pushOnce(entries, urlEntry("/contact", 0.4, "monthly"), "/contact");
  cats.forEach((s) => pushOnce(entries, urlEntry(`/${s}`, 0.7, "weekly"), `/${s}`));
  calcs.forEach((s) => pushOnce(entries, urlEntry(`/${s}`, 0.8, "weekly"), `/${s}`));
  articles.forEach((s) => pushOnce(entries, urlEntry(`/articles/${s}`, 0.6, "weekly"), `/articles/${s}`));
  ["privacy", "terms", "disclaimer", "advertising", "editorial"].forEach((s) =>
    pushOnce(entries, urlEntry(`/legal/${s}`, 0.3, "yearly"), `/legal/${s}`)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml);
  fs.writeFileSync(path.join(ROOT, "public/robots.txt"), buildRobots());

  console.log(`✓ Wrote ${entries.length} URLs to public/sitemap.xml`);
  console.log(`✓ Wrote public/robots.txt with Sitemap: ${SITE}/sitemap.xml`);
  console.log(`  SITE_URL = ${SITE}`);
  if (BACKEND) console.log(`  BACKEND_URL = ${BACKEND} (${articles.length} articles included)`);
})().catch((e) => { console.error(e); process.exit(1); });
