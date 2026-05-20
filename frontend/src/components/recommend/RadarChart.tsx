// @ts-nocheck
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Activity, ThumbsUp, AlertCircle, Bot, Info } from "lucide-react";

const COLORS = ["#3f5f8f", "#d9822b", "#4f7f58"];

const DIMENSION_COLORS: Record<string, string> = {
  预算: "#b87935",
  续航: "#2f6fd6",
  空间: "#4f83a8",
  智驾: "#6f5fa8",
  安全: "#4f7f58",
  补能: "#d9822b",
  性价比: "#3f5f8f",
};

function dimensionColor(label: string) {
  return DIMENSION_COLORS[label] || "#3f5f8f";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score || 0)));
}

function scoreValue(result: any, key: string) {
  const direct = Number(result?.[key]);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const vehicle = result?.vehicle || {};
  if (key === "safety_score") {
    const safety = Number(vehicle.safety_score);
    return Number.isFinite(safety) && safety > 0 ? Math.min(10, safety / 10) : 6;
  }

  if (key === "charging_score") {
    let score = 5;
    if (vehicle.energy_type === "插混" || vehicle.energy_type === "增程") score += 3;
    if (Number(vehicle.range_km) >= 650) score += 1;
    if (Number(vehicle.fast_charge_minutes) > 0 && Number(vehicle.fast_charge_minutes) <= 30) score += 1;
    return Math.max(0, Math.min(10, score));
  }

  return 0;
}

function boundedScoreValue(result: any, key: string, max: number) {
  return Math.max(0, Math.min(max, scoreValue(result, key)));
}

interface Props {
  results: any[];
  aiSummary?: string | string[];
}

export default function RecommendRadarChart({ results, aiSummary }: Props) {
  const isEmpty = !results || results.length === 0;

  const dimensions = [
    { subject: "预算", key: "price_score", max: 25 },
    { subject: "续航", key: "range_score", max: 15 },
    { subject: "空间", key: "space_score", max: 15 },
    { subject: "智驾", key: "autopilot_score", max: 15 },
    { subject: "安全", key: "safety_score", max: 10 },
    { subject: "补能", key: "charging_score", max: 10 },
    { subject: "性价比", key: "value_score", max: 10 },
  ];

  const data = dimensions.map((dim) => {
    const row: any = { subject: dim.subject, fullMark: 100 };
    results.forEach((r) => {
      const name = `${r.vehicle?.brand ?? ""} ${r.vehicle?.model ?? ""}`.trim();
      row[name] = clampScore((boundedScoreValue(r, dim.key, dim.max) / dim.max) * 100);
    });
    return row;
  });

  // 算优势和待优化维度（基于 top1）
  const top = results[0];
  const dimScores = top
    ? dimensions
        .map((dim) => ({
          label: dim.subject,
          raw: boundedScoreValue(top, dim.key, dim.max),
          max: dim.max,
          score: clampScore((boundedScoreValue(top, dim.key, dim.max) / dim.max) * 100),
        }))
        .sort((a, b) => b.score - a.score)
    : [];

  const strengths = dimScores.slice(0, 3);
  const weaknesses = dimScores.slice(-3).reverse();
  const aiItems = Array.isArray(aiSummary)
    ? aiSummary
    : (aiSummary || "")
        .split(/\n|。|；/)
        .map((item) => item.trim())
        .filter(Boolean);

  return (
    <div
      className="recommend-radar-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 标题 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <Activity size={16} color="#5a7a5a" />
            推荐分项雷达
          </div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
            {isEmpty
              ? "生成推荐后显示各车型匹配度对比"
              : `共 ${results.length} 辆推荐车型对比`}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#ccc",
          }}
        >
          <div style={{ fontSize: 48 }}>📡</div>
          <div style={{ fontSize: 13 }}>填写左侧表单生成推荐</div>
        </div>
      ) : (
        <>
          {/* 雷达图 */}
          <div className="recommend-radar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
            >
              <PolarGrid stroke="#f0f0ec" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              {results.map((r, i) => {
                const name =
                  `${r.vehicle?.brand ?? ""} ${r.vehicle?.model ?? ""}`.trim();
                return (
                  <Radar
                    key={i}
                    name={name}
                    dataKey={name}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.2}
                  />
                );
              })}
              <Tooltip
                formatter={(v) => [`${v}分`, "匹配度"]}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                itemStyle={{ marginRight: 20 }}
              />
            </RadarChart>
          </ResponsiveContainer>
          </div>

          {/* 得分列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((r, i) => (
              <div
                className="recommend-radar-score-row"
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "8px 12px",
                  background: "#fafaf8",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: COLORS[i % COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2d2d2d",
                    flex: 1,
                  }}
                >
                  {r.vehicle?.brand} {r.vehicle?.model}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS[i % COLORS.length],
                  }}
                >
                  {r.total_score} 分
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: r.within_budget ? "#5a7a5a" : "#e07070",
                  }}
                >
                  {r.within_budget ? "✓ 预算内" : "超预算"}
                </span>
              </div>
            ))}
          </div>

          {/* 优势 + 待优化 */}
          {top && (
            <div
              className="recommend-radar-insights"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "#f5f7f2",
                  border: "1px solid #d9e4d6",
                  borderRadius: 10,
                  padding: "12px 14px",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#3d5a3d",
                    marginBottom: 8,
                  }}
                >
                  <ThumbsUp size={13} color="#3d5a3d" />
                  高匹配维度
                </div>
                {strengths.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px minmax(0, 1fr) 42px",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#555", minWidth: 0 }}>
                      {s.label}
                    </span>
                    <div
                      style={{
                        minWidth: 0,
                        height: 6,
                        background: "#e8edf4",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${s.score}%`,
                          height: "100%",
                          background: dimensionColor(s.label),
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: dimensionColor(s.label),
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {s.raw}/{s.max}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "#fff8f0",
                  border: "1px solid #f2e4d5",
                  borderRadius: 10,
                  padding: "12px 14px",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#e67e00",
                    marginBottom: 8,
                  }}
                >
                  <AlertCircle size={13} color="#e67e00" />
                  待优化维度（相对较弱）
                </div>
                {weaknesses.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px minmax(0, 1fr) 42px",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#555", minWidth: 0 }}>
                      {s.label}
                    </span>
                    <div
                      style={{
                        minWidth: 0,
                        height: 6,
                        background: "#f0e0d0",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${s.score}%`,
                          height: "100%",
                          background: dimensionColor(s.label),
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: dimensionColor(s.label),
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {s.raw}/{s.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI 解读 */}
          {aiItems.length > 0 && (
            <div
              style={{
                background: "#f0f5ff",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1a73e8",
                  marginBottom: 10,
                }}
              >
                <Bot size={18} color="#1a73e8" />
                AI 解读
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {aiItems.slice(0, 4).map((item, i) => {
                    const [title, ...restParts] = item.split(/：|:/);
                    const hasTitle = restParts.length > 0 && title.length <= 18;
                    const content = hasTitle ? restParts.join("：").trim() : item;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#1a73e8",
                            flexShrink: 0,
                            marginTop: 5,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: "#666",
                            lineHeight: 1.7,
                          }}
                        >
                          {hasTitle && (
                            <span style={{ fontWeight: 600, color: "#1a73e8" }}>
                              {title}
                            </span>
                          )}
                          {hasTitle ? `：${content}` : content}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontSize: 11,
          color: "#bbb",
          paddingTop: 4,
        }}
      >
        <Info size={11} color="#bbb" />
        雷达图分数基于您的需求权重计算，满分为 100 分
      </div>
    </div>
  );
}
