import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { ALL_CALCULATORS, getCalculator } from "../lib/calculators";
import { getCalcIcon } from "../lib/icons";
import CalculatorRenderer from "../components/CalculatorRenderer";
import { useSEO } from "../lib/useSEO";

// Compare Calculators: pick any calculator and run two independent scenarios
// side-by-side. Both instances use the existing reusable CalculatorRenderer.
const COMPARABLE = ALL_CALCULATORS.filter((c) => c.inputs && c.inputs.length >= 1);

export default function ComparePage() {
  const [sp, setSp] = useSearchParams();
  const initial = sp.get("calc") || "home-loan-emi-calculator";
  const [slug, setSlug] = useState(initial);
  const calc = useMemo(() => getCalculator(slug) || getCalculator("home-loan-emi-calculator"), [slug]);
  const Icon = getCalcIcon(calc.slug);

  useSEO({
    title: "Compare Calculators — CalcyTub",
    description:
      "Run two scenarios side-by-side. Compare loans, investments and other calculations to see which scenario works best for you.",
    canonicalPath: "/compare",
  });

  const change = (next) => {
    setSlug(next);
    sp.set("calc", next);
    setSp(sp);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start gap-3 mb-2">
        <span aria-hidden="true" className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <ArrowLeftRight className="w-5 h-5" />
        </span>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Side-by-Side</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">Compare Calculators</h1>
        </div>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl">
        Enter two different scenarios and compare the results in the same view. Great for weighing loan offers, investment plans and different assumptions.
      </p>

      <div className="calc-card p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="compare-calc" className="text-sm font-medium">Choose a calculator</label>
        <select
          id="compare-calc"
          data-testid="compare-select"
          value={slug}
          onChange={(e) => change(e.target.value)}
          className="flex-1 h-11 px-3 rounded-md border border-input bg-card"
        >
          {COMPARABLE.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <Link
          to={`/${calc.slug}`}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border border-border hover:border-primary/40 text-sm"
        >
          Open standalone <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {["A", "B"].map((label) => (
          <div key={label} data-testid={`compare-panel-${label.toLowerCase()}`}>
            <div className="flex items-center gap-3 mb-3">
              <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="w-4 h-4" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Scenario {label}</div>
                <h2 className="font-display text-lg font-semibold">{calc.name}</h2>
              </div>
            </div>
            {/* Key ensures the renderer resets local state when the calculator changes */}
            <CalculatorRenderer key={`${calc.slug}-${label}`} calc={calc} />
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Tip: change one input at a time between scenarios to see how sensitive the result is. Every calculation runs in your browser — nothing is sent to a server.
      </p>
    </section>
  );
}
