// Icon mapping for calculators & categories.
// Uses lucide-react (already in package.json). Zero extra bundle cost — each
// icon is a tree-shaken component.
import {
  // categories
  Landmark, Sigma, Atom, FlaskConical, HeartPulse, Briefcase, Megaphone,
  Building2, ArrowRightLeft, CalendarClock, LayoutGrid,
  // finance
  Home as HomeIcon, CalendarDays, RefreshCw, Wallet, TrendingUp, PiggyBank, Receipt,
  // math
  Percent, Calculator, Divide, Triangle, HashIcon, Sparkles, Tag,
  // physics
  Gauge, Zap, Battery, Weight,
  // chemistry
  TestTube, Droplet, Scale, FlaskRound,
  // health
  Ruler, Flame, User, Droplets,
  // decision
  ShieldCheck,
} from "lucide-react";

const CATEGORY_ICONS = {
  finance: Landmark,
  math: Sigma,
  physics: Atom,
  chemistry: FlaskConical,
  health: HeartPulse,
  business: Briefcase,
  marketing: Megaphone,
  construction: Building2,
  converters: ArrowRightLeft,
  datetime: CalendarClock,
};

const CALC_ICONS = {
  // Finance
  "home-loan-emi-calculator": HomeIcon,
  "mortgage-calculator": HomeIcon,
  "mortgage-amortization-calculator": CalendarDays,
  "refinance-calculator": RefreshCw,
  "personal-loan-emi-calculator": Wallet,
  "sip-calculator": TrendingUp,
  "fd-calculator": PiggyBank,
  "gst-calculator": Receipt,
  "mortgage-decision-calculator": ShieldCheck,
  "compound-interest-calculator": TrendingUp,
  "simple-interest-calculator": Calculator,
  "home-loan-prepayment-calculator": RefreshCw,
  "loan-eligibility-calculator": Wallet,

  // Math
  "percentage-calculator": Percent,
  "average-calculator": Calculator,
  "quadratic-equation-solver": Sigma,
  "pythagorean-theorem-calculator": Triangle,
  "fraction-calculator": Divide,
  "exponent-calculator": HashIcon,
  "gcd-lcm-calculator": Sparkles,
  "discount-calculator": Tag,
  "age-calculator": CalendarClock,

  // Physics
  "speed-calculator": Gauge,
  "force-calculator": Zap,
  "kinetic-energy-calculator": Atom,
  "ohms-law-calculator": Battery,
  "density-calculator": Weight,

  // Chemistry
  "molarity-calculator": FlaskRound,
  "dilution-calculator": TestTube,
  "molar-mass-calculator": Scale,
  "ph-calculator": Droplet,

  // Health
  "bmi-calculator": User,
  "daily-calorie-needs-calculator": Flame,
  "ideal-weight-calculator": Ruler,
  "daily-water-intake-calculator": Droplets,
};

const DefaultCalcIcon = Calculator;
const DefaultCategoryIcon = LayoutGrid;

export const getCalcIcon = (slug) => CALC_ICONS[slug] || DefaultCalcIcon;
export const getCategoryIcon = (slug) => CATEGORY_ICONS[slug] || DefaultCategoryIcon;
