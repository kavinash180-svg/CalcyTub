import { Link } from "react-router-dom";
import { useSEO } from "../lib/useSEO";

export default function NotFoundPage() {
  useSEO({ title: "404 — CalcyTub", description: "Page not found" });
  return (
    <section className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-xs uppercase tracking-widest text-primary font-semibold">404</div>
      <h1 className="font-display text-4xl font-semibold mt-2">Page not found</h1>
      <p className="text-muted-foreground mt-3">
        The page you're looking for doesn't exist. Try the search bar in the header or browse all calculators.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/" className="h-10 inline-flex items-center px-4 rounded-md bg-primary text-primary-foreground">Home</Link>
        <Link to="/calculators" className="h-10 inline-flex items-center px-4 rounded-md border border-border">All calculators</Link>
      </div>
    </section>
  );
}
