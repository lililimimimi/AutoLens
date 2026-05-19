import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getVehicles } from "../../api/client";

const COLORS = ["#3d5a3d", "#5a7a5a", "#8aaa7a", "#b8d4a8"];

export default function EnergyPieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    getVehicles()
      .then((vehicles) => {
        const counts: Record<string, number> = {};
        vehicles.forEach((v: any) => {
          const type = v.energy_type || "未知";
          counts[type] = (counts[type] || 0) + 1;
        });
        setData(
          Object.entries(counts).map(([name, value]) => ({ name, value })),
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        能源类型分布
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
