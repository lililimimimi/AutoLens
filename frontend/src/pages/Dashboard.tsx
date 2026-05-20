// AutoLens — pages/Dashboard.tsx
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import EnergyPieChart from "../components/dashboard/EnergyPieChart";
import StageBarChart from "../components/dashboard/StageBarChart";
import ScatterPlot from "../components/dashboard/ScatterPlot";
import TopModelsChart from "../components/dashboard/TopModelsChart";
import ActivityLineChart from "../components/dashboard/ActivityLineChart";
import { getDashboard } from "../api/client";
import type { DashboardStats } from "../types";
import { Users, Star, MessageCircle, Car } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          color: "#999",
        }}
      >
        加载中...
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          color: "#bbb",
        }}
      >
        数据加载失败
      </div>
    );
  }

  return (
    <div className="dashboard-page responsive-page" style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · DEEPSEARCH · SQLITE"
        title="数据总览"
        description="聚合车型库、线索、推荐日志、预算分布、关注点和知识库状态。"
        actionLabel="一键生成推荐"
        onAction={() => (window.location.href = "/recommend")}
      />

      {/* 统计卡片 */}
      <div
        className="dashboard-stat-grid"
        style={{ display: "flex", gap: 16, marginBottom: 24 }}
      >
        <StatCard
          icon={<Users size={18} color="#5a7a5a" />}
          label="客户总数"
          value={stats.total_customers}
          sub={`本周新增 ${stats.new_customers_7d} 位`}
        />
        <StatCard
          icon={<Star size={18} color="#5a7a5a" />}
          label="推荐次数"
          value={stats.total_recommendations}
          sub={`本周 ${stats.recommendations_7d} 次`}
        />
        <StatCard
          icon={<MessageCircle size={18} color="#5a7a5a" />}
          label="客服对话"
          value={stats.total_chats}
          sub={`本周 ${stats.chats_7d} 次`}
        />
        <StatCard
          icon={<Car size={18} color="#5a7a5a" />}
          label="车型库"
          value={stats.total_vehicles}
          sub="覆盖主流新能源车型"
        />
      </div>

      {/* 图表第一行 */}
      <div
        className="dashboard-chart-grid-3"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <EnergyPieChart />
        <StageBarChart data={stats.customer_stage_dist} />
        <ScatterPlot />
      </div>

      {/* 图表第二行 */}
      <div
        className="dashboard-chart-grid-2"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        <TopModelsChart data={stats.top_recommended_models} />
        <ActivityLineChart data={stats.daily_activity_14d} />
      </div>
    </div>
  );
}
