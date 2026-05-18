// AutoLens — components/compare/AbilityChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CompareVehicle } from "./VehicleSelector";

const COLORS = ["#3d5a3d", "#e67e00", "#1a73e8"];

const dimensions = [
  { key: "budget", label: "预算" },
  { key: "range", label: "续航" },
  { key: "space", label: "空间" },
  { key: "charging", label: "补能" },
  { key: "autopilot", label: "智驾" },
  { key: "safety", label: "安全" },
];



interface AbilityChartProps {
  vehicles: CompareVehicle[];
}

export default function AbilityChart({ vehicles }: AbilityChartProps) {
  const data = dimensions.map((dim) => {
    const row: Record<string, any> = { name: dim.label };
    vehicles.forEach((v) => {
      
      const score =
        dim.key === "budget"
          ? Math.min(100, 100 - (v.price_min / 150) * 100)
          : dim.key === "range"
            ? Math.min(100, (v.range_km || 0) / 15)
            : dim.key === "space"
              ? v.seats >= 6
                ? 95
                : v.seats >= 5
                  ? 80
                  : 65
              : dim.key === "charging"
                ? v.energy_type === "纯电"
                  ? 85
                  : v.energy_type === "插混"
                    ? 75
                    : 70
                : dim.key === "autopilot"
                  ? v.autopilot_level === "L2+"
                    ? 90
                    : 70
                  : 80; 
      row[`${v.brand} ${v.model}`] = Math.round(score);
    });
    return row;
  });

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        分项能力对比
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0ec"
            vertical={false}
          />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
          {vehicles.map((v, i) => (
            <Bar
              key={v.id}
              dataKey={`${v.brand} ${v.model}`}
              fill={COLORS[i % COLORS.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
