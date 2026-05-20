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
import ChartInsight from "./ChartInsight";

const ENERGY_COLORS: Record<string, string> = {
  纯电: "#2f6fd6",
  插混: "#4f7f58",
  增程: "#d9822b",
  燃油: "#7b7284",
  未知: "#9ca3af",
};

const fallbackColors = ["#2f6fd6", "#4f7f58", "#d9822b", "#7b7284"];

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

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const leader = [...data].sort((a, b) => b.value - a.value)[0];
  const leaderPercent =
    total > 0 && leader ? Math.round((leader.value / total) * 100) : 0;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        能源类型分布
      </div>
      <div style={{ marginTop: 34 }}>
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
            {data.map((item, i) => (
              <Cell
                key={i}
                fill={ENERGY_COLORS[item.name] || fallbackColors[i % fallbackColors.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 14 }}>
        <ChartInsight accent="#2f6fd6" background="#f3f6fb">
        {leader ? (
          <>
            <strong style={{ color: ENERGY_COLORS[leader.name] || "#2f6fd6" }}>
              {leader.name}
            </strong>
            车型占比最高，共{" "}
            <strong style={{ color: "#2d3748" }}>{leader.value}</strong> 款，
            占车型库{" "}
            <strong style={{ color: "#2d3748" }}>{leaderPercent}%</strong>
          </>
        ) : (
          "暂无车型能源分布数据"
        )}
        </ChartInsight>
        </div>
      </div>
    </div>
  );
}
