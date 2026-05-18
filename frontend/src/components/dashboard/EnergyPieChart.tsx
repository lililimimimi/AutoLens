// AutoLens — components/dashboard/EnergyPieChart.tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3d5a3d", "#5a7a5a", "#8aaa7a", "#d4c89a"];

const energyData = [
  { name: "纯电", value: 21 },
  { name: "插混", value: 2 },
  { name: "增程", value: 12 },
  { name: "燃油", value: 3 },
];

export default function EnergyPieChart() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        能源类型分布
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={energyData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            dataKey="value"
          >
            {energyData.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
