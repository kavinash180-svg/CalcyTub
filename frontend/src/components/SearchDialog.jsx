import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { searchCalculators } from "../lib/calculators";

export default function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const results = useMemo(() => searchCalculators(q), [q]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "/" && !open && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  const go = (slug) => {
    onClose();
    nav(`/${slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
      data-testid="search-dialog"
    >
      <div
        className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search calculators… try 'mortgage', 'BMI', 'percentage'"
            className="flex-1 bg-transparent outline-none text-base"
            data-testid="search-input"
          />
          <button onClick={onClose} className="text-xs text-muted-foreground px-2 py-1 border rounded">
            Esc
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {q && results.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No calculators match "{q}".</div>
          )}
          {results.map((r) => (
            <button
              key={r.slug}
              onClick={() => go(r.slug)}
              className="w-full text-left px-4 py-3 flex items-start justify-between hover:bg-muted border-b border-border last:border-0"
              data-testid={`search-result-${r.slug}`}
            >
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.shortDescription}</div>
              </div>
              <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
