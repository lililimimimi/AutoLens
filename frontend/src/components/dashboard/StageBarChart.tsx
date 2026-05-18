// AutoLens — components/dashboard/StageBarChart.tsx
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

interface StageBarChartProps {
  data: Record<string, number>;
}

export default function StageBarChart({ data }: StageBarChartProps) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        客户阶段分布
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill={GREEN} radius={[4, 4, 0, 0]} />
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
          暂无客户数据
        </div>
      )}
    </div>
  );
}
