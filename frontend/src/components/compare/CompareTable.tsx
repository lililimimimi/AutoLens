// AutoLens — components/compare/CompareTable.tsx
const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const brandColors: Record<string, string> = {
  特斯拉: "#cc0000",
  小鹏: "#1a73e8",
  比亚迪: "#1a6b3c",
  理想: "#ff6900",
  问界: "#c7000b",
};

interface CompareTableProps {
  vehicles: any[];
}

export default function CompareTable({ vehicles }: CompareTableProps) {
  if (vehicles.length === 0) return null;

  // 找最优值
  const bestScore = Math.max(...vehicles.map((v) => v.safety_score ?? 0));
  const bestRange = Math.max(...vehicles.map((v) => v.range_km));
  const bestPrice = Math.min(...vehicles.map((v) => v.price_min));

  return (
    <div
      className="compare-table-card table-scroll-card"
      style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", minWidth: 0 }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        详细对比
      </div>
      <div className="table-scroll-inner" style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #f0f0ec" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                  width: 80,
                }}
              >
                品牌
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                车型
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                综合评分
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                能源
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                起售价（万）
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                CLTC续航（km）
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                亮点
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  color: "#999",
                  fontWeight: 500,
                }}
              >
                短板
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr
                key={v.id}
                style={{
                  borderBottom: "1px solid #f5f5f0",
                  background: i % 2 === 0 ? "#fff" : "#fafaf8",
                }}
              >
                {/* 品牌 */}
                <td style={{ padding: "14px 12px" }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: brandColors[v.brand] || GREEN_DARK,
                    }}
                  >
                    {v.brand}
                  </span>
                </td>

                {/* 车型 */}
                <td style={{ padding: "14px 12px", fontWeight: 500 }}>
                  {v.model}
                </td>

                {/* 综合评分 */}
                <td style={{ padding: "14px 12px", textAlign: "center" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color:
                        v.safety_score === bestScore ? GREEN_DARK : "#2d2d2d",
                    }}
                  >
                    {v.safety_score ?? "-"}
                  </span>
                  {v.score === bestScore && (
                    <span style={{ fontSize: 11, color: GREEN, marginLeft: 4 }}>
                      ★最高
                    </span>
                  )}
                </td>

                {/* 能源 */}
                <td style={{ padding: "14px 12px", textAlign: "center" }}>
                  <span
                    style={{
                      background: "#f0f4f0",
                      color: GREEN_DARK,
                      borderRadius: 12,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {v.energy_type}
                  </span>
                </td>

                {/* 起售价 */}
                <td style={{ padding: "14px 12px", textAlign: "center" }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: v.price_min === bestPrice ? GREEN_DARK : "#2d2d2d",
                    }}
                  >
                    {v.price_min}
                  </span>
                  {v.price_min === bestPrice && (
                    <span style={{ fontSize: 11, color: GREEN, marginLeft: 4 }}>
                      ★最低
                    </span>
                  )}
                </td>

                {/* 续航 */}
                <td style={{ padding: "14px 12px", textAlign: "center" }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: v.range_km === bestRange ? GREEN_DARK : "#2d2d2d",
                    }}
                  >
                    {v.range_km}
                  </span>
                  {v.range_km === bestRange && (
                    <span style={{ fontSize: 11, color: GREEN, marginLeft: 4 }}>
                      ★最长
                    </span>
                  )}
                </td>

                {/* 亮点 */}
                <td style={{ padding: "14px 12px" }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {(v.highlights || []).map((h: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          color: "#555",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#5a7a5a",
                            flexShrink: 0,
                            display: "inline-block",
                          }}
                        />
                        {h}
                      </span>
                    ))}
                  </div>
                </td>

                {/* 短板 */}
                <td style={{ padding: "14px 12px" }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {(typeof v.weaknesses === "string"
                      ? JSON.parse(v.weaknesses)
                      : v.weaknesses || []
                    ).map((w: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          color: "#888",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#e07070",
                            flexShrink: 0,
                            display: "inline-block",
                          }}
                        />
                        {w}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
