import { Link } from "react-router-dom";
import { CATEGORIES } from "../lib/categories";
import { ALL_CALCULATORS } from "../lib/calculators";
import CalculatorCard from "../components/CalculatorCard";
import { useSEO } from "../lib/useSEO";

export default function CalculatorsIndexPage() {
  useSEO({
    title: `All Calculators — CalcyTub (${ALL_CALCULATORS.length})`,
    description: "Browse every free calculator on CalcyTub, grouped by category.",
    canonicalPath: "/calculators",
  });
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold">Browse</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">All Calculators</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {ALL_CALCULATORS.length} free calculators, grouped by category. Use the
          search box in the header to jump to a calculator instantly.
        </p>
      </div>
      {CATEGORIES.map((cat) => {
        const list = ALL_CALCULATORS.filter((c) => c.category === cat.slug);
        if (!list.length) return null;
        return (
          <div key={cat.slug} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">{cat.name}</h2>
              <Link to={`/${cat.slug}`} className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => <CalculatorCard key={c.slug} calc={c} />)}
            </div>
          </div>
        );
      })}
    </section>
  );
}
