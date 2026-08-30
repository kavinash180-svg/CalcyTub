import DecisionChart from "./DecisionChart";
import { formatResult, formatCurrency, formatNumber } from "../lib/formatters";

function ScoreCard({ score, rating }) {
  const tone =
    score >= 80 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" :
    score >= 60 ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300" :
    "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300";
  return (
    <div className={`rounded-xl border p-5 flex items-center gap-5 ${tone}`} data-testid="decision-score">
      <div className="text-5xl sm:text-6xl font-display font-semibold tabular-nums">{score}</div>
      <div>
        <div className="text-xs uppercase tracking-widest opacity-80">Mortgage Decision Score</div>
        <div className="font-display text-xl sm:text-2xl font-semibold">{rating}</div>
        <div className="text-xs mt-1 opacity-70">Educational estimate only — not financial advice.</div>
      </div>
    </div>
  );
}

function FactorGrid({ factors }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="factor-grid">
      {factors.map((f, i) => (
        <div key={f.name} className="rounded-lg border border-border bg-card p-4" data-testid={`factor-${i}`}>
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{f.name}</span>
            <span className="font-display text-xl font-semibold tabular-nums">{f.score}<span className="text-xs opacity-60">/100</span></span>
          </div>
          <div className="mt-2 h-1.5 rounded bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${f.score}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{f.note}</div>
        </div>
      ))}
    </div>
  );
}

function KeyMetrics({ items, currency }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m, i) => (
        <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</div>
          <div className="mt-1 font-display text-xl font-semibold">{formatCurrency(m.value, currency)}</div>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({ rows, currency, bestTerm }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border" data-testid="term-comparison">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            {["Term", "Monthly Payment", "Total Interest", "Total Payment", "Score"].map((h) => (
              <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.term} className={`border-t border-border ${r.term === bestTerm ? "bg-emerald-500/5" : ""}`}>
              <td className="px-3 py-2 font-medium">
                {r.term} yrs {r.term === bestTerm && <span className="ml-1 text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Highest score</span>}
              </td>
              <td className="px-3 py-2">{formatCurrency(r.monthly, currency)}</td>
              <td className="px-3 py-2">{formatCurrency(r.totalInterest, currency)}</td>
              <td className="px-3 py-2">{formatCurrency(r.totalPayment, currency)}</td>
              <td className="px-3 py-2 tabular-nums">{r.score}/100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RateScenariosTable({ rows, currency }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border" data-testid="rate-scenarios">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/60">
          <tr>
            {["Rate", "Monthly Payment", "Total Interest", "Score"].map((h) => (
              <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.rate} className="border-t border-border">
              <td className="px-3 py-2 font-medium">{r.rate}%</td>
              <td className="px-3 py-2">{formatCurrency(r.monthly, currency)}</td>
              <td className="px-3 py-2">{formatCurrency(r.totalInterest, currency)}</td>
              <td className="px-3 py-2 tabular-nums">{r.score}/100</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-t border-border">
        Illustrative scenarios only. Your actual entered rate is used for the primary calculation above.
      </div>
    </div>
  );
}

function InsightsList({ items }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2" data-testid="insights-list">
      {items.map((t, i) => (
        <li key={i} className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2 align-middle" />
          {t}
        </li>
      ))}
    </ul>
  );
}

function BreakEven({ years, closingCost }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Break-Even (illustrative)</div>
      {years == null ? (
        <p>Estimated closing costs (~2% of home price ≈ {formatCurrency(closingCost, "USD")}) are not recovered by assumed appreciation within the loan term.</p>
      ) : (
        <p>Estimated appreciation covers closing costs (~2% ≈ {formatCurrency(closingCost, "USD")}) in about <strong>{years} year{years === 1 ? "" : "s"}</strong>. Actual break-even depends on property taxes, insurance, maintenance, selling costs, actual appreciation and inflation.</p>
      )}
    </div>
  );
}

const Section = ({ title, children }) => (
  <section className="mt-6">
    <h3 className="font-display text-lg font-semibold mb-3">{title}</h3>
    {children}
  </section>
);

export default function DecisionExtras({ extras }) {
  if (!extras?.length) return null;
  return (
    <div className="mt-6" data-testid="decision-extras">
      {extras.map((ex, i) => {
        switch (ex.type) {
          case "score":
            return <div key={i} className="mt-6"><ScoreCard {...ex.data} /></div>;
          case "factors":
            return <Section key={i} title="Factor Scores"><FactorGrid factors={ex.data} /></Section>;
          case "chart":
            return (
              <Section key={i} title={ex.data.title || "Timeline"}>
                <div className="rounded-lg border border-border bg-card p-2 sm:p-4">
                  <DecisionChart series={ex.data.series} />
                </div>
              </Section>
            );
          case "keyMetrics":
            return <Section key={i} title="Key Metrics"><KeyMetrics {...ex.data} /></Section>;
          case "termComparison":
            return <Section key={i} title="Loan Term Comparison"><ComparisonTable {...ex.data} /></Section>;
          case "rateScenarios":
            return <Section key={i} title="Interest Rate Scenarios"><RateScenariosTable {...ex.data} /></Section>;
          case "breakEven":
            return <Section key={i} title="Break-Even Estimate"><BreakEven {...ex.data} /></Section>;
          case "insights":
            return <Section key={i} title="Mortgage Decision Insights"><InsightsList items={ex.data} /></Section>;
          default:
            return null;
        }
      })}
    </div>
  );
}
