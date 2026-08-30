// CHEMISTRY calculators

// Minimal periodic table for molar mass calculation.
const ATOMIC = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
  K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
  Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
  Ag: 107.868, Cd: 112.414, In: 114.818, Sn: 118.71, Sb: 121.76, Te: 127.60,
  I: 126.904, Xe: 131.293, Cs: 132.905, Ba: 137.327, Pt: 195.084, Au: 196.967,
  Hg: 200.592, Pb: 207.2, Bi: 208.980, U: 238.029,
};

function parseFormula(formula) {
  // Support parentheses and multi-digit counts. E.g. Ca(OH)2, H2SO4, C6H12O6
  let i = 0;
  const stack = [{}];
  const err = (m) => { throw new Error(m); };
  while (i < formula.length) {
    const ch = formula[i];
    if (ch === "(") { stack.push({}); i++; }
    else if (ch === ")") {
      i++;
      let numStr = "";
      while (/\d/.test(formula[i])) { numStr += formula[i]; i++; }
      const mult = numStr ? parseInt(numStr, 10) : 1;
      const group = stack.pop();
      const top = stack[stack.length - 1];
      for (const el of Object.keys(group)) top[el] = (top[el] || 0) + group[el] * mult;
    } else if (/[A-Z]/.test(ch)) {
      let el = ch; i++;
      if (i < formula.length && /[a-z]/.test(formula[i])) { el += formula[i]; i++; }
      let numStr = "";
      while (i < formula.length && /\d/.test(formula[i])) { numStr += formula[i]; i++; }
      const n = numStr ? parseInt(numStr, 10) : 1;
      if (!ATOMIC[el]) err(`Unknown element: ${el}`);
      const top = stack[stack.length - 1];
      top[el] = (top[el] || 0) + n;
    } else if (/\s/.test(ch)) { i++; }
    else err(`Unexpected character: ${ch}`);
  }
  if (stack.length !== 1) err("Unbalanced parentheses.");
  return stack[0];
}

