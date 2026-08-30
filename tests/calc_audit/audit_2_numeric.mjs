// Numeric expectations, BMI/pH reference-range boundaries, validation errors,
// decimal-rate handling and single-field edge cases (0 / -1 / large).
import { ALL_CALCULATORS } from "./index.mjs";
const g = (s) => ALL_CALCULATORS.find((c) => c.slug === s);
const run = (slug, over = {}) => {
  const c = g(slug);
  const vals = {};
  for (const f of c.inputs) vals[f.key] = f.defaultValue;
  return c.compute({ ...vals, ...over });
};
const fails = [];
const approx = (n, got, want, tol = 0.05) => { if (typeof got !== "number" || Math.abs(got - want) > tol) fails.push(`${n}: got ${got} want ${want}`); };

// physics units
let r = run("speed-calculator", { solveFor: "v", d: 100, t: 10 });
approx("speed m/s", r.results[0].value, 10);
approx("speed km/h", r.results[1]?.value, 36);
approx("density", run("density-calculator", { solveFor: "rho", m: 2, V: 0.002 }).results[0].value, 1000);
approx("force", run("force-calculator", { solveFor: "F", m: 2, a: 5 }).results[0].value, 10);
approx("kinetic energy", run("kinetic-energy-calculator", { m: 2, v: 10 }).results[0].value, 100);
for (const [mode, want] of [["V", 12], ["I", 2], ["R", 6]]) approx("ohm " + mode, run("ohms-law-calculator", { solveFor: mode, V: 12, I: 2, R: 6 }).results[0].value, want);

// BMI reference-range boundaries
const H2 = 1.7 * 1.7;
for (const [t, want] of [[18.4,"Underweight"],[18.5,"Healthy"],[24.9,"Healthy"],[25,"Overweight"],[29.9,"Overweight"],[30,"Obesity Class 1"],[35,"Obesity Class 2"],[40,"Obesity Class 3"]]) {
  const weight = Math.round(t * H2 * 10000) / 10000; // mirror what a user would type
  const a = run("bmi-calculator", { units: "metric", height: 170, weight }).extras[0].data.active;
  if (a !== want) fails.push(`BMI boundary ${t}: active="${a}" want "${want}"`);
}
approx("BMI imperial", run("bmi-calculator", { units: "imperial", height: 67, weight: 143 }).results[0].value, 22.4, 0.1);
r = run("ph-calculator", { H: 1e-4 });
approx("pH", r.results[0].value, 4);
if (r.extras[0].data.active !== "Acidic") fails.push("pH active != Acidic");

// validation errors
const expectThrow = (name, slug, over, pattern = /.+/) => {
  try { run(slug, over); fails.push(`VALIDATION ${name}: expected throw`); }
  catch (e) { if (!pattern.test(e.message)) fails.push(`VALIDATION ${name}: "${e.message}" !~ ${pattern}`); }
};
expectThrow("molar-mass XYZ", "molar-mass-calculator", { formula: "XYZ" }, /Unknown element/i);
expectThrow("pH H=0", "ph-calculator", { H: 0 }, /must be positive/i);
expectThrow("quadratic a=0", "quadratic-equation-solver", { a: 0 });
expectThrow("pythagorean c<b", "pythagorean-theorem-calculator", { find: "a", b: 5, c: 3 });
expectThrow("dilution V2=0", "dilution-calculator", { solveFor: "C2", V2: 0 });
expectThrow("loan-eligibility income=0", "loan-eligibility-calculator", { income: 0 });
expectThrow("bmi height=0", "bmi-calculator", { height: 0 }, /positive/i);
expectThrow("mortgage-decision years=0", "mortgage-decision-calculator", { years: 0 }, /Loan term/i);

// decimal rate sensitivity
for (const [slug, key, rate] of [["home-loan-emi-calculator","rate",8.46],["mortgage-calculator","rate",7.375],["personal-loan-emi-calculator","rate",11.35],["sip-calculator","rate",12.85],["fd-calculator","rate",6.65]]) {
  const a = run(slug, { [key]: rate }).results[0].value;
  const b = run(slug, { [key]: rate + 0.005 }).results[0].value;
  if (!Number.isFinite(a) || a === b) fails.push(`${slug}: decimal rate not honoured`);
}

// single-field edge cases -> non-finite leaks
const leaks = [];
for (const c of ALL_CALCULATORS) {
  const base = {};
  for (const f of c.inputs) base[f.key] = f.defaultValue;
  for (const f of c.inputs) {
    if (f.type !== "number") continue;
    for (const probe of [0, -1, 500]) {
      try {
        const res = c.compute({ ...base, [f.key]: probe });
        const off = (res.results || []).filter((x) => typeof x.value === "number" && !Number.isFinite(x.value)).map((x) => `${x.label}=${x.value}`);
        if (off.length) leaks.push(`${c.slug}: ${f.key}=${probe} -> ${off.join(", ")}`);
      } catch (e) { /* validated */ }
    }
  }
}
console.log(`\n--- KNOWN non-finite edge cases (rendered as "\u2014" by formatResult) : ${leaks.length} ---`);
leaks.forEach((l) => console.log("  * " + l));

console.log(`\n=== FAILURES (${fails.length}) ===`);
fails.forEach((f) => console.log("  - " + f));
if (fails.length) process.exitCode = 1;
