// HEALTH calculators
export const healthCalculators = [
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    shortDescription: "Compute Body Mass Index (BMI) and see the standard WHO category.",
    seoTitle: "BMI Calculator (Metric & Imperial) | CalcyTub",
    metaDescription: "Compute BMI using metric or imperial units. Shows the WHO category for adults.",
    keywords: ["bmi calculator", "body mass index"],
    inputs: [
      {
        key: "units", label: "Units", type: "select", defaultValue: "metric",
        options: [
          { value: "metric", label: "Metric (cm, kg)" },
          { value: "imperial", label: "Imperial (in, lb)" },
        ],
      },
      { key: "height", label: "Height", type: "number", defaultValue: 170 },
      { key: "weight", label: "Weight", type: "number", defaultValue: 65 },
    ],
    compute: ({ units, height, weight }) => {
      if (height <= 0 || weight <= 0) throw new Error("Height and weight must be positive.");
      let bmi;
      if (units === "metric") bmi = weight / Math.pow(height / 100, 2);
      else bmi = (weight / (height * height)) * 703;
      let category;
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obesity";
      return {
        results: [
          { label: "BMI", value: bmi, format: "number", primary: true },
          { label: "Category", value: category, primary: true },
        ],
      };
    },
    formula: "Metric: BMI = kg / m² · Imperial: BMI = (lb / in²) × 703",
    howItWorks: "Body Mass Index is a screening measure for body fat based on height and weight.",
    workedExample: "170 cm, 65 kg → BMI ≈ 22.5 (Normal).",
    assumptions: ["Adults; not for athletes, pregnant women or children."],
    faq: [{ q: "Is BMI a diagnosis?", a: "No — BMI is a screening tool, not a diagnosis." }],
    related: ["daily-calorie-needs-calculator", "ideal-weight-calculator", "daily-water-intake-calculator"],
    disclaimer: "health",
  },

  {
    slug: "daily-calorie-needs-calculator",
    name: "Daily Calorie Needs Calculator",
    category: "health",
    shortDescription: "Estimate daily calorie needs using the Mifflin–St Jeor BMR equation and an activity multiplier.",
    seoTitle: "Daily Calorie Needs (TDEE) Calculator | CalcyTub",
    metaDescription: "Estimate BMR and TDEE (daily calorie needs) using the Mifflin–St Jeor equation.",
    keywords: ["calorie calculator", "tdee", "bmr"],
    inputs: [
      { key: "age", label: "Age (years)", type: "number", defaultValue: 30 },
      {
        key: "sex", label: "Sex", type: "select", defaultValue: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ],
      },
      { key: "height", label: "Height (cm)", type: "number", defaultValue: 170 },
      { key: "weight", label: "Weight (kg)", type: "number", defaultValue: 65 },
      {
        key: "activity", label: "Activity Level", type: "select", defaultValue: 1.55,
        options: [
          { value: 1.2, label: "Sedentary (little/no exercise)" },
          { value: 1.375, label: "Lightly active (1–3 days/week)" },
          { value: 1.55, label: "Moderately active (3–5 days/week)" },
          { value: 1.725, label: "Very active (6–7 days/week)" },
          { value: 1.9, label: "Extra active (physical job)" },
        ],
      },
    ],
    compute: ({ age, sex, height, weight, activity }) => {
      const s = sex === "male" ? 5 : -161;
      const bmr = 10 * weight + 6.25 * height - 5 * age + s;
      const tdee = bmr * Number(activity);
      return {
        results: [
          { label: "Estimated Daily Calories (TDEE)", value: tdee, format: "integer", primary: true },
          { label: "BMR", value: bmr, format: "integer" },
          { label: "Weight Loss (~0.5 kg/wk)", value: Math.max(1200, tdee - 500), format: "integer" },
          { label: "Weight Gain (~0.5 kg/wk)", value: tdee + 500, format: "integer" },
        ],
      };
    },
    formula: "BMR (Mifflin–St Jeor): 10·kg + 6.25·cm − 5·age + s (s=+5 male, −161 female). TDEE = BMR × activity.",
    howItWorks: "BMR is your resting energy expenditure. Multiply by an activity factor to get TDEE.",
    workedExample: "Male, 30 y, 170 cm, 65 kg, moderate → BMR ≈ 1,504 kcal, TDEE ≈ 2,331 kcal.",
    assumptions: ["General estimate; individual metabolism varies."],
    faq: [{ q: "Which equation is used?", a: "Mifflin–St Jeor, widely used and accurate." }],
    related: ["bmi-calculator", "ideal-weight-calculator", "daily-water-intake-calculator"],
    disclaimer: "health",
  },

  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    shortDescription: "Estimate ideal body weight using the Devine formula.",
    seoTitle: "Ideal Body Weight Calculator (Devine Formula) | CalcyTub",
    metaDescription: "Estimate ideal body weight using the Devine formula for adults.",
    keywords: ["ideal weight", "devine formula"],
    inputs: [
      {
        key: "sex", label: "Sex", type: "select", defaultValue: "male",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ],
      },
      { key: "height", label: "Height (cm)", type: "number", defaultValue: 170 },
    ],
    compute: ({ sex, height }) => {
      const inches = height / 2.54;
      const over60 = Math.max(0, inches - 60);
      const base = sex === "male" ? 50 : 45.5;
      const kg = base + 2.3 * over60;
      return {
        results: [
          { label: "Ideal Body Weight (Devine)", value: kg, format: "number", primary: true },
          { label: "In pounds", value: kg * 2.2046, format: "number" },
        ],
      };
    },
    formula: "Male: 50 kg + 2.3 kg/inch over 5' · Female: 45.5 kg + 2.3 kg/inch over 5'",
    howItWorks: "The Devine formula is a widely used clinical estimate for adults.",
    workedExample: "170 cm (66.9 in) male → 50 + 2.3×6.9 ≈ 65.9 kg.",
    assumptions: ["Adults over 5 feet (152 cm) tall."],
    faq: [{ q: "Is 'ideal weight' medical advice?", a: "No — it is a formula-based estimate only." }],
    related: ["bmi-calculator", "daily-calorie-needs-calculator"],
    disclaimer: "health",
  },

  {
    slug: "daily-water-intake-calculator",
    name: "Daily Water Intake Calculator",
    category: "health",
    shortDescription: "Estimate daily fluid intake based on body weight.",
    seoTitle: "Daily Water Intake Calculator | CalcyTub",
    metaDescription: "Estimate daily water intake in liters based on body weight.",
    keywords: ["water intake", "hydration"],
    inputs: [
      { key: "weight", label: "Body Weight (kg)", type: "number", defaultValue: 65 },
      {
        key: "activity", label: "Activity Level", type: "select", defaultValue: 0.033,
        options: [
          { value: 0.033, label: "Low activity" },
          { value: 0.04, label: "Moderate activity" },
          { value: 0.05, label: "High activity" },
        ],
      },
    ],
    compute: ({ weight, activity }) => {
      const liters = weight * Number(activity);
      const glasses = (liters * 1000) / 250; // 250 mL glass
      return {
        results: [
          { label: "Estimated Daily Water", value: liters, format: "number", primary: true },
          { label: "Unit", value: "liters" },
          { label: "≈ 250 mL glasses", value: glasses, format: "number" },
        ],
      };
    },
    formula: "Water (L) ≈ Body weight (kg) × 0.033 – 0.05 depending on activity.",
    howItWorks: "A commonly used estimate is roughly 33–50 mL of fluid per kg of body weight per day.",
    workedExample: "65 kg, moderate activity → 65 × 0.04 = 2.6 L (~10 glasses).",
    assumptions: ["Estimate only; hot climates, illness or pregnancy change needs."],
    faq: [{ q: "Does coffee count?", a: "Most beverages count toward fluid intake in moderation." }],
    related: ["bmi-calculator", "daily-calorie-needs-calculator"],
    disclaimer: "health",
  },
];
