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

const COLORS = ["#3d5a3d", "#e67e00", "#1a73e8"];

interface Props {
  results: any[];
  aiSummary?: string;
}

export default function RecommendRadarChart({ results, aiSummary }: Props) {
  const isEmpty = !results || results.length === 0;
  console.log("aiSummary:", aiSummary);

  const dimensions = [
    { subject: "预算", key: "price_score", max: 30 },
    { subject: "续航", key: "range_score", max: 20 },
    { subject: "空间", key: "space_score", max: 15 },
    { subject: "智驾", key: "autopilot_score", max: 15 },
    { subject: "性价比", key: "value_score", max: 20 },
    { subject: "安全", key: null, max: null },
  ];

  const data = dimensions.map((dim) => {
    const row: any = { subject: dim.subject, fullMark: 100 };
    results.forEach((r) => {
      const name = `${r.vehicle?.brand ?? ""} ${r.vehicle?.model ?? ""}`.trim();
      row[name] = dim.key ? Math.round((r[dim.key] / dim.max) * 100) : 85;
    });
    return row;
  });

  // 算优势和待优化维度（基于 top1）
  const top = results[0];
  const dimScores = top
    ? [
        { label: "续航", score: Math.round((top.range_score / 20) * 100) },
        { label: "安全", score: 85 },
        { label: "预算", score: Math.round((top.price_score / 30) * 100) },
        { label: "性价比", score: Math.round((top.value_score / 20) * 100) },
        { label: "补能", score: 80 },
        { label: "空间", score: Math.round((top.space_score / 15) * 100) },
      ].sort((a, b) => b.score - a.score)
    : [];

  const strengths = dimScores.slice(0, 3);
  const weaknesses = dimScores.slice(-3).reverse();

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
          <ResponsiveContainer width="100%" height={300}>
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

          {/* 得分列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((r, i) => (
              <div
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
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "#f0f5f0",
                  borderRadius: 10,
                  padding: "12px 14px",
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
                  优势维度（高于同级平均）
                </div>
                {strengths.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, width: 40, color: "#555" }}>
                      {s.icon} {s.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: "#e0e8e0",
                        borderRadius: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${s.score}%`,
                          height: "100%",
                          background: "#3d5a3d",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#3d5a3d",
                        fontWeight: 600,
                        width: 24,
                      }}
                    >
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "#fff8f0",
                  borderRadius: 10,
                  padding: "12px 14px",
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
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, width: 40, color: "#555" }}>
                      {s.icon} {s.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: "#f0e0d0",
                        borderRadius: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${s.score}%`,
                          height: "100%",
                          background: "#e67e00",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#e67e00",
                        fontWeight: 600,
                        width: 24,
                      }}
                    >
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI 解读 */}
          {aiSummary && (
            <div
              style={{
                background: "#f0f5ff",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1a73e8",
                  marginBottom: 8,
                }}
              >
                <Bot size={30} color="#1a73e8" />
                AI 解读
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {aiSummary
                  .split("，")
                  .filter(Boolean)
                  .map((sentence, i) => {
                    const vehicle = results[i]?.vehicle;
                    const vehicleName = vehicle
                      ? `${vehicle.brand} ${vehicle.model}`
                      : "";
                    const rest = vehicleName
                      ? sentence
                          .replace(vehicle.brand, "")
                          .replace(vehicle.model, "")
                          .trim()
                      : sentence;
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
                          {vehicleName && (
                            <span style={{ fontWeight: 600, color: "#1a73e8" }}>
                              {vehicleName}
                            </span>
                          )}
                          {rest}
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
