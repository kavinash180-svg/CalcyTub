import { Link, useParams } from "react-router-dom";
import { getCalculator } from "../lib/calculators";
import { getCategory } from "../lib/categories";
import CalculatorRenderer from "../components/CalculatorRenderer";
import CalculatorCard from "../components/CalculatorCard";
import AdSlot from "../components/AdSlot";
import { useSEO, breadcrumbSchema, faqSchema } from "../lib/useSEO";
import { useOverrides, mergeOverride } from "../lib/useOverrides";

const DISCLAIMERS = {
  finance:
    "Finance calculators provide estimates for educational purposes only. Results are not financial advice, loan offers, or guarantees. Actual figures depend on lender policies, fees, taxes and your personal circumstances.",
  health:
    "Health calculators provide estimates only and are not medical advice or diagnosis. Consult a qualified healthcare professional for medical decisions.",
};

export default function CalculatorPage() {
  const params = useParams();
  const slug = params.slug || window.location.pathname.replace(/^\/|\/$/g, "");
  const overrides = useOverrides();
  const baseCalc = getCalculator(slug);
  const calc = baseCalc ? mergeOverride(baseCalc, overrides) : null;

  useSEO({
    title: calc ? (calc.seoTitle || `${calc.name} — CalcyTub`) : "Calculator — CalcyTub",
    description: calc ? calc.metaDescription : "",
    keywords: calc ? calc.keywords : [],
    canonicalPath: `/${slug}`,
    jsonLd: calc
      ? [
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.name,
            applicationCategory: "UtilitiesApplication",
            description: calc.metaDescription,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            operatingSystem: "Any",
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            ...(getCategory(calc.category)
              ? [{ name: getCategory(calc.category).name, path: `/${calc.category}` }]
              : []),
            { name: calc.name, path: `/${slug}` },
          ]),
          faqSchema(calc.faq),
        ]
      : null,
  });

  if (!calc) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Calculator not found</h1>
        <Link to="/calculators" className="text-primary hover:underline mt-3 inline-block">
          Back to calculators
        </Link>
      </section>
    );
  }

  const cat = getCategory(calc.category);
  const related = (calc.related || [])
    .map((s) => getCalculator(s))
    .filter(Boolean);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-xs text-muted-foreground mb-3" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> ›{" "}
        <Link to="/categories" className="hover:text-primary">Categories</Link> ›{" "}
        {cat && (
          <>
            <Link to={`/${cat.slug}`} className="hover:text-primary">{cat.name}</Link> ›{" "}
          </>
        )}
        <span>{calc.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">{calc.name}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">{calc.shortDescription}</p>
      </header>

      <CalculatorRenderer calc={calc} />

      <AdSlot label="Sponsored" />

      <section className="mt-8 space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold">Formula</h2>
          <div className="mt-2 rounded-md bg-muted/50 border border-border px-4 py-3 font-mono text-sm">
            {calc.formula}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold">How It Works</h2>
          <p className="mt-2 text-sm text-foreground/90">{calc.howItWorks}</p>
        </div>

        {calc.workedExample && (
          <div>
            <h2 className="font-display text-xl font-semibold">Worked Example</h2>
            <p className="mt-2 text-sm text-foreground/90">{calc.workedExample}</p>
          </div>
        )}

        {calc.assumptions?.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold">Assumptions</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-foreground/90 space-y-1">
              {calc.assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}

        {calc.faq?.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold">FAQ</h2>
            <div className="mt-3 space-y-2">
              {calc.faq.map((f, i) => (
                <details key={i} className="calc-card p-4">
                  <summary className="cursor-pointer font-medium">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold">Related Calculators</h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-3">
              {related.map((r) => <CalculatorCard key={r.slug} calc={r} />)}
            </div>
          </div>
        )}

        {calc.disclaimer && (
          <aside className="rounded-md border border-amber-300/50 bg-amber-50 text-amber-900 px-4 py-3 text-xs">
            <strong className="font-semibold">Disclaimer: </strong>
            {DISCLAIMERS[calc.disclaimer]}
          </aside>
        )}
      </section>
    </article>
  );
}
