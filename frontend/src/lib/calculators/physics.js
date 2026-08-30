// PHYSICS calculators
export const physicsCalculators = [
  {
    slug: "speed-calculator",
    name: "Speed Calculator",
    category: "physics",
    shortDescription: "Solve for speed, distance or time using v = d / t.",
    seoTitle: "Speed, Distance & Time Calculator | CalcyTub",
    metaDescription: "Solve for speed, distance or time using v = d / t.",
    keywords: ["speed calculator", "distance time speed"],
    inputs: [
      {
        key: "solveFor", label: "Solve for", type: "select", defaultValue: "v",
        options: [
          { value: "v", label: "Speed (v)" },
          { value: "d", label: "Distance (d)" },
          { value: "t", label: "Time (t)" },
        ],
      },
      { key: "d", label: "Distance (m)", type: "number", defaultValue: 100 },
      { key: "t", label: "Time (s)", type: "number", defaultValue: 10 },
      { key: "v", label: "Speed (m/s)", type: "number", defaultValue: 10 },
    ],
    compute: ({ solveFor, d, t, v }) => {
      let value, label;
      if (solveFor === "v") {
        if (t === 0) throw new Error("Time cannot be zero.");
        value = d / t; label = "Speed (m/s)";
      } else if (solveFor === "d") {
        value = v * t; label = "Distance (m)";
      } else {
        if (v === 0) throw new Error("Speed cannot be zero.");
        value = d / v; label = "Time (s)";
      }
      return {
        results: [
          { label, value, format: "number", primary: true },
          ...(solveFor === "v" ? [{ label: "Speed (km/h)", value: (d / t) * 3.6, format: "number" }] : []),
        ],
      };
    },
    formula: "v = d / t",
    howItWorks: "Rearrange the equation depending on which variable you're solving for.",
    workedExample: "d = 100 m, t = 10 s → v = 10 m/s = 36 km/h.",
    assumptions: ["Constant speed (average speed)."],
    faq: [{ q: "Units?", a: "SI units (meters, seconds, m/s). Convert externally if needed." }],
    related: ["force-calculator", "kinetic-energy-calculator", "density-calculator"],
  },

  {
    slug: "force-calculator",
    name: "Force Calculator",
    category: "physics",
    shortDescription: "Solve for force, mass or acceleration using Newton's second law F = m·a.",
    seoTitle: "Force Calculator (F = m·a) | CalcyTub",
    metaDescription: "Solve for force, mass or acceleration using F = m·a.",
    keywords: ["force calculator", "newtons second law"],
    inputs: [
      {
        key: "solveFor", label: "Solve for", type: "select", defaultValue: "F",
        options: [
          { value: "F", label: "Force (F)" },
          { value: "m", label: "Mass (m)" },
          { value: "a", label: "Acceleration (a)" },
        ],
      },
      { key: "F", label: "Force (N)", type: "number", defaultValue: 10 },
      { key: "m", label: "Mass (kg)", type: "number", defaultValue: 2 },
      { key: "a", label: "Acceleration (m/s²)", type: "number", defaultValue: 5 },
    ],
    compute: ({ solveFor, F, m, a }) => {
      let value, label;
      if (solveFor === "F") { value = m * a; label = "Force (N)"; }
      else if (solveFor === "m") {
        if (a === 0) throw new Error("Acceleration cannot be zero.");
        value = F / a; label = "Mass (kg)";
      } else {
        if (m === 0) throw new Error("Mass cannot be zero.");
        value = F / m; label = "Acceleration (m/s²)";
      }
      return { results: [{ label, value, format: "number", primary: true }] };
    },
    formula: "F = m × a",
    howItWorks: "Force equals mass times acceleration (Newton's second law).",
    workedExample: "m = 2 kg, a = 5 m/s² → F = 10 N.",
    assumptions: ["Non-relativistic; net force only."],
    faq: [{ q: "Weight vs mass?", a: "Weight is a force (mass × g). Mass is intrinsic." }],
    related: ["speed-calculator", "kinetic-energy-calculator"],
  },

  {
    slug: "kinetic-energy-calculator",
    name: "Kinetic Energy Calculator",
    category: "physics",
    shortDescription: "Compute kinetic energy KE = ½·m·v² for a moving object.",
    seoTitle: "Kinetic Energy Calculator (KE = ½mv²) | CalcyTub",
    metaDescription: "Compute the kinetic energy of a moving object using KE = ½mv².",
    keywords: ["kinetic energy", "energy calculator"],
    inputs: [
      { key: "m", label: "Mass (kg)", type: "number", defaultValue: 2 },
      { key: "v", label: "Velocity (m/s)", type: "number", defaultValue: 10 },
    ],
    compute: ({ m, v }) => ({
      results: [{ label: "Kinetic Energy (J)", value: 0.5 * m * v * v, format: "number", primary: true }],
    }),
    formula: "KE = ½ × m × v²",
    howItWorks: "Kinetic energy grows with the square of velocity, so doubling speed quadruples KE.",
    workedExample: "m = 2 kg at 10 m/s → KE = 100 J.",
    assumptions: ["Non-relativistic speeds (v ≪ c)."],
    faq: [{ q: "Units?", a: "Joules when mass is in kg and velocity in m/s." }],
    related: ["force-calculator", "speed-calculator"],
  },

  {
    slug: "ohms-law-calculator",
    name: "Ohm's Law Calculator",
    category: "physics",
    shortDescription: "Solve for voltage, current or resistance using V = I·R.",
    seoTitle: "Ohm's Law Calculator (V = I·R) | CalcyTub",
    metaDescription: "Solve for voltage, current or resistance using Ohm's law.",
    keywords: ["ohms law", "voltage current resistance"],
    inputs: [
      {
        key: "solveFor", label: "Solve for", type: "select", defaultValue: "V",
        options: [
          { value: "V", label: "Voltage (V)" },
          { value: "I", label: "Current (I)" },
          { value: "R", label: "Resistance (R)" },
        ],
      },
      { key: "V", label: "Voltage (V)", type: "number", defaultValue: 12 },
      { key: "I", label: "Current (A)", type: "number", defaultValue: 2 },
      { key: "R", label: "Resistance (Ω)", type: "number", defaultValue: 6 },
    ],
    compute: ({ solveFor, V, I, R }) => {
      let value, label;
      if (solveFor === "V") { value = I * R; label = "Voltage (V)"; }
      else if (solveFor === "I") {
        if (R === 0) throw new Error("Resistance cannot be zero.");
        value = V / R; label = "Current (A)";
      } else {
        if (I === 0) throw new Error("Current cannot be zero.");
        value = V / I; label = "Resistance (Ω)";
      }
      return { results: [{ label, value, format: "number", primary: true }] };
    },
    formula: "V = I × R",
    howItWorks: "Rearrange Ohm's law depending on which quantity you're solving for.",
    workedExample: "I = 2 A, R = 6 Ω → V = 12 V.",
    assumptions: ["Purely resistive DC circuit at steady state."],
    faq: [{ q: "Does it work for AC?", a: "Only for resistive elements; use impedance for AC with reactive components." }],
    related: ["force-calculator", "kinetic-energy-calculator"],
  },

  {
    slug: "density-calculator",
    name: "Density Calculator",
    category: "physics",
    shortDescription: "Solve for density, mass or volume using ρ = m / V.",
    seoTitle: "Density Calculator (ρ = m/V) | CalcyTub",
    metaDescription: "Solve for density, mass or volume using ρ = m/V.",
    keywords: ["density calculator", "mass volume density"],
    inputs: [
      {
        key: "solveFor", label: "Solve for", type: "select", defaultValue: "rho",
        options: [
          { value: "rho", label: "Density (ρ)" },
          { value: "m", label: "Mass (m)" },
          { value: "V", label: "Volume (V)" },
        ],
      },
      { key: "m", label: "Mass (kg)", type: "number", defaultValue: 2 },
      { key: "V", label: "Volume (m³)", type: "number", defaultValue: 0.002 },
      { key: "rho", label: "Density (kg/m³)", type: "number", defaultValue: 1000 },
    ],
    compute: ({ solveFor, m, V, rho }) => {
      let value, label;
      if (solveFor === "rho") {
        if (V === 0) throw new Error("Volume cannot be zero.");
        value = m / V; label = "Density (kg/m³)";
      } else if (solveFor === "m") {
        value = rho * V; label = "Mass (kg)";
      } else {
        if (rho === 0) throw new Error("Density cannot be zero.");
        value = m / rho; label = "Volume (m³)";
      }
      return { results: [{ label, value, format: "number", primary: true }] };
    },
    formula: "ρ = m / V",
    howItWorks: "Density is the ratio of mass to volume. Rearrange to find the missing quantity.",
    workedExample: "m = 2 kg, V = 0.002 m³ → ρ = 1000 kg/m³ (water).",
    assumptions: ["Homogeneous material at a given temperature."],
    faq: [{ q: "Units?", a: "SI units (kg, m³, kg/m³). 1 g/cm³ = 1000 kg/m³." }],
    related: ["force-calculator", "speed-calculator", "kinetic-energy-calculator"],
  },
];
