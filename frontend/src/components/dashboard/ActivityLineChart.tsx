// AutoLens — components/dashboard/ActivityLineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

interface ActivityLineChartProps {
  data: { date: string; recommend: number; chat: number }[];
}

export default function ActivityLineChart({ data }: ActivityLineChartProps) {
  const chartData =
    data && data.length > 0
      ? data
      : Array.from({ length: 14 }, (_, i) => ({
          date: `5/${i + 3}`,
          recommend: 0,
          chat: 0,
        }));

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        近14天活跃趋势
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="recommend"
            stroke={GREEN_DARK}
            strokeWidth={2}
            dot={false}
            name="推荐"
          />
          <Line
            type="monotone"
            dataKey="chat"
            stroke="#a89a6a"
            strokeWidth={2}
            dot={false}
            name="客服"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