export const chemistryCalculators = [
  {
    slug: "molarity-calculator",
    name: "Molarity Calculator",
    category: "chemistry",
    shortDescription: "Solve for molarity, moles or solution volume using M = n / V.",
    seoTitle: "Molarity Calculator (M = n/V) | CalcyTub",
    metaDescription: "Compute molarity, moles or solution volume using M = n/V.",
    keywords: ["molarity", "concentration calculator"],
    inputs: [
      {
        key: "solveFor", label: "Solve for", type: "select", defaultValue: "M",
        options: [
          { value: "M", label: "Molarity (M)" },
          { value: "n", label: "Moles (n)" },
          { value: "V", label: "Volume (L)" },
        ],
      },
      { key: "n", label: "Moles (mol)", type: "number", defaultValue: 0.5 },
      { key: "V", label: "Volume (L)", type: "number", defaultValue: 1 },
      { key: "M", label: "Molarity (mol/L)", type: "number", defaultValue: 0.5 },
    ],
    compute: ({ solveFor, n, V, M }) => {
      let value, label;
      if (solveFor === "M") {
        if (V === 0) throw new Error("Volume cannot be zero.");
        value = n / V; label = "Molarity (mol/L)";
      } else if (solveFor === "n") { value = M * V; label = "Moles (mol)"; }
      else {
        if (M === 0) throw new Error("Molarity cannot be zero.");
        value = n / M; label = "Volume (L)";
      }
      return { results: [{ label, value, format: "number", primary: true }] };
    },
    formula: "M = n / V",
    howItWorks: "Molarity is moles of solute per liter of solution. Rearrange to find the missing variable.",
    workedExample: "n = 0.5 mol in V = 1 L → M = 0.5 mol/L.",
    assumptions: ["Volume in liters, moles in mol."],
    faq: [{ q: "Molarity vs molality?", a: "Molality uses kg of solvent, not liters of solution." }],
    related: ["dilution-calculator", "molar-mass-calculator", "ph-calculator"],
  },

  {
    slug: "dilution-calculator",
    name: "Dilution Calculator",
    category: "chemistry",
    shortDescription: "Solve C₁V₁ = C₂V₂ for any missing variable.",
    seoTitle: "Dilution Calculator (C₁V₁ = C₂V₂) | CalcyTub",
    metaDescription: "Solve C₁V₁ = C₂V₂ for any missing variable to plan dilutions.",
    keywords: ["dilution calculator", "c1v1 c2v2"],
    inputs: [
      { key: "C1", label: "C₁ (initial concentration)", type: "number", defaultValue: 1 },
      { key: "V1", label: "V₁ (initial volume)", type: "number", defaultValue: 0.1 },
      { key: "C2", label: "C₂ (final concentration)", type: "number", defaultValue: 0.1 },
      { key: "V2", label: "V₂ (final volume)", type: "number", defaultValue: 0 },
      {
        key: "solveFor", label: "Solve for", type: "select", defaultValue: "V2",
        options: [
          { value: "C1", label: "C₁" },
          { value: "V1", label: "V₁" },
          { value: "C2", label: "C₂" },
          { value: "V2", label: "V₂" },
        ],
      },
    ],
    compute: ({ C1, V1, C2, V2, solveFor }) => {
      let value, label;
      if (solveFor === "C1") { if (V1 === 0) throw new Error("V₁ cannot be zero."); value = (C2 * V2) / V1; label = "C₁"; }
      else if (solveFor === "V1") { if (C1 === 0) throw new Error("C₁ cannot be zero."); value = (C2 * V2) / C1; label = "V₁"; }
      else if (solveFor === "C2") { if (V2 === 0) throw new Error("V₂ cannot be zero."); value = (C1 * V1) / V2; label = "C₂"; }
      else { if (C2 === 0) throw new Error("C₂ cannot be zero."); value = (C1 * V1) / C2; label = "V₂"; }
      return { results: [{ label, value, format: "number", primary: true }] };
    },
    formula: "C₁ × V₁ = C₂ × V₂",
    howItWorks: "Because the number of moles is conserved during dilution, the product of concentration and volume stays constant.",
    workedExample: "C₁ = 1 M, V₁ = 0.1 L, C₂ = 0.1 M → V₂ = 1 L.",
    assumptions: ["Ideal mixing; no volume change on dilution."],
    faq: [{ q: "Units?", a: "Use consistent units on both sides (e.g. all L, or all mL)." }],
    related: ["molarity-calculator", "molar-mass-calculator"],
  },

  {
    slug: "molar-mass-calculator",
    name: "Molar Mass Calculator",
    category: "chemistry",
    shortDescription: "Compute the molar mass of a chemical formula like H2SO4, Ca(OH)2 or C6H12O6.",
    seoTitle: "Molar Mass Calculator (Chemical Formula) | CalcyTub",
    metaDescription: "Compute molar mass from a chemical formula. Supports parentheses like Ca(OH)2.",
    keywords: ["molar mass", "molecular weight"],
    inputs: [
      { key: "formula", label: "Chemical Formula (case-sensitive)", type: "text", defaultValue: "H2SO4" },
    ],
    compute: ({ formula }) => {
      const atoms = parseFormula(String(formula).trim());
      let total = 0;
      const rows = Object.entries(atoms).map(([el, count]) => {
        const m = ATOMIC[el] * count;
        total += m;
        return [el, count, { value: ATOMIC[el], format: "number" }, { value: m, format: "number" }];
      });
      return {
        results: [{ label: `Molar mass of ${formula}`, value: total, format: "number", primary: true }, { label: "Unit", value: "g/mol" }],
        breakdown: { title: "Composition", columns: ["Element", "Count", "Atomic Mass", "Contribution"], rows },
      };
    },
    formula: "M = Σ (atomic mass × count)",
    howItWorks: "Parse the formula into element counts (supporting parentheses) and sum the atomic masses.",
    workedExample: "H₂SO₄: 2(1.008) + 32.06 + 4(15.999) ≈ 98.079 g/mol.",
    assumptions: ["Formulas must use standard element symbols (case-sensitive)."],
    faq: [
      { q: "Does it support hydrates?", a: "Dot notation like CuSO4·5H2O is not parsed. Enter as CuSO4(H2O)5." },
      { q: "Are all elements supported?", a: "Common elements up to U. Rare elements may be missing." },
    ],
    related: ["molarity-calculator", "dilution-calculator", "ph-calculator"],
  },

  {
    slug: "ph-calculator",
    name: "pH Calculator",
    category: "chemistry",
    shortDescription: "Compute pH from hydrogen-ion concentration [H+] using pH = −log₁₀[H+].",
    seoTitle: "pH Calculator (pH = −log[H⁺]) | CalcyTub",
    metaDescription: "Calculate pH from hydrogen ion concentration or vice versa.",
    keywords: ["ph calculator", "acidity"],
    inputs: [
      { key: "H", label: "[H⁺] concentration (mol/L)", type: "number", defaultValue: 0.0001, step: 0.0001 },
    ],
    compute: ({ H }) => {
      if (H <= 0) throw new Error("[H⁺] must be positive.");
      const pH = -Math.log10(H);
      return {
        results: [
          { label: "pH", value: pH, format: "number", primary: true },
          { label: "Nature", value: pH < 7 ? "Acidic" : pH > 7 ? "Basic (alkaline)" : "Neutral" },
        ],
      };
    },
    formula: "pH = −log₁₀[H⁺]",
    howItWorks: "The pH is the negative base-10 logarithm of the hydrogen-ion concentration.",
    workedExample: "[H⁺] = 10⁻⁴ mol/L → pH = 4 (acidic).",
    assumptions: ["Dilute aqueous solution at 25 °C.", "Activity ≈ concentration."],
    faq: [{ q: "What is pOH?", a: "pOH = 14 − pH at 25 °C for water." }],
    related: ["molarity-calculator", "molar-mass-calculator"],
  },
];
