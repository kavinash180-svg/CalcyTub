import { Link } from "react-router-dom";
import { CATEGORIES } from "../lib/categories";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-semibold">
            Calcy<span className="text-primary">Tub</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            All Your Calculators in One Place. Free, fast and accurate calculators
            for finance, math, science and everyday life.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-2">Explore</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/calculators" className="hover:text-primary">All Calculators</Link></li>
            <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
            <li><Link to="/articles" className="hover:text-primary">Articles</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-2">Popular Categories</h4>
          <ul className="space-y-1 text-sm">
            {CATEGORIES.filter((c) => !c.comingSoon).slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} className="hover:text-primary">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/legal/terms" className="hover:text-primary">Terms of Use</Link></li>
            <li><Link to="/legal/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
            <li><Link to="/legal/advertising" className="hover:text-primary">Advertising Disclosure</Link></li>
            <li><Link to="/legal/editorial" className="hover:text-primary">Editorial Policy</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} CalcyTub. All rights reserved.</span>
          <span>Calculators are provided for educational purposes and general reference only.</span>
        </div>
      </div>
    </footer>
  );
}
