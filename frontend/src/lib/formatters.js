// Formatting helpers
const CURRENCY_LOCALES = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function formatCurrency(value, currency = "INR") {
  if (!isFinite(value)) return "—";
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value, decimals = 2) {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value, decimals = 2) {
  if (!isFinite(value)) return "—";
  return `${formatNumber(value, decimals)}%`;
}

export function formatResult(v, format, opts = {}) {
  if (v === null || v === undefined || (typeof v === "number" && !isFinite(v)))
    return "—";
  if (typeof v === "string") return v;
  switch (format) {
    case "currency":
      return formatCurrency(v, opts.currency || "INR");
    case "percent":
      return formatPercent(v, opts.decimals ?? 2);
    case "integer":
      return formatNumber(v, 0);
    case "number":
    default:
      return formatNumber(v, opts.decimals ?? 2);
  }
}
