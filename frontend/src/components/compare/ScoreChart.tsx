// AutoLens — components/compare/ScoreChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import type { CompareVehicle } from "./VehicleSelector";

const COLORS = ["#3d5a3d", "#5a7a5a", "#8aaa7a", "#b8d4a8"];

interface ScoreChartProps {
  vehicles: CompareVehicle[];
}

export default function ScoreChart({ vehicles }: ScoreChartProps) {
  const data = vehicles.map((v) => ({
    name: `${v.brand} ${v.model}`,
    score: v.score,
  }));

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        竞品综合评分
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0ec"
            vertical={false}
          />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value} 分`, "综合评分"]}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <LabelList
              dataKey="score"
              position="top"
              style={{ fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
