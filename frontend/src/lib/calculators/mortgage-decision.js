// Mortgage Decision Analyzer — educational decision-analysis calculator.
// Uses the existing calculator engine and adds "extras" rendered by
// CalculatorRenderer for score, factors, chart, term comparison, rate
// scenarios and insights.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const emiFormula = (P, rMonthly, n) => {
  if (rMonthly === 0) return P / n;
  const pow = Math.pow(1 + rMonthly, n);
  return (P * rMonthly * pow) / (pow - 1);
};

const rateFactor = (rate) => clamp(100 - Math.max(0, rate - 4) * 10, 0, 100);
const dtiFactor = (dti) =>
  dti < 28 ? 95 : dti < 36 ? 82 : dti < 43 ? 62 : Math.max(20, 100 - dti);
const termFactor = (years) => clamp(110 - years * 1.5, 40, 95);
const interestFactor = (ratio) =>
  ratio < 0.5 ? 90 : ratio < 1 ? 75 : ratio < 1.5 ? 60 : ratio < 2 ? 45 : 30;
const ltvFactor = (ltv) =>
  ltv < 60 ? 95 : ltv < 70 ? 88 : ltv < 80 ? 80 : ltv < 90 ? 65 : 50;

function scenarioScore({ rate, years, ratio, ltv, dti, inflation, appreciation, invReturn }) {
  const factors = [
    rateFactor(rate),
    dtiFactor(dti),
    termFactor(years),
    interestFactor(ratio),
    ltvFactor(ltv),
    clamp(60 + (inflation - rate) * 4, 30, 95),
    clamp(50 + (appreciation - 3) * 6, 25, 95),
    clamp(70 + (rate - invReturn) * 3, 30, 95),
  ];
  return Math.round(factors.reduce((a, b) => a + b, 0) / factors.length);
}

function ratingFor(score) {
  if (score >= 90) return "Very Favorable";
  if (score >= 80) return "Favorable";
  if (score >= 70) return "Generally Favorable";
  if (score >= 60) return "Mixed";
  if (score >= 50) return "Caution";
  return "Less Favorable";
}

// Fast balance-at-year computation
function balanceAtYear(loan, rMonthly, emi, years) {
  let b = loan;
  const months = Math.round(years * 12);
  for (let m = 0; m < months; m++) {
    const i = b * rMonthly;
    b -= emi - i;
  }
  return Math.max(0, b);
}

