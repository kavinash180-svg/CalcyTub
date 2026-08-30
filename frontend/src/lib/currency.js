// Reusable currency system for CalcyTub.
// Adds a globally-selectable display currency for financial calculators
// WITHOUT converting numerical inputs — the entered value is used as-is,
// only the symbol / locale-aware formatting changes.

export const CURRENCIES = [
  { code: "USD", symbol: "$",  name: "US Dollar",        locale: "en-US" },
  { code: "INR", symbol: "₹",  name: "Indian Rupee",     locale: "en-IN" },
  { code: "EUR", symbol: "€",  name: "Euro",             locale: "de-DE" },
  { code: "GBP", symbol: "£",  name: "British Pound",    locale: "en-GB" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar",  locale: "en-CA" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar",locale: "en-AU" },
  { code: "AED", symbol: "د.إ",name: "UAE Dirham",       locale: "ar-AE" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "JPY", symbol: "¥",  name: "Japanese Yen",     locale: "ja-JP" },
  { code: "CNY", symbol: "¥",  name: "Chinese Yuan",     locale: "zh-CN" },
  { code: "NZD", symbol: "NZ$",name: "New Zealand Dollar",locale: "en-NZ" },
  { code: "CHF", symbol: "CHF",name: "Swiss Franc",      locale: "de-CH" },
  { code: "ZAR", symbol: "R",  name: "South African Rand",locale: "en-ZA" },
];

// Recognise a legacy hard-coded prefix as a currency-linked money input.
export const KNOWN_CURRENCY_SYMBOLS = new Set(
  CURRENCIES.map((c) => c.symbol).concat(["$", "₹", "€", "£", "¥", "R"])
);

const byCode = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code) {
  return byCode.get(code) || byCode.get("USD");
}

export function currencySymbol(code) {
  return getCurrency(code).symbol;
}

export function formatCurrency(value, code = "USD") {
  if (value === null || value === undefined || !isFinite(value)) return "—";
  const cur = getCurrency(code);
  try {
    return new Intl.NumberFormat(cur.locale, {
      style: "currency",
      currency: cur.code,
      maximumFractionDigits: cur.code === "JPY" ? 0 : 2,
    }).format(value);
  } catch {
    return `${cur.symbol}${value.toFixed(2)}`;
  }
}

// Detect a money input by convention: it has a prefix that matches a known
// currency symbol, or it explicitly opts in via `moneyField: true`.
export function isMoneyField(field) {
  if (field?.moneyField === true) return true;
  if (!field?.prefix) return false;
  return KNOWN_CURRENCY_SYMBOLS.has(field.prefix);
}

const STORAGE_KEY = "calcytub_currency";

export function readStoredCurrency(fallback = "USD") {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && byCode.has(v)) return v;
  } catch {}
  return fallback;
}

export function persistCurrency(code) {
  try { window.localStorage.setItem(STORAGE_KEY, code); } catch {}
}
