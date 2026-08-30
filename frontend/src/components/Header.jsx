import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, Calculator, Sun, Moon } from "lucide-react";
import SearchDialog from "./SearchDialog";
import { useTheme } from "../lib/useTheme";

const nav = [
  { to: "/", label: "Home" },
  { to: "/calculators", label: "Calculators" },
  { to: "/categories", label: "Categories" },
  { to: "/compare", label: "Compare" },
  { to: "/articles", label: "Articles" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();
  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Calculator className="w-5 h-5" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              Calcy<span className="text-primary">Tub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              data-testid="open-search-btn"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-border hover:border-primary/40 bg-card"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-muted-foreground">Search calculators…</span>
              <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                /
              </kbd>
            </button>
            <button
              onClick={toggle}
              data-testid="theme-toggle"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-md border border-border hover:border-primary/40 bg-card"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 rounded-md hover:bg-muted"
              data-testid="mobile-menu-btn"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium"
                  data-testid={`mnav-${n.label.toLowerCase()}`}
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
