import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, getCategory } from "../lib/categories";
import { getByCategory } from "../lib/calculators";
import CalculatorCard from "../components/CalculatorCard";
import { useSEO, breadcrumbSchema } from "../lib/useSEO";
import { getCategoryIcon } from "../lib/icons";

export function CategoriesIndexPage() {
  useSEO({
    title: "Calculator Categories — CalcyTub",
    description: "Explore CalcyTub calculators by category — finance, math, physics, chemistry, health and more.",
    canonicalPath: "/categories",
    jsonLd: breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Categories", path: "/categories" },
    ]),
  });
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">Browse by Category</h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-2xl">Explore calculators by topic. Each category is designed to grow to hundreds of tools.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const Icon = getCategoryIcon(c.slug);
          const count = getByCategory(c.slug).length;
          return (
            <Link
              key={c.slug}
              to={`/${c.slug}`}
              data-testid={`cat-card-${c.slug}`}
              className="calc-card group p-5 flex flex-col"
              aria-label={`Open ${c.name} category`}
            >
              <div className="flex items-start justify-between">
                <span aria-hidden="true" className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </span>
                {c.comingSoon ? (
                  <span className="text-[10px] uppercase tracking-widest bg-muted text-muted-foreground px-2 py-1 rounded-full">Coming soon</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/60 px-2 py-1 rounded-full">
                    {count} {count === 1 ? "calc" : "calcs"}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground flex-1">{c.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = getCategory(slug);
  const list = getByCategory(slug);
  const Icon = getCategoryIcon(slug);
  useSEO({
    title: cat ? `${cat.name} Calculators — CalcyTub` : "Category — CalcyTub",
    description: cat ? `Free ${cat.name.toLowerCase()} calculators — ${cat.tagline}` : "Calculator category",
    canonicalPath: `/${slug}`,
    jsonLd: cat
      ? breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: cat.name, path: `/${slug}` },
        ])
      : null,
  });
  if (!cat) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Category not found</h1>
        <Link to="/categories" className="text-primary hover:underline mt-3 inline-block">
          Back to categories
        </Link>
      </section>
    );
  }
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link> ›{" "}
        <Link to="/categories" className="hover:text-primary">Categories</Link> ›{" "}
        <span>{cat.name}</span>
      </nav>
      <div className="flex items-start gap-4 mb-8">
        <span aria-hidden="true" className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="w-7 h-7" strokeWidth={1.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">{cat.name} Calculators</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{cat.tagline}</p>
        </div>
      </div>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No calculators in this category yet — we're actively adding new tools.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CalculatorCard key={c.slug} calc={c} />)}
        </div>
      )}
    </section>
  );
}
