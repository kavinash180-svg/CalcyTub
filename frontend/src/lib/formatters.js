// Formatting helpers
import { formatCurrency as formatCurrencyIntl, getCurrency } from "./currency";

export function formatCurrency(value, currency = "USD") {
  return formatCurrencyIntl(value, currency);
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
  if (v === null || v === undefined || (typeof v === "number" && !isFinite(v))) return "—";
  if (typeof v === "string") return v;
  switch (format) {
    case "currency":
      return formatCurrency(v, opts.currency || "USD");
    case "percent":
      return formatPercent(v, opts.decimals ?? 2);
    case "integer":
      return formatNumber(v, 0);
    case "number":
    default:
      return formatNumber(v, opts.decimals ?? 2);
  }
}
