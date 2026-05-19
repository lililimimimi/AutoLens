// components/compare/CompareReport.tsx
import { CheckCircle, XCircle } from "lucide-react";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

interface Props {
  reportData: any;
  vehicles: any[];
}

export default function CompareReport({ reportData, vehicles }: Props) {
  if (!reportData)
    return (
      <div
        style={{
          textAlign: "center",
          color: "#bbb",
          fontSize: 14,
          padding: "40px 0",
        }}
      >
        点击「查看完整报告」生成详细对比报告
      </div>
    );

  const { params_table = [], analyses = [], suggestions = [] } = reportData;
  const colors = ["#3d5a3d", "#e67e00", "#1a73e8"];

  return (
    <div>
      {/* 参数对比表 */}
      {params_table.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#2d2d2d",
              marginBottom: 12,
              marginTop: 12,
            }}
          >
            核心参数对比
          </div>
          <div
            style={{
              borderRadius: 10,
              border: "1.5px solid #e8ede8",
              overflow: "hidden",
            }}
          >
            {/* 表头 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `160px ${vehicles.map(() => "1fr").join(" ")}`,
                background: "#f5f5f0",
                borderBottom: "1.5px solid #e8ede8",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: GREEN_DARK,
                }}
              >
                参数
              </div>
              {vehicles.map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: colors[i % colors.length],
                    textAlign: "center",
                  }}
                >
                  {v.brand} {v.model}
                </div>
              ))}
            </div>
            {/* 数据行 */}
            {params_table.map((row: any, ri: number) => (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: `160px ${vehicles.map(() => "1fr").join(" ")}`,
                  borderBottom:
                    ri < params_table.length - 1 ? "1px solid #f0f0ec" : "none",
                  background: ri % 2 === 0 ? "#fff" : "#fafaf8",
                }}
              >
                <div
                  style={{ padding: "10px 14px", fontSize: 13, color: "#666" }}
                >
                  {row.label}
                </div>
                {(row.values || []).map((val: string, vi: number) => (
                  <div
                    key={vi}
                    style={{
                      padding: "10px 14px",
                      fontSize: 13,
                      textAlign: "center",
                      fontWeight: row.best_index === vi ? 600 : 400,
                      color: row.best_index === vi ? GREEN_DARK : "#444",
                    }}
                  >
                    {val}
                    {row.best_index === vi && (
                      <span
                        style={{ fontSize: 11, color: GREEN, marginLeft: 4 }}
                      >
                        最佳
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 各车分析 */}
      {analyses.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#2d2d2d",
              marginBottom: 12,
            }}
          >
            差异化分析
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vehicles.map(() => "1fr").join(" "),
              gap: 12,
            }}
          >
            {analyses.map((a: any, i: number) => {
              const vehicle = vehicles.find((v) => v.id === a.vehicle_id);
              if (!vehicle) return null;
              return (
                <div
                  key={a.vehicle_id}
                  style={{
                    border: "1.5px solid #e8ede8",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      background: colors[i % colors.length],
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {vehicle.brand} {vehicle.model}
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    {(a.strengths || []).map((s: string, si: number) => (
                      <div
                        key={si}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                          marginBottom: 6,
                        }}
                      >
                        <CheckCircle
                          size={13}
                          color={GREEN}
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: "#555",
                            lineHeight: 1.5,
                          }}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                    {(a.weaknesses || []).map((w: string, wi: number) => (
                      <div
                        key={wi}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                          marginBottom: 6,
                        }}
                      >
                        <XCircle
                          size={13}
                          color="#e07070"
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: "#888",
                            lineHeight: 1.5,
                          }}
                        >
                          {w}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 选购建议 */}
      {suggestions.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#2d2d2d",
              marginBottom: 12,
            }}
          >
            选购建议
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {suggestions.map((s: any, i: number) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  border: "1.5px solid #e8ede8",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: GREEN,
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <div>
                  <span style={{ fontSize: 13, color: "#999" }}>
                    {s.condition}：
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: GREEN_DARK }}
                  >
                    {s.vehicle_name}
                  </span>
                  <span style={{ fontSize: 13, color: "#666" }}>
                    　{s.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
