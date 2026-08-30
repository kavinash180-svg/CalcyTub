// Category definitions for CalcyTub
export const CATEGORIES = [
  {
    slug: "finance",
    name: "Finance & Mortgage",
    tagline: "Loans, investments and everyday money math.",
    accent: "from-teal-600 to-emerald-700",
  },
  {
    slug: "math",
    name: "Math",
    tagline: "Percentages, fractions, equations and more.",
    accent: "from-amber-500 to-orange-600",
  },
  {
    slug: "physics",
    name: "Physics",
    tagline: "Motion, force, energy and electricity.",
    accent: "from-sky-600 to-indigo-700",
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    tagline: "Concentrations, molar mass and pH.",
    accent: "from-rose-500 to-pink-700",
  },
  {
    slug: "health",
    name: "Health & Fitness",
    tagline: "Body metrics, calories and hydration.",
    accent: "from-lime-600 to-emerald-700",
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Coming soon — profit, ROI, break-even.",
    accent: "from-slate-600 to-slate-800",
    comingSoon: true,
  },
  {
    slug: "marketing",
    name: "Marketing",
    tagline: "Coming soon — CPM, CPC, CTR and more.",
    accent: "from-fuchsia-600 to-purple-700",
    comingSoon: true,
  },
  {
    slug: "construction",
    name: "Construction & Interior",
    tagline: "Coming soon — paint, tile, flooring, wallpaper.",
    accent: "from-orange-600 to-red-700",
    comingSoon: true,
  },
  {
    slug: "converters",
    name: "Unit Converters",
    tagline: "Coming soon — length, weight, temperature.",
    accent: "from-cyan-600 to-blue-700",
    comingSoon: true,
  },
  {
    slug: "datetime",
    name: "Date & Time",
    tagline: "Age, days between dates and more.",
    accent: "from-violet-600 to-indigo-700",
  },
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