export const mortgageDecisionCalculator = {
  slug: "mortgage-decision-calculator",
  name: "Mortgage Decision Analyzer",
  category: "finance",
  shortDescription:
    "Educational decision-analysis for a mortgage: score, factors, inflation vs. loan chart, term comparison and rate scenarios — all local, all transparent.",
  seoTitle: "Mortgage Decision Calculator – Should You Take a Mortgage?",
  metaDescription:
    "Analyze mortgage interest rates, loan terms, inflation, affordability, total interest and estimated home value with our free mortgage decision calculator.",
  keywords: [
    "mortgage decision", "should i buy a house calculator",
    "mortgage vs invest", "mortgage affordability", "home appreciation",
  ],
  currency: "USD",
  inputs: [
    { key: "homePrice", label: "Home Price", type: "number", prefix: "$", defaultValue: 500000 },
    { key: "downPayment", label: "Down Payment", type: "number", prefix: "$", defaultValue: 100000 },
    { key: "rate", label: "Mortgage Interest Rate", type: "number", suffix: "%", defaultValue: 6.5 },
    { key: "years", label: "Loan Term", type: "number", suffix: "years", defaultValue: 30 },
    { key: "inflation", label: "Expected Inflation", type: "number", suffix: "%", defaultValue: 3 },
    { key: "appreciation", label: "Home Appreciation", type: "number", suffix: "%", defaultValue: 4 },
    { key: "invReturn", label: "Expected Investment Return", type: "number", suffix: "%", defaultValue: 8 },
    { key: "income", label: "Monthly Income", type: "number", prefix: "$", defaultValue: 9000 },
    { key: "existingDebt", label: "Existing Monthly Debt", type: "number", prefix: "$", defaultValue: 500 },
    { key: "taxPct", label: "Property Tax (annual)", type: "number", suffix: "%", defaultValue: 1.1 },
    { key: "insAnnual", label: "Home Insurance (annual)", type: "number", prefix: "$", defaultValue: 1500 },
    { key: "maintenance", label: "Monthly Maintenance", type: "number", prefix: "$", defaultValue: 200 },
  ],
  compute: (v) => {
    const {
      homePrice, downPayment, rate, years, inflation, appreciation,
      invReturn, income, existingDebt, taxPct, insAnnual, maintenance,
    } = v;
    if (homePrice <= 0 || downPayment < 0 || downPayment >= homePrice)
      throw new Error("Down payment must be between 0 and less than home price.");
    if (income <= 0) throw new Error("Monthly income must be greater than zero.");

    const loan = homePrice - downPayment;
    const rMonthly = rate / 100 / 12;
    const n = Math.round(years * 12);
    const emi = emiFormula(loan, rMonthly, n);
    const totalPaid = emi * n;
    const totalInterest = totalPaid - loan;
    const ratio = totalInterest / loan;
    const ltv = (loan / homePrice) * 100;
    const monthlyTax = (homePrice * (taxPct / 100)) / 12;
    const monthlyIns = insAnnual / 12;
    const monthlyTotal = emi + monthlyTax + monthlyIns + maintenance;
    const dti = ((existingDebt + monthlyTotal) / income) * 100;

    const futureHomeValue = homePrice * Math.pow(1 + appreciation / 100, years);
    const inflationAdjustedHome = futureHomeValue / Math.pow(1 + inflation / 100, years);
    const inflationAdjustedTotalPaid = totalPaid / Math.pow(1 + inflation / 100, years);
    const opportunityCost = downPayment * Math.pow(1 + invReturn / 100, years);

    // Chart data (yearly)
    const chart = [];
    for (let y = 0; y <= years; y++) {
      const bal = y === 0 ? loan : balanceAtYear(loan, rMonthly, emi, y);
      const home = homePrice * Math.pow(1 + appreciation / 100, y);
      const inflDeflator = Math.pow(1 + inflation / 100, y);
      chart.push({
        year: y,
        balance: Math.round(bal),
        homeValue: Math.round(home),
        realHome: Math.round(home / inflDeflator),
        realBalance: Math.round(bal / inflDeflator),
      });
    }

    // Factors & overall score
    const factors = [
      { name: "Interest Rate", score: rateFactor(rate), note: `${rate}% p.a.` },
      { name: "Affordability", score: dtiFactor(dti), note: `DTI ${dti.toFixed(1)}%` },
      { name: "Loan Term", score: termFactor(years), note: `${years} years` },
      { name: "Total Interest Cost", score: interestFactor(ratio), note: `Interest is ${(ratio * 100).toFixed(0)}% of loan` },
      { name: "Loan-to-Value", score: ltvFactor(ltv), note: `${ltv.toFixed(1)}%` },
      { name: "Inflation Effect", score: clamp(60 + (inflation - rate) * 4, 30, 95), note: `Inflation ${inflation}% vs rate ${rate}%` },
      { name: "Home Appreciation", score: clamp(50 + (appreciation - 3) * 6, 25, 95), note: `${appreciation}% p.a. assumed` },
      { name: "Investment Opportunity Cost", score: clamp(70 + (rate - invReturn) * 3, 30, 95), note: `Expected return ${invReturn}% vs rate ${rate}%` },
    ];
    const overall = Math.round(factors.reduce((s, f) => s + f.score, 0) / factors.length);
    const rating = ratingFor(overall);

    // Term comparison
    const terms = [10, 15, 20, 25, 30].map((t) => {
      const nn = t * 12;
      const e = emiFormula(loan, rMonthly, nn);
      const tp = e * nn;
      const ti = tp - loan;
      const monTot = e + monthlyTax + monthlyIns + maintenance;
      const dtiT = ((existingDebt + monTot) / income) * 100;
      const s = scenarioScore({ rate, years: t, ratio: ti / loan, ltv, dti: dtiT, inflation, appreciation, invReturn });
      return { term: t, monthly: e, totalInterest: ti, totalPayment: tp, score: s };
    });
    const bestTerm = terms.reduce((a, b) => (b.score > a.score ? b : a));

    // Rate scenarios
    const rateScenarios = [5, 6, 7, 8, 9, 10].map((rt) => {
      const rr = rt / 100 / 12;
      const e = emiFormula(loan, rr, n);
      const ti = e * n - loan;
      const monTot = e + monthlyTax + monthlyIns + maintenance;
      const dtiS = ((existingDebt + monTot) / income) * 100;
      const s = scenarioScore({ rate: rt, years, ratio: ti / loan, ltv, dti: dtiS, inflation, appreciation, invReturn });
      return { rate: rt, monthly: e, totalInterest: ti, score: s };
    });

    // Insights
    const insights = [];
    if (dti > 43) insights.push("Your estimated monthly obligations represent a relatively high share of your stated income.");
    else if (dti > 36) insights.push("Your estimated monthly obligations are moderate relative to stated income.");
    else insights.push("Your stated income comfortably covers the estimated monthly payment under these assumptions.");
    if (rate >= 8) insights.push("The entered interest rate is on the higher side historically; even small rate reductions materially change total interest paid.");
    if (inflation > rate) insights.push("Higher inflation than the mortgage rate reduces the real burden of fixed-rate debt over time, but does not eliminate the nominal interest cost.");
    insights.push("Extending the loan term lowers the monthly payment but increases total interest.");
    if (invReturn > rate + 2) insights.push(`Your expected investment return (${invReturn}%) is well above the mortgage rate — the opportunity cost of the down payment may be significant.`);
    if (ltv > 80) insights.push("Loan-to-value above 80% typically means PMI is required with US lenders, adding to monthly cost.");
    insights.push("The result is sensitive to the assumed home-appreciation and inflation rates.");

    // Break-even
    const closingCost = homePrice * 0.02;
    let breakEvenYears = null;
    for (let y = 1; y <= years; y++) {
      const gain = homePrice * Math.pow(1 + appreciation / 100, y) - homePrice;
      if (gain >= closingCost) { breakEvenYears = y; break; }
    }

    return {
      results: [
        { label: "Monthly P & I Payment", value: emi, format: "currency", currency: "USD", primary: true },
        { label: "Loan Amount", value: loan, format: "currency", currency: "USD" },
        { label: "Total Interest", value: totalInterest, format: "currency", currency: "USD" },
        { label: "Total Mortgage Payment", value: totalPaid, format: "currency", currency: "USD" },
        { label: "Debt-to-Income Ratio", value: dti, format: "percent" },
        { label: "Loan-to-Value Ratio", value: ltv, format: "percent" },
      ],
      extras: [
        { type: "score", data: { score: overall, rating } },
        { type: "factors", data: factors },
        {
          type: "chart",
          data: {
            series: chart,
            title: "Mortgage Balance vs. Home Value (nominal & inflation-adjusted)",
          },
        },
        {
          type: "keyMetrics",
          data: {
            currency: "USD",
            items: [
              { label: "Estimated Future Home Value", value: futureHomeValue },
              { label: "Inflation-Adjusted Future Home Value", value: inflationAdjustedHome },
              { label: "Inflation-Adjusted Total Paid", value: inflationAdjustedTotalPaid },
              { label: "Opportunity Cost of Down Payment", value: opportunityCost },
              { label: "Estimated Closing Costs (2%)", value: closingCost },
            ],
          },
        },
        {
          type: "termComparison",
          data: { rows: terms, currency: "USD", bestTerm: bestTerm.term },
        },
        {
          type: "rateScenarios",
          data: { rows: rateScenarios, currency: "USD" },
        },
        {
          type: "breakEven",
          data: {
            years: breakEvenYears,
            closingCost,
          },
        },
        { type: "insights", data: insights },
      ],
    };
  },
  formula:
    "P&I = P·r·(1+r)ⁿ/((1+r)ⁿ−1) ; DTI = (existing debt + P&I + tax + insurance + maintenance) / income ; Real value = Nominal / (1+inflation)ᵗ ; Opportunity cost = down × (1+return)ᵗ",
  howItWorks:
    "The calculator uses the standard amortization formula for monthly P&I and adds tax, insurance and maintenance for total monthly cost. It projects home value and mortgage balance year-by-year and deflates each by the inflation assumption to give inflation-adjusted (real) values. Eight independent factors are scored 0–100 and averaged into the overall Mortgage Decision Score.",
  workedExample:
    "$500,000 home, $100,000 down, 6.5% for 30y, 3% inflation, 4% appreciation, 8% investment return, $9,000 income: P&I ≈ $2,528/mo, DTI ≈ 39%, LTV = 80%, overall score in the 60s (Mixed) under these assumptions.",
  assumptions: [
    "Fixed interest rate for the entire term.",
    "Constant inflation, appreciation and investment return over the horizon.",
    "Tax and insurance rates are constant; maintenance is a fixed monthly amount.",
    "No PMI, prepayments, refinancing, HOA fees or selling costs modelled.",
    "The score is a transparent educational aggregate of eight factors, not a professional recommendation.",
  ],
  faq: [
    { q: "Is taking a mortgage a good financial decision?", a: "It depends on your rate, income, alternatives and personal goals. This tool provides an educational score to help you think through the trade-offs — it is not financial advice." },
    { q: "How does inflation affect a fixed-rate mortgage?", a: "Because the monthly payment is fixed in nominal dollars, higher inflation erodes the real burden of the debt over time. It does not, however, reduce the nominal interest you pay." },
    { q: "Is a shorter mortgage term better?", a: "Shorter terms carry higher monthly payments but far less total interest. The Loan Term Comparison table shows the trade-off under your assumptions." },
    { q: "What mortgage interest rate is considered favorable?", a: "Historically, rates below 5% are considered very favorable. This is context-dependent and changes with the macro environment." },
    { q: "How does home appreciation affect the calculation?", a: "It changes the estimated future home value and thus the break-even period. The result is sensitive to this assumption." },
    { q: "Should I compare mortgage interest with inflation?", a: "Yes — if inflation exceeds your fixed rate, the real cost of the mortgage falls over time. It's one of many considerations." },
    { q: "Can this calculator tell me whether I should buy a house?", a: "No. It is an educational estimate under stated assumptions and does not consider taxes, closing costs, selling costs, life goals or personal risk tolerance." },
  ],
  related: [
    "mortgage-calculator",
    "mortgage-amortization-calculator",
    "refinance-calculator",
    "home-loan-emi-calculator",
    "personal-loan-emi-calculator",
    "sip-calculator",
  ],
  disclaimer: "finance",
  decisionAnalyzer: true,
};
