// AutoLens — components/dashboard/TopModelsChart.tsx
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

const BAR_COLORS = ["#3f5f8f", "#4f7f58", "#b87935", "#7a6ca8", "#8b7285"];

interface TopModelsChartProps {
  data: { name: string; count: number }[];
}

export default function TopModelsChart({ data }: TopModelsChartProps) {
  const hasData = data && data.some((d) => d.count > 0);
  const activeData = (data || []).filter((d) => d.count > 0);
  const leader = [...activeData].sort((a, b) => b.count - a.count)[0];
  const total = activeData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        热门推荐车型 Top 5
      </div>
      {hasData ? (
        <div style={{ marginTop: 12 }}>
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
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {(data || []).map((item, index) => (
                <Cell
                  key={item.name}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
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
          暂无推荐记录
        </div>
      )}
      <ChartInsight accent="#3f5f8f" background="#f3f6fb">
        {leader && total > 0 ? (
          <>
            <strong style={{ color: "#3f5f8f" }}>{leader.name}</strong>
            当前推荐次数最高，头部车型可作为销售主推和话术沉淀重点
          </>
        ) : (
          "暂无推荐记录，可在生成智能推荐后观察热门车型变化"
        )}
      </ChartInsight>
    </div>
  );
}
