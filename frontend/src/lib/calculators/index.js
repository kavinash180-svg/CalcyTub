import { financeCalculators } from "./finance";
import { mathCalculators } from "./math";
import { physicsCalculators } from "./physics";
import { chemistryCalculators } from "./chemistry";
import { healthCalculators } from "./health";
import { mortgageDecisionCalculator } from "./mortgage-decision";

export const ALL_CALCULATORS = [
  ...financeCalculators,
  mortgageDecisionCalculator,
  ...mathCalculators,
  ...physicsCalculators,
  ...chemistryCalculators,
  ...healthCalculators,
];

export const getCalculator = (slug) => ALL_CALCULATORS.find((c) => c.slug === slug);

export const getByCategory = (categorySlug) =>
  ALL_CALCULATORS.filter((c) => c.category === categorySlug);

export const POPULAR_SLUGS = [
  "home-loan-emi-calculator",
  "mortgage-decision-calculator",
  "bmi-calculator",
  "sip-calculator",
  "percentage-calculator",
  "age-calculator",
  "gst-calculator",
  "molarity-calculator",
];

export const getPopular = () =>
  POPULAR_SLUGS.map((s) => getCalculator(s)).filter(Boolean);

export function searchCalculators(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_CALCULATORS.filter((c) => {
    const hay = [
      c.name,
      c.slug,
      c.shortDescription,
      c.category,
      ...(c.keywords || []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }).slice(0, 20);
}
