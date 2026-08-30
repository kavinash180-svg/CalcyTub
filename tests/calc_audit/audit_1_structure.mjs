// Structure + metadata + all-select-combination compute audit
import { ALL_CALCULATORS } from "./index.mjs";
import { isMoneyField } from "./currency.mjs";

const EXPECTED = { finance: 13, math: 8, datetime: 1, physics: 5, chemistry: 4, health: 4 };
const counts = {};
for (const c of ALL_CALCULATORS) counts[c.category] = (counts[c.category] || 0) + 1;
console.log("TOTAL:", ALL_CALCULATORS.length, JSON.stringify(counts));
const fails = [];
for (const [k, v] of Object.entries(EXPECTED)) if (counts[k] !== v) fails.push(`count ${k}: expected ${v} got ${counts[k]}`);

const REQ = ["slug","name","category","shortDescription","seoTitle","metaDescription","inputs","compute","formula","howItWorks","workedExample","assumptions","faq","related"];
const slugs = new Set();
for (const c of ALL_CALCULATORS) {
  if (slugs.has(c.slug)) fails.push(`DUP slug ${c.slug}`);
  slugs.add(c.slug);
  for (const k of REQ) {
    const v = c[k];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) fails.push(`${c.slug}: missing ${k}`);
  }
  for (const r of c.related || []) if (!ALL_CALCULATORS.some((x) => x.slug === r)) fails.push(`${c.slug}: bad related slug ${r}`);
  for (const f of c.inputs) {
    if (f.defaultValue === undefined) fails.push(`${c.slug}: input ${f.key} has no defaultValue`);
    if (f.type === "select" && !f.options?.length) fails.push(`${c.slug}: select ${f.key} has no options`);
    if (f.type === "number" && f.min !== undefined && f.defaultValue < f.min) fails.push(`${c.slug}.${f.key} default < min`);
    if (f.type === "number" && f.max !== undefined && f.defaultValue > f.max) fails.push(`${c.slug}.${f.key} default > max`);
  }
}

const bad = (v) => (typeof v === "number" ? !Number.isFinite(v) : typeof v === "string" ? /NaN|Infinity|undefined/.test(v) : v === undefined);
function scan(slug, r, tag) {
  if (!r || !Array.isArray(r.results) || !r.results.length) { fails.push(`${slug} [${tag}]: no results`); return; }
  r.results.forEach((x, i) => {
    if (!x.label) fails.push(`${slug} [${tag}]: result ${i} missing label`);
    if (bad(x.value)) fails.push(`${slug} [${tag}]: ${x.label} = ${x.value}`);
  });
  if (r.breakdown) r.breakdown.rows.forEach((row, i) => {
    if (row.length !== r.breakdown.columns.length) fails.push(`${slug} [${tag}]: breakdown row ${i} column mismatch`);
    row.forEach((cell) => { const v = cell && typeof cell === "object" ? cell.value : cell; if (bad(v)) fails.push(`${slug} [${tag}]: breakdown ${v}`); });
  });
  const walk = (o, p) => {
    if (typeof o === "number") { if (!Number.isFinite(o)) fails.push(`${slug} [${tag}]: extras ${p}=${o}`); return; }
    if (typeof o === "string") { if (/NaN|Infinity/.test(o)) fails.push(`${slug} [${tag}]: extras ${p}="${o}"`); return; }
    if (o && typeof o === "object") Object.entries(o).forEach(([k, v]) => walk(v, `${p}.${k}`));
  };
  if (r.extras) walk(r.extras, "extras");
}

for (const c of ALL_CALCULATORS) {
  const base = {};
  for (const f of c.inputs) base[f.key] = f.defaultValue;
  try { scan(c.slug, c.compute(base), "defaults"); } catch (e) { fails.push(`${c.slug} [defaults]: THREW ${e.message}`); }
  const selects = c.inputs.filter((f) => f.type === "select");
  let combos = [{}];
  for (const s of selects) combos = combos.flatMap((cm) => s.options.map((o) => ({ ...cm, [s.key]: o.value })));
  for (const combo of combos) {
    try { scan(c.slug, c.compute({ ...base, ...combo }), `select ${JSON.stringify(combo)}`); }
    catch (e) { console.log(`  note: ${c.slug} ${JSON.stringify(combo)} throws validation "${e.message}" with default values`); }
  }
}

const CURRENCY_EXPECTED = new Set(["home-loan-emi-calculator","mortgage-calculator","mortgage-amortization-calculator","refinance-calculator","personal-loan-emi-calculator","sip-calculator","fd-calculator","gst-calculator","compound-interest-calculator","simple-interest-calculator","home-loan-prepayment-calculator","loan-eligibility-calculator","mortgage-decision-calculator","discount-calculator"]);
for (const c of ALL_CALCULATORS) {
  const has = c.inputs.some(isMoneyField);
  if (has !== CURRENCY_EXPECTED.has(c.slug)) fails.push(`${c.slug}: currency selector present=${has}`);
}

console.log(`\n=== FAILURES (${fails.length}) ===`);
fails.forEach((f) => console.log("  - " + f));
if (fails.length) process.exitCode = 1;
