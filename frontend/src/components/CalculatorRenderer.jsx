import { useEffect, useMemo, useState } from "react";
import { formatResult } from "../lib/formatters";
import { RotateCcw, Calculator as CalcIcon, Globe } from "lucide-react";
import DecisionExtras from "./DecisionExtras";
import {
  CURRENCIES, currencySymbol, isMoneyField, readStoredCurrency, persistCurrency,
} from "../lib/currency";

function defaultValues(inputs) {
  const out = {};
  for (const f of inputs) out[f.key] = f.defaultValue;
  return out;
}

function coerce(field, raw) {
  if (field.type === "number") {
    if (raw === "" || raw === null || raw === undefined) return null;
    const n = Number(raw);
    return isNaN(n) ? null : n;
  }
  if (field.type === "select") {
    const opt = field.options?.find((o) => String(o.value) === String(raw));
    return opt ? opt.value : raw;
  }
  return raw;
}

export default function CalculatorRenderer({ calc }) {
  const [values, setValues] = useState(() => defaultValues(calc.inputs));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const moneyFields = useMemo(() => calc.inputs.filter(isMoneyField), [calc.inputs]);
  const supportsCurrency = moneyFields.length > 0;
  const [currency, setCurrencyState] = useState(() =>
    supportsCurrency ? readStoredCurrency(calc.currency || "USD") : (calc.currency || "USD")
  );
  const setCurrency = (c) => {
    setCurrencyState(c);
    if (supportsCurrency) persistCurrency(c);
    // Re-run compute using the new currency for result formatting only
    if (result) setResult((prev) => prev ? { ...prev } : prev);
  };

  const canCompute = useMemo(
    () =>
      calc.inputs.every((f) => {
        if (f.type === "number") return values[f.key] !== null && values[f.key] !== "" && !isNaN(Number(values[f.key]));
        return values[f.key] !== "" && values[f.key] !== null && values[f.key] !== undefined;
      }),
    [values, calc.inputs]
  );

  useEffect(() => {
    setValues(defaultValues(calc.inputs));
    setResult(null);
    setError("");
  }, [calc.slug]);

  const onChange = (field, raw) => {
    setValues((v) => ({ ...v, [field.key]: coerce(field, raw) }));
  };

  const onCalculate = (e) => {
    e?.preventDefault();
    setError("");
    try {
      const r = calc.compute(values);
      setResult(r);
    } catch (err) {
      setResult(null);
      setError(err.message || "Calculation failed. Please check inputs.");
    }
  };

  const onReset = () => {
    setValues(defaultValues(calc.inputs));
    setResult(null);
    setError("");
  };

  return (
    <div className="calc-card p-5 sm:p-7" data-testid="calculator-card">
      {supportsCurrency && (
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>Display currency</span>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            data-testid="currency-select"
            aria-label="Display currency"
            className="h-9 px-2 rounded-md border border-input bg-card text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{`${c.symbol} ${c.code} — ${c.name}`}</option>
            ))}
          </select>
        </div>
      )}
      <form onSubmit={onCalculate} className="grid gap-4 sm:grid-cols-2">
        {calc.inputs.map((f) => (
          <div key={f.key} className={f.type === "text" ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium mb-1.5" htmlFor={`fld-${f.key}`}>
              {f.label}
            </label>
            {f.type === "select" ? (
              <select
                id={`fld-${f.key}`}
                data-testid={`input-${f.key}`}
                value={String(values[f.key] ?? "")}
                onChange={(e) => onChange(f, e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-input bg-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {f.options.map((o) => (
                  <option key={o.value} value={String(o.value)}>{o.label}</option>
                ))}
              </select>
            ) : (
              <div className="relative flex items-center">
                {(isMoneyField(f) ? currencySymbol(currency) : f.prefix) && (
                  <span className="absolute left-3 text-muted-foreground text-sm">
                    {isMoneyField(f) ? currencySymbol(currency) : f.prefix}
                  </span>
                )}
                <input
                  id={`fld-${f.key}`}
                  data-testid={`input-${f.key}`}
                  type={f.type === "date" ? "date" : f.type === "text" ? "text" : "number"}
                  step="any"
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f, e.target.value)}
                  className={`w-full h-11 rounded-md border border-input bg-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 ${
                    (isMoneyField(f) || f.prefix) ? "pl-10" : "pl-3"
                  } ${f.suffix ? "pr-16" : "pr-3"}`}
                  placeholder={f.placeholder}
                />
                {f.suffix && (
                  <span className="absolute right-3 text-muted-foreground text-sm">{f.suffix}</span>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="submit"
            disabled={!canCompute}
            data-testid="calculate-btn"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50 hover:bg-primary/90 transition"
          >
            <CalcIcon className="w-4 h-4" />
            Calculate
          </button>
          <button
            type="button"
            onClick={onReset}
            data-testid="reset-btn"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md border border-border bg-card font-medium hover:border-primary/40 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-5 p-4 rounded-md border border-destructive/40 bg-destructive/5 text-sm text-destructive" data-testid="calc-error">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6" data-testid="calc-results">
          <h3 className="font-display text-xl font-semibold mb-3">Results</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.results.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg border p-4 ${
                  r.primary
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border"
                }`}
                data-testid={`result-${i}`}
              >
                <div className={`text-xs uppercase tracking-wide ${r.primary ? "opacity-80" : "text-muted-foreground"}`}>
                  {r.label}
                </div>
                <div className={`mt-1 font-display text-2xl font-semibold ${r.primary ? "" : ""}`}>
                  {formatResult(r.value, r.format, { currency: supportsCurrency ? currency : r.currency })}
                </div>
              </div>
            ))}
          </div>

          {result.breakdown && (
            <div className="mt-6">
              <h4 className="font-display text-lg font-semibold mb-2">{result.breakdown.title}</h4>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      {result.breakdown.columns.map((c) => (
                        <th key={c} className="text-left px-3 py-2 font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2">
                            {typeof cell === "object" && cell !== null
                              ? formatResult(cell.value, cell.format, { currency: supportsCurrency && cell.format === "currency" ? currency : cell.currency })
                              : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.extras && <DecisionExtras extras={result.extras} />}
        </div>
      )}
    </div>
  );
}
