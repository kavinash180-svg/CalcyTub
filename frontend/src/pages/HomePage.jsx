import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Zap, Smartphone, Sparkles } from "lucide-react";
import { CATEGORIES } from "../lib/categories";
import { ALL_CALCULATORS, getPopular, getByCategory, searchCalculators } from "../lib/calculators";
import CalculatorCard from "../components/CalculatorCard";
import { useSEO, websiteSchema } from "../lib/useSEO";
import { getCategoryIcon } from "../lib/icons";

function HeroSearch() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const results = q.length >= 2 ? searchCalculators(q).slice(0, 6) : [];
  const submit = (e) => {
    e.preventDefault();
    if (results[0]) nav(`/${results[0].slug}`);
    else nav("/calculators");
  };
  return (
    <form onSubmit={submit} className="relative mt-8 max-w-2xl" role="search">
      <div className="flex items-center gap-2 h-14 sm:h-16 rounded-2xl border border-border bg-card shadow-lg shadow-black/5 px-3 sm:px-4 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/15 transition">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search calculators…"
          data-testid="hero-search-input"
          aria-label="Search calculators"
          className="flex-1 bg-transparent outline-none text-base sm:text-lg placeholder:text-muted-foreground"
        />
        <button type="submit" data-testid="hero-search-submit" className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          Search <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card shadow-2xl overflow-hidden" data-testid="hero-search-results">
          {results.map((r) => (
            <Link
              key={r.slug}
              to={`/${r.slug}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted border-b border-border last:border-0"
            >
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.shortDescription}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>Try:</span>
        {["Mortgage", "Home Loan EMI", "BMI", "SIP", "Percentage", "Molar mass"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setQ(k)}
            className="hover:text-primary underline-offset-4 hover:underline"
          >
            {k}
          </button>
        ))}
      </div>
    </form>
  );
}

export default function HomePage() {
  useSEO({
    title: "CalcyTub — All Your Calculators in One Place",
    description:
      "Free online calculators for finance, math, physics, chemistry, health and everyday life. Fast, accurate and mobile-friendly.",
    canonicalPath: "/",
    jsonLd: websiteSchema(),
  });
  const popular = getPopular();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Free Online Calculators
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight">
              All Your Calculators<br className="hidden sm:block" /> in One Place.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl">
              Fast, accurate and easy-to-use calculators for finance, math, science, health,
              business and everyday life. Every calculation runs entirely in your browser —
              nothing is sent to a server.
            </p>
            <HeroSearch />
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> {ALL_CALCULATORS.length}+ calculators</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> 100% client-side math</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> No signup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category rail */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.filter((c) => !c.comingSoon).slice(0, 5).map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                to={`/${cat.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40 transition"
                data-testid={`hero-cat-${cat.slug}`}
              >
                <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium">{cat.name.replace(" & Mortgage", "").replace(" & Fitness", "")}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Trending</div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Popular Calculators</h2>
          </div>
          <Link to="/calculators" className="text-sm text-primary hover:underline">See all →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((c) => <CalculatorCard key={c.slug} calc={c} />)}
        </div>
      </section>

      {/* Categories */}
      {CATEGORIES.filter((c) => !c.comingSoon).map((cat) => {
        const list = getByCategory(cat.slug).slice(0, 4);
        if (!list.length) return null;
        const Icon = getCategoryIcon(cat.slug);
        return (
          <section key={cat.slug} className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Category</div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold">{cat.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{cat.tagline}</p>
                </div>
              </div>
              <Link to={`/${cat.slug}`} className="text-sm text-primary hover:underline whitespace-nowrap">
                View category →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((c) => <CalculatorCard key={c.slug} calc={c} />)}
            </div>
          </section>
        );
      })}

      {/* Why */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-6">Why use CalcyTub?</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Fast & accurate", body: "Purpose-built formulas that run instantly in your browser." },
            { icon: Smartphone, title: "Mobile-first", body: "Designed for phones first — no horizontal scrolling, big touch targets." },
            { icon: ShieldCheck, title: "Private by design", body: "Your inputs never leave your device. No accounts, no tracking of results." },
          ].map((f) => (
            <div key={f.title} className="calc-card p-5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 mb-3">
                <f.icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "Are these calculators free?", a: "Yes — every calculator on CalcyTub is free with no signup required." },
            { q: "Do you store the values I enter?", a: "No. Calculations run entirely in your browser; your inputs never leave your device." },
            { q: "Can I trust the results?", a: `Formulas are documented on each calculator page. There are ${ALL_CALCULATORS.length} calculators available today with more coming.` },
            { q: "Do finance calculators support Indian rupees?", a: "Yes — Home Loan EMI, SIP, FD, GST and Personal Loan EMI support ₹ INR." },
          ].map((f, i) => (
            <details key={i} className="calc-card p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
