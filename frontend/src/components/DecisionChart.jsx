import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

function fmtShort(v) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(v / 1000)}k`;
  return `$${v}`;
}
function fmtFull(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

const SERIES = [
  { key: "homeValue", name: "Home Value (nominal)", color: "#0F766E" },
  { key: "realHome", name: "Home Value (real)", color: "#5EEAD4" },
  { key: "balance", name: "Loan Balance (nominal)", color: "#F97316" },
  { key: "realBalance", name: "Loan Balance (real)", color: "#FCD34D" },
];

export default function DecisionChart({ series }) {
  return (
    <div className="w-full h-72 sm:h-80" data-testid="decision-chart">
      <ResponsiveContainer>
        <LineChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.4} />
          <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} label={{ value: "Years", position: "insideBottom", offset: -4, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickFormatter={fmtShort} width={70} />
          <Tooltip
            formatter={(v) => fmtFull(v)}
            labelFormatter={(l) => `Year ${l}`}
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
