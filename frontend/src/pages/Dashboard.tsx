// AutoLens — pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { getDashboard } from "../api/client";
import type { DashboardStats } from "../types";
import PageHeader from "../components/PageHeader";

const GREEN = "#5a7a5a";
const COLORS = ["#5a7a5a", "#8aaa7a", "#b8d4a8", "#d4c89a", "#a89a6a"];

// ── 统计卡片 ──────────────────────────────
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div style={{ fontSize: 16, color: "#888", marginBottom: 8 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#2d2d2d",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 16, color: "#aaa", marginTop: 6 }}>{sub}</div>
    </div>
  );
}

// ── mock 数据（后端接好后替换）────────────
const mockStats: DashboardStats = {
  total_customers: 128,
  new_customers_7d: 12,
  total_recommendations: 341,
  recommendations_7d: 28,
  total_chats: 96,
  chats_7d: 15,
  top_recommended_models: [
    { name: "比亚迪 宋PLUS DM-i", count: 42 },
    { name: "特斯拉 Model Y", count: 38 },
    { name: "问界 M7", count: 24 },
    { name: "理想 L6", count: 19 },
    { name: "小鹏 G6", count: 14 },
  ],
  customer_stage_dist: {
    新线索: 48,
    已联系: 32,
    有意向: 24,
    谈判中: 14,
    已成交: 8,
    已流失: 2,
  },
  daily_activity_14d: Array.from({ length: 14 }, (_, i) => ({
    date: `5/${i + 3}`,
    recommend: Math.floor(Math.random() * 20) + 5,
    chat: Math.floor(Math.random() * 10) + 2,
  })),
};

const energyData = [
  { name: "纯电", value: 45 },
  { name: "插混", value: 28 },
  { name: "增程", value: 18 },
  { name: "燃油", value: 9 },
];

const scatterData = [
  { price: 15, range: 500 },
  { price: 18, range: 600 },
  { price: 22, range: 700 },
  { price: 25, range: 650 },
  { price: 28, range: 800 },
  { price: 32, range: 750 },
  { price: 35, range: 900 },
  { price: 40, range: 1000 },
  { price: 45, range: 950 },
  { price: 20, range: 550 },
  { price: 55, range: 1100 },
  { price: 12, range: 400 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);

  const stageData = Object.entries(stats.customer_stage_dist).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div style={{ width: "100%" }}>
      {/* 页面标题 */}
      <PageHeader
        tags="MULTI-AGENT · RAG · DEEPSEARCH · SQLITE"
        title="数据总览"
        description="聚合车型库、线索、推荐日志、预算分布、关注点和知识库状态。"
        actionLabel="一键生成推荐"
        onAction={() => {}}
      />

      {/* 统计卡片 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <StatCard
          label="客户总数"
          value={stats.total_customers}
          sub={`本周新增 ${stats.new_customers_7d} 位`}
        />
        <StatCard
          label="推荐次数"
          value={stats.total_recommendations}
          sub={`本周 ${stats.recommendations_7d} 次`}
        />
        <StatCard
          label="客服对话"
          value={stats.total_chats}
          sub={`本周 ${stats.chats_7d} 次`}
        />
        <StatCard label="车型库" value={38} sub="覆盖主流新能源车型" />
      </div>

      {/* 图表第一行 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* 能源类型分布 */}
        <div
          style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            能源类型分布
          </div>
          <div style={{ marginTop: 8 }}></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={energyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {energyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 客户阶段分布 */}
        <div
          style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            客户阶段分布
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip />
              <Bar dataKey="value" fill={GREEN} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 价格-续航散点 */}
        <div
          style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            价格 - 续航散点
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="price"
                name="价格(万)"
                tick={{ fontSize: 14 }}
                unit="万"
              />
              <YAxis
                dataKey="range"
                name="续航(km)"
                tick={{ fontSize: 12 }}
                unit="km"
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={scatterData} fill={GREEN} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 图表第二行 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* 热门车型 Top5 */}
        <div
          style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            热门推荐车型 Top 5
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={stats.top_recommended_models}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={120}
              />
              <Tooltip />
              <Bar dataKey="count" fill={GREEN} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 近14天活跃趋势 */}
        <div
          style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            近14天活跃趋势
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.daily_activity_14d} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="recommend"
                stroke={GREEN}
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
      </div>
    </div>
  );
}
