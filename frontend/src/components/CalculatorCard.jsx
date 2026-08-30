import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategory } from "../lib/categories";
import { getCalcIcon } from "../lib/icons";

export default function CalculatorCard({ calc }) {
  const cat = getCategory(calc.category);
  const Icon = getCalcIcon(calc.slug);
  return (
    <Link
      to={`/${calc.slug}`}
      className="calc-card group relative flex flex-col justify-between h-full p-5"
      data-testid={`calc-card-${calc.slug}`}
      aria-label={`Open ${calc.name}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary transition-colors"
          >
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground bg-muted/60 px-2 py-1 rounded-full">
            {cat?.name || calc.category}
          </span>
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold leading-tight">{calc.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{calc.shortDescription}</p>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-90 group-hover:opacity-100">
        Calculate <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
