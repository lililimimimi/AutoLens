// AutoLens — components/dashboard/StageBarChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ChartInsight from "./ChartInsight";

const STAGE_COLORS: Record<string, string> = {
  已成交: "#4f7f58",
  已流失: "#8b7285",
  已联系: "#4f83a8",
  新线索: "#8a9556",
  有意向: "#d9822b",
  谈判中: "#6f5fa8",
};

const fallbackColors = ["#4f83a8", "#8a9556", "#d9822b", "#6f5fa8", "#8b7285"];

interface StageBarChartProps {
  data: Record<string, number>;
}

export default function StageBarChart({ data }: StageBarChartProps) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const leader = [...chartData].sort((a, b) => b.value - a.value)[0];

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        客户阶段分布
      </div>
      {chartData.length > 0 ? (
        <div style={{ marginTop: 34 }}>
          <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={STAGE_COLORS[item.name] || fallbackColors[index % fallbackColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 14 }}>
            <ChartInsight accent="#d9822b" background="#fbf5ee">
            {leader ? (
              <>
                客户主要集中在{" "}
                <strong style={{ color: STAGE_COLORS[leader.name] || "#d9822b" }}>
                  「{leader.name}」
                </strong>
                阶段，共{" "}
                <strong style={{ color: "#2d3748" }}>{leader.value}</strong> 位，
                适合优先制定跟进动作
              </>
            ) : (
              "暂无客户阶段数据"
            )}
            </ChartInsight>
          </div>
        </div>
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
