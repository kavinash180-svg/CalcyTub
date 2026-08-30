// FINANCE calculators
const emiFormula = (P, rMonthly, n) => {
  if (rMonthly === 0) return P / n;
  const pow = Math.pow(1 + rMonthly, n);
  return (P * rMonthly * pow) / (pow - 1);
};

const buildAmortization = (P, annualRate, years) => {
  const n = Math.round(years * 12);
  const r = annualRate / 100 / 12;
  const emi = emiFormula(P, r, n);
  let balance = P;
  let totalInterest = 0;
  const yearly = [];
  for (let year = 1; year <= Math.ceil(years); year++) {
    let interestYear = 0;
    let principalYear = 0;
    for (let m = 0; m < 12 && (year - 1) * 12 + m < n; m++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance -= principal;
      interestYear += interest;
      principalYear += principal;
      totalInterest += interest;
    }
    yearly.push({
      year,
      principal: principalYear,
      interest: interestYear,
      balance: Math.max(0, balance),
    });
  }
  return { emi, totalInterest, yearly, n };
};

export const financeCalculators = [
  {
    slug: "home-loan-emi-calculator",
    name: "Home Loan EMI Calculator",
    category: "finance",
    shortDescription:
      "Calculate your monthly home loan EMI, total interest and total payment for Indian housing loans in ₹.",
    seoTitle: "Home Loan EMI Calculator (India) — CalcyTub",
    metaDescription:
      "Free Home Loan EMI Calculator for India. Enter loan amount, interest rate and tenure to instantly see your monthly EMI, total interest and total payment.",
    keywords: ["home loan emi", "housing loan emi", "india home loan", "emi calculator"],
    currency: "INR",
    inputs: [
      { key: "amount", label: "Loan Amount", type: "number", prefix: "₹", min: 10000, defaultValue: 5000000, step: 10000 },
      { key: "rate", label: "Annual Interest Rate", type: "number", suffix: "%", min: 0.01, max: 50, defaultValue: 8.5, step: 0.05 },
      { key: "years", label: "Loan Tenure", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 20, step: 1 },
    ],
    compute: ({ amount, rate, years }) => {
      const { emi, totalInterest, yearly } = buildAmortization(amount, rate, years);
      const total = emi * Math.round(years * 12);
      return {
        results: [
          { label: "Monthly EMI", value: emi, format: "currency", currency: "INR", primary: true },
          { label: "Total Interest", value: totalInterest, format: "currency", currency: "INR" },
          { label: "Total Payment", value: total, format: "currency", currency: "INR" },
        ],
        breakdown: {
          title: "Yearly Amortization",
          columns: ["Year", "Principal", "Interest", "Balance"],
          rows: yearly.map((y) => [
            y.year,
            { value: y.principal, format: "currency", currency: "INR" },
            { value: y.interest, format: "currency", currency: "INR" },
            { value: y.balance, format: "currency", currency: "INR" },
          ]),
        },
      };
    },
    formula: "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)",
    howItWorks:
      "The EMI is derived using the reducing-balance method. P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the total number of monthly instalments (years × 12).",
    workedExample:
      "For a ₹50,00,000 loan at 8.5% for 20 years: r = 0.085/12 ≈ 0.00708, n = 240. EMI ≈ ₹43,391, total interest ≈ ₹54,13,879.",
    assumptions: [
      "Interest rate stays constant throughout the tenure.",
      "EMI is paid on the same day every month starting one month after disbursal.",
      "No prepayments, part-payments, insurance or processing fees are included.",
    ],
    faq: [
      { q: "Is this EMI calculator accurate for Indian banks?", a: "Yes. Indian banks use the same reducing-balance EMI formula. Small differences may occur due to daily-rest calculation or processing fees." },
      { q: "Can I include processing fees?", a: "This tool focuses on principal, rate and tenure. Add processing fees separately when comparing lenders." },
      { q: "Does prepayment reduce EMI or tenure?", a: "Most banks let you choose. Reducing tenure usually saves more interest overall." },
    ],
    related: ["personal-loan-emi-calculator", "mortgage-calculator", "mortgage-amortization-calculator", "sip-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "finance",
    shortDescription:
      "Estimate your monthly mortgage payment including principal, interest, property tax, home insurance and PMI.",
    seoTitle: "Mortgage Calculator — Monthly Payment (USD) | CalcyTub",
    metaDescription:
      "Free mortgage calculator. Enter home price, down payment, rate, term, taxes, insurance and PMI to see your monthly payment.",
    keywords: ["mortgage calculator", "monthly mortgage payment", "home loan usa"],
    currency: "USD",
    inputs: [
      { key: "price", label: "Home Price", type: "number", prefix: "$", min: 1000, defaultValue: 400000, step: 1000 },
      { key: "down", label: "Down Payment", type: "number", prefix: "$", min: 0, defaultValue: 80000, step: 1000 },
      { key: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.01, max: 30, defaultValue: 6.5, step: 0.05 },
      { key: "years", label: "Loan Term", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 30, step: 1 },
      { key: "taxPct", label: "Property Tax (annual)", type: "number", suffix: "%", min: 0, max: 10, defaultValue: 1.1, step: 0.05 },
      { key: "insAnnual", label: "Home Insurance (annual)", type: "number", prefix: "$", min: 0, defaultValue: 1500, step: 50 },
      { key: "pmiPct", label: "PMI Rate (annual)", type: "number", suffix: "%", min: 0, max: 5, defaultValue: 0.5, step: 0.05 },
    ],
    compute: ({ price, down, rate, years, taxPct, insAnnual, pmiPct }) => {
      const principal = Math.max(0, price - down);
      const r = rate / 100 / 12;
      const n = Math.round(years * 12);
      const pi = emiFormula(principal, r, n);
      const tax = (price * (taxPct / 100)) / 12;
      const ins = insAnnual / 12;
      const ltv = price > 0 ? principal / price : 0;
      const pmi = ltv > 0.8 ? (principal * (pmiPct / 100)) / 12 : 0;
      const total = pi + tax + ins + pmi;
      return {
        results: [
          { label: "Monthly Payment", value: total, format: "currency", currency: "USD", primary: true },
          { label: "Principal & Interest", value: pi, format: "currency", currency: "USD" },
          { label: "Property Tax", value: tax, format: "currency", currency: "USD" },
          { label: "Home Insurance", value: ins, format: "currency", currency: "USD" },
          { label: "PMI", value: pmi, format: "currency", currency: "USD" },
          { label: "Loan-to-Value", value: ltv * 100, format: "percent" },
        ],
      };
    },
    formula: "Monthly Payment = P&I + Tax/12 + Insurance/12 + PMI/12",
    howItWorks:
      "Principal & Interest uses the standard amortization formula. Property tax, insurance and PMI are converted to monthly amounts. PMI is only included when the loan-to-value is above 80%.",
    workedExample:
      "On a $400,000 home with $80,000 down at 6.5% for 30 years, principal is $320,000. P&I ≈ $2,022/mo. With 1.1% tax, $1,500 insurance and no PMI (LTV = 80%), total ≈ $2,514/mo.",
    assumptions: [
      "Fixed interest rate for the entire term.",
      "Property tax and insurance rates are constant.",
      "PMI is dropped once LTV ≤ 80% (many lenders auto-remove PMI at 78%).",
    ],
    faq: [
      { q: "What is PMI?", a: "Private Mortgage Insurance protects the lender when the down payment is below 20%. It is added to your monthly payment." },
      { q: "Are HOA fees included?", a: "No. Add HOA fees separately if applicable." },
    ],
    related: ["mortgage-amortization-calculator", "refinance-calculator", "home-loan-emi-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "mortgage-amortization-calculator",
    name: "Mortgage Amortization Calculator",
    category: "finance",
    shortDescription: "See how each monthly payment splits between principal and interest with a full amortization table.",
    seoTitle: "Mortgage Amortization Calculator with Schedule | CalcyTub",
    metaDescription: "See a year-by-year amortization schedule showing principal, interest, remaining balance and total interest paid.",
    keywords: ["amortization", "amortization schedule", "loan schedule"],
    currency: "USD",
    inputs: [
      { key: "amount", label: "Loan Amount", type: "number", prefix: "$", min: 1000, defaultValue: 320000, step: 1000 },
      { key: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.01, max: 30, defaultValue: 6.5, step: 0.05 },
      { key: "years", label: "Term", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 30, step: 1 },
    ],
    compute: ({ amount, rate, years }) => {
      const { emi, totalInterest, yearly, n } = buildAmortization(amount, rate, years);
      return {
        results: [
          { label: "Monthly Payment", value: emi, format: "currency", currency: "USD", primary: true },
          { label: "Total Interest", value: totalInterest, format: "currency", currency: "USD" },
          { label: "Total Paid", value: emi * n, format: "currency", currency: "USD" },
        ],
        breakdown: {
          title: "Yearly Schedule",
          columns: ["Year", "Principal", "Interest", "Balance"],
          rows: yearly.map((y) => [
            y.year,
            { value: y.principal, format: "currency", currency: "USD" },
            { value: y.interest, format: "currency", currency: "USD" },
            { value: y.balance, format: "currency", currency: "USD" },
          ]),
        },
      };
    },
    formula: "Interestₘ = Balance × r ; Principalₘ = EMI − Interestₘ",
    howItWorks: "Each month the interest portion is calculated on the remaining balance. The remainder of the payment reduces the balance. Over time, more of the payment goes toward principal.",
    workedExample: "For a $320,000 loan at 6.5% for 30 years, monthly payment ≈ $2,022. In year 1 you pay ≈ $20,600 interest and ≈ $3,660 principal.",
    assumptions: ["Fixed rate.", "Regular monthly payments with no missed months or prepayments."],
    faq: [
      { q: "Why do early payments pay mostly interest?", a: "Because interest is charged on the outstanding balance, which is largest at the start." },
    ],
    related: ["mortgage-calculator", "refinance-calculator", "home-loan-emi-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "refinance-calculator",
    name: "Refinance Calculator",
    category: "finance",
    shortDescription: "Compare your current mortgage with a new offer to estimate monthly savings and break-even period.",
    seoTitle: "Mortgage Refinance Calculator — Savings & Break-Even | CalcyTub",
    metaDescription: "Estimate monthly savings and break-even months when refinancing your mortgage.",
    keywords: ["refinance", "refinance calculator", "break-even"],
    currency: "USD",
    inputs: [
      { key: "balance", label: "Current Loan Balance", type: "number", prefix: "$", min: 1000, defaultValue: 250000, step: 1000 },
      { key: "curRate", label: "Current Rate", type: "number", suffix: "%", min: 0.01, defaultValue: 7.0, step: 0.05 },
      { key: "curYears", label: "Years Remaining", type: "number", suffix: "years", min: 1, defaultValue: 25, step: 1 },
      { key: "newRate", label: "New Rate", type: "number", suffix: "%", min: 0.01, defaultValue: 5.75, step: 0.05 },
      { key: "newYears", label: "New Term", type: "number", suffix: "years", min: 1, defaultValue: 25, step: 1 },
      { key: "closing", label: "Closing Costs", type: "number", prefix: "$", min: 0, defaultValue: 4000, step: 100 },
    ],
    compute: ({ balance, curRate, curYears, newRate, newYears, closing }) => {
      const curEmi = emiFormula(balance, curRate / 100 / 12, curYears * 12);
      const newEmi = emiFormula(balance, newRate / 100 / 12, newYears * 12);
      const monthlySavings = curEmi - newEmi;
      const breakEven = monthlySavings > 0 ? closing / monthlySavings : Infinity;
      return {
        results: [
          { label: "Monthly Savings", value: monthlySavings, format: "currency", currency: "USD", primary: true },
          { label: "Current Payment", value: curEmi, format: "currency", currency: "USD" },
          { label: "New Payment", value: newEmi, format: "currency", currency: "USD" },
          {
            label: "Break-Even Period",
            value: isFinite(breakEven) ? `${Math.ceil(breakEven)} months` : "No savings",
          },
        ],
      };
    },
    formula: "Break-even (months) = Closing Costs / Monthly Savings",
    howItWorks: "We compute the current and new monthly payments using the standard amortization formula, take the difference, and divide the closing costs by that difference.",
    workedExample: "$250,000 at 7% for 25 years costs ≈ $1,767/mo. At 5.75% it costs ≈ $1,573/mo. Monthly savings ≈ $194. With $4,000 closing costs, break-even ≈ 21 months.",
    assumptions: ["Actual refinance offers depend on lenders and borrower circumstances.", "Extending term may lower payment but increase total interest."],
    faq: [
      { q: "Is refinance worth it?", a: "Typically when the break-even period is comfortably less than how long you plan to keep the home." },
    ],
    related: ["mortgage-calculator", "mortgage-amortization-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "personal-loan-emi-calculator",
    name: "Personal Loan EMI Calculator",
    category: "finance",
    shortDescription: "Calculate personal loan EMI, total interest and total payment for any currency.",
    seoTitle: "Personal Loan EMI Calculator | CalcyTub",
    metaDescription: "Calculate personal loan EMI, total interest and payment for INR, USD or any currency.",
    keywords: ["personal loan emi", "loan emi calculator"],
    currency: "INR",
    inputs: [
      { key: "amount", label: "Loan Amount", type: "number", prefix: "₹", min: 1000, defaultValue: 500000, step: 1000 },
      { key: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.01, defaultValue: 12, step: 0.1 },
      { key: "years", label: "Tenure", type: "number", suffix: "years", min: 0.5, max: 10, defaultValue: 3, step: 0.5 },
    ],
    compute: ({ amount, rate, years }) => {
      const n = Math.round(years * 12);
      const emi = emiFormula(amount, rate / 100 / 12, n);
      const total = emi * n;
      return {
        results: [
          { label: "Monthly EMI", value: emi, format: "currency", currency: "INR", primary: true },
          { label: "Total Interest", value: total - amount, format: "currency", currency: "INR" },
          { label: "Total Payment", value: total, format: "currency", currency: "INR" },
        ],
      };
    },
    formula: "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)",
    howItWorks: "Same reducing-balance EMI formula used by banks and NBFCs. r is the monthly rate and n is the number of monthly instalments.",
    workedExample: "₹5,00,000 at 12% for 3 years: EMI ≈ ₹16,607, total interest ≈ ₹97,857.",
    assumptions: ["Fixed rate.", "No processing fees or foreclosure charges included."],
    faq: [
      { q: "Are personal loan rates higher than home loans?", a: "Usually yes, because personal loans are unsecured." },
    ],
    related: ["home-loan-emi-calculator", "sip-calculator", "fd-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    category: "finance",
    shortDescription: "Estimate the future value of a monthly SIP investment based on expected annual return.",
    seoTitle: "SIP Calculator (Mutual Funds) | CalcyTub",
    metaDescription: "Estimate future value of monthly SIP investments using expected annual return and duration.",
    keywords: ["sip calculator", "mutual fund sip", "systematic investment plan"],
    currency: "INR",
    inputs: [
      { key: "monthly", label: "Monthly Investment", type: "number", prefix: "₹", min: 100, defaultValue: 10000, step: 500 },
      { key: "rate", label: "Expected Annual Return", type: "number", suffix: "%", min: 0.01, defaultValue: 12, step: 0.5 },
      { key: "years", label: "Investment Duration", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 10, step: 1 },
    ],
    compute: ({ monthly, rate, years }) => {
      const n = Math.round(years * 12);
      const r = rate / 100 / 12;
      const fv = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = monthly * n;
      return {
        results: [
          { label: "Estimated Final Value", value: fv, format: "currency", currency: "INR", primary: true },
          { label: "Total Invested", value: invested, format: "currency", currency: "INR" },
          { label: "Estimated Returns", value: fv - invested, format: "currency", currency: "INR" },
        ],
      };
    },
    formula: "FV = P × [((1 + r)ⁿ − 1) / r] × (1 + r)",
    howItWorks: "Assumes investments made at the start of each month and reinvestment at the same rate. Actual mutual fund returns vary.",
    workedExample: "₹10,000/month at 12% for 10 years grows to ≈ ₹23.2 lakh (invested ₹12 lakh).",
    assumptions: ["Constant annual return.", "Ignores taxes, exit load and expense ratio."],
    faq: [{ q: "Are returns guaranteed?", a: "No. SIP returns depend on market performance." }],
    related: ["fd-calculator", "home-loan-emi-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "fd-calculator",
    name: "FD Calculator",
    category: "finance",
    shortDescription: "Compute fixed deposit maturity amount and interest earned with any compounding frequency.",
    seoTitle: "Fixed Deposit (FD) Calculator | CalcyTub",
    metaDescription: "Calculate FD maturity amount and interest earned. Supports quarterly, monthly, half-yearly and yearly compounding.",
    keywords: ["fd calculator", "fixed deposit", "maturity"],
    currency: "INR",
    inputs: [
      { key: "principal", label: "Principal", type: "number", prefix: "₹", min: 100, defaultValue: 100000, step: 1000 },
      { key: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.01, defaultValue: 7, step: 0.1 },
      { key: "years", label: "Tenure", type: "number", suffix: "years", min: 0.1, defaultValue: 5, step: 0.5 },
      {
        key: "freq",
        label: "Compounding",
        type: "select",
        defaultValue: 4,
        options: [
          { value: 1, label: "Yearly" },
          { value: 2, label: "Half-Yearly" },
          { value: 4, label: "Quarterly" },
          { value: 12, label: "Monthly" },
        ],
      },
    ],
    compute: ({ principal, rate, years, freq }) => {
      const n = Number(freq);
      const r = rate / 100;
      const maturity = principal * Math.pow(1 + r / n, n * years);
      return {
        results: [
          { label: "Maturity Amount", value: maturity, format: "currency", currency: "INR", primary: true },
          { label: "Interest Earned", value: maturity - principal, format: "currency", currency: "INR" },
        ],
      };
    },
    formula: "A = P × (1 + r/n)ⁿᵗ",
    howItWorks: "P is principal, r is annual rate, n is compounding periods per year and t is years.",
    workedExample: "₹1,00,000 at 7% quarterly for 5 years: A ≈ ₹1,41,478.",
    assumptions: ["Interest is compounded and reinvested.", "TDS/tax not applied."],
    faq: [{ q: "Which compounding gives more?", a: "More frequent compounding gives a slightly higher maturity for the same rate." }],
    related: ["sip-calculator", "personal-loan-emi-calculator"],
    disclaimer: "finance",
  },

  {
    slug: "gst-calculator",
    name: "GST Calculator",
    category: "finance",
    shortDescription: "Add or remove GST at Indian rates of 5%, 12%, 18% and 28% (or any custom rate).",
    seoTitle: "GST Calculator India (5% / 12% / 18% / 28%) | CalcyTub",
    metaDescription: "Free Indian GST calculator. Add or remove GST at 5%, 12%, 18%, 28% or any custom rate.",
    keywords: ["gst calculator", "gst india", "gst inclusive", "gst exclusive"],
    currency: "INR",
    inputs: [
      { key: "amount", label: "Amount", type: "number", prefix: "₹", min: 0, defaultValue: 1000, step: 10 },
      {
        key: "rate",
        label: "GST Rate",
        type: "select",
        defaultValue: 18,
        options: [
          { value: 5, label: "5%" },
          { value: 12, label: "12%" },
          { value: 18, label: "18%" },
          { value: 28, label: "28%" },
        ],
      },
      {
        key: "mode",
        label: "Mode",
        type: "select",
        defaultValue: "add",
        options: [
          { value: "add", label: "Add GST (exclusive → final price)" },
          { value: "remove", label: "Remove GST (inclusive → base price)" },
        ],
      },
    ],
    compute: ({ amount, rate, mode }) => {
      const r = Number(rate) / 100;
      if (mode === "add") {
        const gst = amount * r;
        return {
          results: [
            { label: "Final Price", value: amount + gst, format: "currency", currency: "INR", primary: true },
            { label: "GST Amount", value: gst, format: "currency", currency: "INR" },
            { label: "Base Price", value: amount, format: "currency", currency: "INR" },
          ],
        };
      }
      const base = amount / (1 + r);
      return {
        results: [
          { label: "Base Price", value: base, format: "currency", currency: "INR", primary: true },
          { label: "GST Amount", value: amount - base, format: "currency", currency: "INR" },
          { label: "Final Price (given)", value: amount, format: "currency", currency: "INR" },
        ],
      };
    },
    formula: "Add GST: Final = Base × (1 + r) — Remove GST: Base = Final / (1 + r)",
    howItWorks: "Choose whether the amount you entered is exclusive or inclusive of GST. The calculator will output both the base and final price.",
    workedExample: "₹1,000 at 18% GST → Final ₹1,180, GST ₹180.",
    assumptions: ["Single GST rate applied.", "Ignores CGST/SGST/IGST split; totals remain the same."],
    faq: [{ q: "Does this handle IGST vs CGST/SGST?", a: "The math is identical; only the tax split differs based on interstate vs intrastate." }],
    related: ["percentage-calculator", "discount-calculator"],
    disclaimer: "finance",
  },
];
