// @ts-nocheck
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Activity } from "lucide-react";

const GREEN = "#5a7a5a";

interface RadarChartProps {
  results: any[];
}

export default function RecommendRadarChart({ results }: RadarChartProps) {
  if (!results || results.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "20px 24px",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        生成推荐后显示雷达图
      </div>
    );
  }

  // 取第一名的数据
  const top = results[0];

  const data = [
    {
      subject: "预算",
      value: Math.round((top.price_score / 30) * 100),
      fullMark: 100,
    },
    {
      subject: "续航",
      value: Math.round((top.range_score / 20) * 100),
      fullMark: 100,
    },
    {
      subject: "空间",
      value: Math.round((top.space_score / 15) * 100),
      fullMark: 100,
    },
    {
      subject: "智驾",
      value: Math.round((top.autopilot_score / 15) * 100),
      fullMark: 100,
    },
    {
      subject: "性价比",
      value: Math.round((top.value_score / 20) * 100),
      fullMark: 100,
    },
    { subject: "安全", value: 85, fullMark: 100 },
    { subject: "补能", value: 80, fullMark: 100 },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        <Activity size={16} color="#5a7a5a" />
        推荐分项雷达
      </div>
      <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
        基于 Top1 车型匹配度
      </div>
      <ResponsiveContainer
        ResponsiveContainer
        width="100%"
        style={{ flex: 1 }}
        minHeight={240}
      >
        <RadarChart data={data}>
          <PolarGrid stroke="#f0f0ec" />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="匹配度"
            dataKey="value"
            stroke={GREEN}
            fill={GREEN}
            fillOpacity={0.3}
          />
          <Tooltip
            formatter={(value) => [`${value}分`, "匹配度"]}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
