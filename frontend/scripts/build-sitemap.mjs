#!/usr/bin/env node
/**
 * Build public/sitemap.xml from the calculator + category registry.
 * Parses source files as text (no bundler needed).
 *
 * Usage:
 *   SITE_URL=https://calcytub.com node scripts/build-sitemap.mjs
 *   SITE_URL=https://calcytub.com BACKEND_URL=https://api.example.com node scripts/build-sitemap.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = (process.env.SITE_URL || "https://calcytub.com").replace(/\/$/, "");
const BACKEND = process.env.BACKEND_URL || "";

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

(async () => {
  const calcs = calcSlugs();
  const cats = catSlugs();
  const articles = await fetchArticles();
  const entries = [
    urlEntry("/", 1.0, "daily"),
    urlEntry("/calculators", 0.9, "weekly"),
    urlEntry("/categories", 0.8, "weekly"),
    urlEntry("/articles", 0.6, "weekly"),
    urlEntry("/about", 0.4, "monthly"),
    urlEntry("/contact", 0.4, "monthly"),
    ...cats.map((s) => urlEntry(`/${s}`, 0.7, "weekly")),
    ...calcs.map((s) => urlEntry(`/${s}`, 0.8, "weekly")),
    ...articles.map((s) => urlEntry(`/articles/${s}`, 0.6, "weekly")),
    ...["privacy", "terms", "disclaimer", "advertising", "editorial"].map((s) =>
      urlEntry(`/legal/${s}`, 0.3, "yearly")
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml);
  console.log(`Wrote ${entries.length} URLs to public/sitemap.xml (SITE=${SITE})`);
})().catch((e) => { console.error(e); process.exit(1); });
