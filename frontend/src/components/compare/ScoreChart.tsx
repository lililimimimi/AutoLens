// @ts-nocheck
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#3d5a3d", "#e67e00", "#1a73e8"];

export default function ScoreChart({ vehicles }: { vehicles: any[] }) {
  if (!vehicles.length) return null;

  const data = [
    { subject: "预算" },
    { subject: "续航" },
    { subject: "空间" },
    { subject: "补能" },
    { subject: "智驾" },
    { subject: "安全" },
  ].map((dim) => {
    const row: any = { subject: dim.subject };
    vehicles.forEach((v) => {
      const name = `${v.brand} ${v.model}`;
      row[name] =
        dim.subject === "预算"
          ? Math.round(Math.min(100, 100 - (v.price_min / 150) * 100))
          : dim.subject === "续航"
            ? Math.round(Math.min(100, (v.range_km || 0) / 15))
            : dim.subject === "空间"
              ? v.seats >= 6
                ? 95
                : 80
              : dim.subject === "补能"
                ? v.energy_type === "纯电"
                  ? 85
                  : 75
                : dim.subject === "智驾"
                  ? v.autopilot_level === "L2+"
                    ? 90
                    : 70
                  : 80;
    });
    return row;
  });

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        竞品能力雷达
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} outerRadius="65%">
          <PolarGrid stroke="#f0f0ec" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 14 }} />
          {vehicles.map((v, i) => (
            <Radar
              key={v.id}
              name={`${v.brand} ${v.model}`}
              dataKey={`${v.brand} ${v.model}`}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.2}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
