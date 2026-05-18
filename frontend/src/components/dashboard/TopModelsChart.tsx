// AutoLens — components/dashboard/TopModelsChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GREEN = "#5a7a5a";

interface TopModelsChartProps {
  data: { name: string; count: number }[];
}

export default function TopModelsChart({ data }: TopModelsChartProps) {
  const hasData = data && data.some((d) => d.count > 0);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        热门推荐车型 Top 5
      </div>
      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 10, right: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              width={120}
            />
            <Tooltip />
            <Bar dataKey="count" fill={GREEN} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ccc",
            fontSize: 13,
          }}
        >
          暂无推荐记录
        </div>
      )}
    </div>
  );
}
