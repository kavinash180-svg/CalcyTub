// MATH calculators
const gcd = (a, b) => {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a;
};
const lcm = (a, b) => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);

export const mathCalculators = [
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    shortDescription: "Find what percentage one number is of another, or a percentage increase or decrease.",
    seoTitle: "Percentage Calculator — Increase, Decrease, Of | CalcyTub",
    metaDescription: "Calculate what % one number is of another, or the % increase/decrease between two values.",
    keywords: ["percentage calculator", "percent of", "percentage change"],
    inputs: [
      {
        key: "mode", label: "Calculation", type: "select", defaultValue: "of",
        options: [
          { value: "of", label: "What % is A of B?" },
          { value: "change", label: "% change from A to B" },
          { value: "pctOf", label: "X% of A" },
        ],
      },
      { key: "a", label: "Value A", type: "number", defaultValue: 25 },
      { key: "b", label: "Value B / X", type: "number", defaultValue: 200 },
    ],
    compute: ({ mode, a, b }) => {
      let result, label;
      if (mode === "of") {
        result = b === 0 ? NaN : (a / b) * 100;
        label = `${a} is this % of ${b}`;
      } else if (mode === "change") {
        result = a === 0 ? NaN : ((b - a) / Math.abs(a)) * 100;
        label = `% change from ${a} to ${b}`;
      } else {
        result = (b / 100) * a;
        label = `${b}% of ${a}`;
      }
      return {
        results: [
          { label, value: result, format: mode === "pctOf" ? "number" : "percent", primary: true },
        ],
      };
    },
    formula: "% of: (A/B) × 100 ; % change: ((B−A)/|A|) × 100 ; X% of A: (X/100) × A",
    howItWorks: "Pick a mode, enter two values and the calculator applies the corresponding percentage formula.",
    workedExample: "25 as a % of 200 = 12.5%. From 80 to 100 is a 25% increase.",
    assumptions: ["Non-zero denominator required for divisions."],
    faq: [{ q: "Can I compute a percentage decrease?", a: "Yes — a negative result in % change means a decrease." }],
    related: ["discount-calculator", "gst-calculator", "average-calculator"],
  },

  {
    slug: "average-calculator",
    name: "Average Calculator",
    category: "math",
    shortDescription: "Compute the arithmetic mean of any list of numbers.",
    seoTitle: "Average (Mean) Calculator | CalcyTub",
    metaDescription: "Calculate the arithmetic mean of a list of numbers, plus the count and sum.",
    keywords: ["average calculator", "mean calculator"],
    inputs: [
      { key: "values", label: "Numbers (comma or space separated)", type: "text", defaultValue: "5, 10, 15, 20" },
    ],
    compute: ({ values }) => {
      const list = String(values || "")
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));
      if (list.length === 0) throw new Error("Enter at least one number.");
      const sum = list.reduce((a, n) => a + n, 0);
      return {
        results: [
          { label: "Average", value: sum / list.length, format: "number", primary: true },
          { label: "Count", value: list.length, format: "integer" },
          { label: "Sum", value: sum, format: "number" },
        ],
      };
    },
    formula: "mean = (x₁ + x₂ + … + xₙ) / n",
    howItWorks: "Enter numbers separated by commas or spaces. The calculator sums them and divides by the count.",
    workedExample: "5, 10, 15, 20 → sum 50 ÷ 4 = 12.5.",
    assumptions: ["Only numeric entries are counted."],
    faq: [{ q: "Does it handle negative numbers?", a: "Yes." }],
    related: ["percentage-calculator", "gcd-lcm-calculator"],
  },

  {
    slug: "quadratic-equation-solver",
    name: "Quadratic Equation Solver",
    category: "math",
    shortDescription: "Solve ax² + bx + c = 0 with real or complex roots and see the discriminant.",
    seoTitle: "Quadratic Equation Solver (ax² + bx + c = 0) | CalcyTub",
    metaDescription: "Solve quadratic equations. Shows discriminant, real and complex roots and the formula used.",
    keywords: ["quadratic equation solver", "quadratic formula"],
    inputs: [
      { key: "a", label: "a", type: "number", defaultValue: 1 },
      { key: "b", label: "b", type: "number", defaultValue: -5 },
      { key: "c", label: "c", type: "number", defaultValue: 6 },
    ],
    compute: ({ a, b, c }) => {
      if (a === 0) throw new Error("Coefficient 'a' cannot be zero for a quadratic equation.");
      const D = b * b - 4 * a * c;
      let root1, root2;
      if (D >= 0) {
        const s = Math.sqrt(D);
        root1 = ((-b + s) / (2 * a)).toFixed(6).replace(/\.?0+$/, "");
        root2 = ((-b - s) / (2 * a)).toFixed(6).replace(/\.?0+$/, "");
      } else {
        const real = (-b / (2 * a)).toFixed(4).replace(/\.?0+$/, "");
        const imag = (Math.sqrt(-D) / (2 * a)).toFixed(4).replace(/\.?0+$/, "");
        root1 = `${real} + ${imag}i`;
        root2 = `${real} − ${imag}i`;
      }
      return {
        results: [
          { label: "Root 1", value: root1, primary: true },
          { label: "Root 2", value: root2, primary: true },
          { label: "Discriminant (b² − 4ac)", value: D, format: "number" },
          { label: "Root Type", value: D > 0 ? "Two real roots" : D === 0 ? "One repeated root" : "Two complex roots" },
        ],
      };
    },
    formula: "x = (−b ± √(b² − 4ac)) / (2a)",
    howItWorks: "Compute the discriminant D = b² − 4ac. If D ≥ 0 the roots are real; otherwise complex conjugates.",
    workedExample: "x² − 5x + 6 = 0 → D = 1 → roots 3 and 2.",
    assumptions: ["a ≠ 0."],
    faq: [{ q: "What if a = 0?", a: "Then the equation is linear, not quadratic." }],
    related: ["pythagorean-theorem-calculator", "exponent-calculator"],
  },

  {
    slug: "pythagorean-theorem-calculator",
    name: "Pythagorean Theorem Calculator",
    category: "math",
    shortDescription: "Find the missing side of a right triangle using a² + b² = c².",
    seoTitle: "Pythagorean Theorem Calculator | CalcyTub",
    metaDescription: "Find the missing side of a right triangle using the Pythagorean theorem.",
    keywords: ["pythagorean theorem", "right triangle"],
    inputs: [
      {
        key: "find", label: "Solve for", type: "select", defaultValue: "c",
        options: [
          { value: "c", label: "Hypotenuse c (given a, b)" },
          { value: "a", label: "Leg a (given b, c)" },
          { value: "b", label: "Leg b (given a, c)" },
        ],
      },
      { key: "a", label: "a", type: "number", defaultValue: 3 },
      { key: "b", label: "b", type: "number", defaultValue: 4 },
      { key: "c", label: "c", type: "number", defaultValue: 5 },
    ],
    compute: ({ find, a, b, c }) => {
      let value, label;
      if (find === "c") {
        value = Math.sqrt(a * a + b * b);
        label = "Hypotenuse c";
      } else if (find === "a") {
        if (c * c - b * b < 0) throw new Error("c must be greater than b.");
        value = Math.sqrt(c * c - b * b);
        label = "Leg a";
      } else {
        if (c * c - a * a < 0) throw new Error("c must be greater than a.");
        value = Math.sqrt(c * c - a * a);
        label = "Leg b";
      }
      return { results: [{ label, value, format: "number", primary: true }] };
    },
    formula: "a² + b² = c²",
    howItWorks: "For a right triangle, the square of the hypotenuse equals the sum of squares of the two legs.",
    workedExample: "a = 3, b = 4 → c = 5.",
    assumptions: ["Triangle is right-angled."],
    faq: [{ q: "Does it work for non-right triangles?", a: "No. Use the law of cosines for those." }],
    related: ["quadratic-equation-solver", "exponent-calculator"],
  },

  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    category: "math",
    shortDescription: "Add, subtract, multiply or divide two fractions and get the simplified result.",
    seoTitle: "Fraction Calculator (+ − × ÷) with Simplification | CalcyTub",
    metaDescription: "Add, subtract, multiply and divide two fractions with automatic simplification.",
    keywords: ["fraction calculator", "add fractions", "simplify fractions"],
    inputs: [
      { key: "n1", label: "Numerator 1", type: "number", defaultValue: 1 },
      { key: "d1", label: "Denominator 1", type: "number", defaultValue: 2 },
      {
        key: "op", label: "Operation", type: "select", defaultValue: "+",
        options: [
          { value: "+", label: "Add (+)" },
          { value: "-", label: "Subtract (−)" },
          { value: "*", label: "Multiply (×)" },
          { value: "/", label: "Divide (÷)" },
        ],
      },
      { key: "n2", label: "Numerator 2", type: "number", defaultValue: 1 },
      { key: "d2", label: "Denominator 2", type: "number", defaultValue: 3 },
    ],
    compute: ({ n1, d1, op, n2, d2 }) => {
      if (d1 === 0 || d2 === 0) throw new Error("Denominators cannot be zero.");
      let n, d;
      switch (op) {
        case "+": n = n1 * d2 + n2 * d1; d = d1 * d2; break;
        case "-": n = n1 * d2 - n2 * d1; d = d1 * d2; break;
        case "*": n = n1 * n2; d = d1 * d2; break;
        case "/":
          if (n2 === 0) throw new Error("Cannot divide by a zero fraction.");
          n = n1 * d2; d = d1 * n2; break;
        default: throw new Error("Invalid operation");
      }
      const g = gcd(n, d) || 1;
      const sign = d < 0 ? -1 : 1;
      const sn = (n / g) * sign;
      const sd = Math.abs(d / g);
      return {
        results: [
          { label: "Simplified", value: `${sn}/${sd}`, primary: true },
          { label: "Decimal", value: sn / sd, format: "number" },
        ],
      };
    },
    formula: "Add: (n₁d₂ + n₂d₁) / (d₁d₂). Multiply: (n₁n₂) / (d₁d₂). Then reduce by GCD.",
    howItWorks: "Fractions are combined per rules and reduced using the GCD of numerator and denominator.",
    workedExample: "1/2 + 1/3 = 5/6.",
    assumptions: ["Denominators are non-zero."],
    faq: [{ q: "Does it simplify?", a: "Yes, using GCD reduction." }],
    related: ["percentage-calculator", "gcd-lcm-calculator"],
  },

  {
    slug: "exponent-calculator",
    name: "Exponent Calculator",
    category: "math",
    shortDescription: "Compute baseᵉˣᵖ for positive, negative and fractional exponents.",
    seoTitle: "Exponent (Power) Calculator | CalcyTub",
    metaDescription: "Compute a base raised to any exponent, including negative and fractional exponents.",
    keywords: ["exponent calculator", "power calculator"],
    inputs: [
      { key: "base", label: "Base", type: "number", defaultValue: 2 },
      { key: "exp", label: "Exponent", type: "number", defaultValue: 10, step: 0.1 },
    ],
    compute: ({ base, exp }) => {
      const value = Math.pow(base, exp);
      if (!isFinite(value) || isNaN(value)) throw new Error("Result is not a real number.");
      return { results: [{ label: `${base}^${exp}`, value, format: "number", primary: true }] };
    },
    formula: "aˣ = a × a × … (x times) for integer x; general: aˣ = e^(x·ln a).",
    howItWorks: "The calculator uses JavaScript's Math.pow which supports fractional and negative exponents.",
    workedExample: "2¹⁰ = 1,024. 9^0.5 = 3.",
    assumptions: ["Complex results (e.g. negative base with fractional exponent) are not supported."],
    faq: [{ q: "Why does (−2)^0.5 fail?", a: "Because the square root of a negative number is imaginary." }],
    related: ["quadratic-equation-solver", "pythagorean-theorem-calculator"],
  },

  {
    slug: "gcd-lcm-calculator",
    name: "GCD & LCM Calculator",
    category: "math",
    shortDescription: "Compute the greatest common divisor and least common multiple of two integers.",
    seoTitle: "GCD & LCM Calculator | CalcyTub",
    metaDescription: "Compute the GCD (HCF) and LCM of two integers instantly.",
    keywords: ["gcd calculator", "lcm calculator", "hcf calculator"],
    inputs: [
      { key: "a", label: "Number A", type: "number", defaultValue: 12, step: 1 },
      { key: "b", label: "Number B", type: "number", defaultValue: 18, step: 1 },
    ],
    compute: ({ a, b }) => ({
      results: [
        { label: "GCD (HCF)", value: gcd(a, b), format: "integer", primary: true },
        { label: "LCM", value: lcm(a, b), format: "integer", primary: true },
      ],
    }),
    formula: "GCD × LCM = |A × B|",
    howItWorks: "The GCD is computed with the Euclidean algorithm; the LCM is derived from the identity above.",
    workedExample: "GCD(12, 18) = 6, LCM(12, 18) = 36.",
    assumptions: ["Non-zero integers."],
    faq: [{ q: "Are negatives allowed?", a: "Yes, they are converted to absolute values." }],
    related: ["fraction-calculator", "average-calculator"],
  },

  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "math",
    shortDescription: "Apply a percentage discount to any price and see the final price and savings.",
    seoTitle: "Discount Calculator (% Off) | CalcyTub",
    metaDescription: "Compute discount amount, final price and savings for any percentage discount.",
    keywords: ["discount calculator", "percent off"],
    inputs: [
      { key: "price", label: "Original Price", type: "number", defaultValue: 100, step: 1, prefix: "₹" },
      { key: "pct", label: "Discount", type: "number", suffix: "%", defaultValue: 20, min: 0, max: 100, step: 1 },
    ],
    compute: ({ price, pct }) => {
      const discount = price * (pct / 100);
      const final = price - discount;
      return {
        results: [
          { label: "Final Price", value: final, format: "currency", currency: "INR", primary: true },
          { label: "You Save", value: discount, format: "currency", currency: "INR" },
        ],
      };
    },
    formula: "Final = Price × (1 − pct/100)",
    howItWorks: "Multiply the price by (1 − percentage/100) to get the discounted price.",
    workedExample: "₹100 at 20% off → ₹80 (save ₹20).",
    assumptions: ["Percentage between 0 and 100."],
    faq: [{ q: "Can I stack discounts?", a: "Apply them one at a time — they don't simply add up." }],
    related: ["percentage-calculator", "gst-calculator"],
  },

  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "datetime",
    shortDescription: "Calculate exact age in years, months and days from date of birth.",
    seoTitle: "Age Calculator (Years, Months, Days) | CalcyTub",
    metaDescription: "Calculate exact age from date of birth. Shows years, months, days, total days and next birthday.",
    keywords: ["age calculator", "date of birth calculator"],
    inputs: [
      { key: "dob", label: "Date of Birth", type: "date", defaultValue: "2000-01-01" },
      { key: "on", label: "As Of", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
    ],
    compute: ({ dob, on }) => {
      const b = new Date(dob);
      const t = new Date(on);
      if (isNaN(b) || isNaN(t)) throw new Error("Enter valid dates.");
      if (t < b) throw new Error("'As Of' date must be after date of birth.");
      let years = t.getFullYear() - b.getFullYear();
      let months = t.getMonth() - b.getMonth();
      let days = t.getDate() - b.getDate();
      if (days < 0) {
        months -= 1;
        const prev = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
        days += prev;
      }
      if (months < 0) { years -= 1; months += 12; }
      const totalDays = Math.floor((t - b) / 86400000);
      const nextBd = new Date(t.getFullYear(), b.getMonth(), b.getDate());
      if (nextBd < t) nextBd.setFullYear(t.getFullYear() + 1);
      const daysToBd = Math.ceil((nextBd - t) / 86400000);
      return {
        results: [
          { label: "Age", value: `${years} years, ${months} months, ${days} days`, primary: true },
          { label: "Total Days", value: totalDays, format: "integer" },
          { label: "Next Birthday", value: `${daysToBd} days (${nextBd.toDateString()})` },
        ],
      };
    },
    formula: "Age = 'As Of' date − Date of Birth",
    howItWorks: "The calculator handles month/day rollovers to give an exact age in years, months and days.",
    workedExample: "DOB 1990-05-15 on 2025-01-01 → 34 years, 7 months, 17 days.",
    assumptions: ["Gregorian calendar."],
    faq: [{ q: "Time zones?", a: "Dates are treated as calendar dates without time zone adjustment." }],
    related: ["percentage-calculator"],
  },
];
