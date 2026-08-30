# CalcyTub — Product Requirements Document

## Original Problem Statement
Build a fast, SEO-first, mobile-first calculator platform called **CalcyTub** with the tagline "All Your Calculators in One Place". Must be exportable off Emergent (no vendor lock-in), operate independently after export, and use a reusable calculator engine that can scale to 100 → 1,000+ calculators without redesign.

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui + Lucide icons + Recharts
- **Backend**: FastAPI (JWT-auth admin, JSON file storage in `/app/backend/content/`)
- **No MongoDB, no external APIs, no paid services**
- Calculator engine: pure JS modules under `frontend/src/lib/calculators/`. Each calculator = `{ slug, name, category, inputs, compute, formula, faq, related, seoTitle, metaDescription, disclaimer }`. Renderer supports optional `extras` array for rich result panels (score, factors, charts, comparison tables).
- **Content overrides**: admin can edit calculator metadata (title, desc, SEO, howItWorks, workedExample) without code changes.
- SEO: clean URLs (`/home-loan-emi-calculator`, `/finance`), BreadcrumbList + FAQPage + Article + WebSite JSON-LD, sitemap.xml (52 URLs, regeneratable via `scripts/build-sitemap.mjs`), robots.txt.

## User Personas
1. **General user** (mobile) — quick numeric answers, no signup.
2. **Indian user** — Home Loan EMI, SIP, FD, GST in ₹.
3. **US/global user** — Mortgage, Refinance, Amortization in $.
4. **Owner (admin)** — edits copy/SEO, publishes articles, manages settings.

## Core Requirements (static)
- 30 launch calculators (finance, math, physics, chemistry, health, date/time) — all implemented.
- Client-side math only; no inputs sent to server.
- Reusable calculator engine.
- Admin panel with env-var auth, edit overrides/articles/settings.
- Dark mode default + light mode toggle (persisted).
- Legal pages (privacy, terms, disclaimer, advertising, editorial), About, Contact (mailto).
- Article system.

## What's Been Implemented (2026-02)
### Iteration 1 — MVP (2026-02-08)
- Reusable calculator engine + 30 calculators (Finance 8, Math 9, Physics 5, Chemistry 4, Health 4).
- Homepage, categories index, category page, calculator page, calculators index, articles, admin, legal, about, contact, 404.
- JSON-file backend for overrides/articles/settings + JWT admin auth.
- Backend regression suite: 23/23 pytest passing.
- **Testing**: iteration_1 → 100% pass on both.

### Iteration 2 — Interest-rate bug fix
- HTML5 step/min/max removed on numeric inputs → arbitrary decimals accepted.
- **Testing**: iteration_2 → 11/11 PASS.

### Iteration 3 — Mortgage Decision Analyzer + Dark Mode
- New `/mortgage-decision-calculator` with 12 inputs, transparent 8-factor score (0-100), inflation-vs-loan chart (recharts), term comparison (10/15/20/25/30 yr), rate scenarios (5–10%), key metrics, break-even, insights.
- `CalculatorRenderer` extended with `extras` array (score, factors, chart, keyMetrics, termComparison, rateScenarios, breakEven, insights).
- Dark mode default + `theme-toggle` in header (localStorage `calcytub_theme`), FOUC prevention via inline script in `index.html`.
- **Testing**: iteration_3 → 100% pass.

### Iteration 4 — SEO overhaul + Visual redesign
- Clean SEO URLs: `/<slug>` (SlugResolver resolves calc-or-category), legacy `/calculator/:slug` and `/category/:slug` client-redirect to new URLs.
- BreadcrumbList + FAQPage JSON-LD on calc pages, BreadcrumbList on category pages, Article + BreadcrumbList on articles, WebSite + SearchAction on homepage.
- `robots.txt` (Disallow /admin, Sitemap) + `sitemap.xml` (52 URLs, script-generated).
- Icon system (`lib/icons.js`) — lucide icon per calculator + per category.
- Redesigned `CalculatorCard` (icon badge + category chip + Calculate arrow), `CategoryPage`/`CategoriesIndex` with icons + counts, redesigned homepage hero with large search + live results + quick category rail + stat pills.
- **Testing**: iteration_4 → 100% pass (20/20 frontend scenarios + 23/23 backend).

## Prioritized Backlog
### P1 (SEO polish, quick wins)
- Move sitemap host to env var (currently hardcoded `https://calcytub.com`) so preview/staging generate the correct host.
- Absolute URL in `Sitemap:` directive of `robots.txt`.
- `og:type=article` + `article:published_time` on article pages.
- Prerender/SSG for the 52 sitemap URLs so non-JS crawlers see per-page meta.
- Markdown rendering for article body (currently plain text).

### P2 (Feature growth)
- Add more calculators from the future list (Compound Interest, Simple Interest, Home Loan Prepayment, Loan Eligibility, Body Fat, Pregnancy Due Date, unit converters, YouTube Earnings, Profit Margin, etc.).
- Business, Marketing, Construction, Unit Converters categories.

### P3 (Nice-to-have)
- Google AdSense wire-up (only after AdSense approval).
- Additional ad slots on homepage / category / article pages.
- Live newsletter capture.
- Multi-currency picker for finance calculators.

## Test Credentials
See `/app/memory/test_credentials.md`.

## Deployment / Export
See `/app/README.md`. In summary:
- `yarn build` in frontend, static host.
- `uvicorn server:app` for backend (any Python host).
- `backend/content/*.json` is the entire mutable state — back up regularly.
- Everything works standalone without Emergent.
