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
import ChartInsight from "./ChartInsight";

const GREEN_DARK = "#3f5f8f";
const GOLD = "#a89a6a";

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
  const totals = chartData.reduce(
    (sum, item) => ({
      recommend: sum.recommend + (Number(item.recommend) || 0),
      chat: sum.chat + (Number(item.chat) || 0),
    }),
    { recommend: 0, chat: 0 },
  );
  const peak = [...chartData].sort(
    (a, b) =>
      Number(b.recommend || 0) +
      Number(b.chat || 0) -
      (Number(a.recommend || 0) + Number(a.chat || 0)),
  )[0];
  const peakTotal = peak
    ? Number(peak.recommend || 0) + Number(peak.chat || 0)
    : 0;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            近14天活跃趋势
          </div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>
            推荐与客服对话的日变化
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <MetricPill label="推荐" value={totals.recommend} color={GREEN_DARK} />
          <MetricPill label="客服" value={totals.chat} color={GOLD} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={chartData} margin={{ top: 8, right: 18, bottom: 0, left: -18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
          <Line
            type="monotone"
            dataKey="recommend"
            stroke={GREEN_DARK}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
            name="推荐"
          />
          <Line
            type="monotone"
            dataKey="chat"
            stroke={GOLD}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name="客服"
          />
        </LineChart>
      </ResponsiveContainer>
      <ChartInsight accent="#3f5f8f" background="#f3f6fb">
        {totals.recommend || totals.chat ? (
          <>
            累计推荐{" "}
            <strong style={{ color: "#3f5f8f" }}>{totals.recommend}</strong>{" "}
            次、客服对话{" "}
            <strong style={{ color: "#8a7a45" }}>{totals.chat}</strong> 次
            {peakTotal > 0 && (
              <>
                ，峰值出现在{" "}
                <strong style={{ color: "#2d3748" }}>{peak.date}</strong>
              </>
            )}
          </>
        ) : (
          "近14天暂无活跃记录，生成推荐或客服对话后将展示趋势变化"
        )}
      </ChartInsight>
    </div>
  );
}

function MetricPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 8px",
        borderRadius: 999,
        background: "#f5f7f5",
        color: "#666",
        fontSize: 11,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
        }}
      />
      {label}
      <strong style={{ color }}>{value}</strong>
    </div>
  );
}
