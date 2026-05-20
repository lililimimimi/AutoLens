// AutoLens — components/recommend/ResultCard.tsx
import { useState } from "react";

const GREEN = "#4f7f58";

const rankColors = ["#d4a017", "#aaa", "#cd7f32"];
const rankEmojis = ["🥇", "🥈", "🥉"];

const scoreColors: Record<string, string> = {
  预算匹配度: "#b87935",
  续航匹配度: "#2f6fd6",
  空间匹配度: "#4f83a8",
  智驾匹配度: "#6f5fa8",
  安全匹配度: "#4f7f58",
  补能便利: "#d9822b",
  性价比: "#3f5f8f",
};

function getSafetyScore(result: any) {
  const direct = Number(result?.safety_score);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const safety = Number(result?.vehicle?.safety_score);
  return Number.isFinite(safety) && safety > 0 ? Math.min(10, safety / 10) : 6;
}

function getChargingScore(result: any) {
  const direct = Number(result?.charging_score);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const vehicle = result?.vehicle || {};
  let score = 5;
  if (vehicle.energy_type === "插混" || vehicle.energy_type === "增程") score += 3;
  if (Number(vehicle.range_km) >= 650) score += 1;
  if (Number(vehicle.fast_charge_minutes) > 0 && Number(vehicle.fast_charge_minutes) <= 30) score += 1;
  return Math.max(0, Math.min(10, score));
}

function ScoreBar({
  label,
  score,
  max,
}: {
  label: string;
  score: number;
  max: number;
}) {
  const rawScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  const safeScore = Math.max(0, Math.min(max, rawScore));
  const percent = Math.max(0, Math.min(100, (safeScore / max) * 100));
  const color = scoreColors[label] || GREEN;

  return (
    <div
      className="recommend-score-bar"
      style={{
        display: "grid",
        gridTemplateColumns: "76px minmax(0, 1fr) 44px",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 12, color: "#888", minWidth: 0 }}>
        {label}
      </span>
      <div
        style={{
          minWidth: 0,
          background: "#f0f0ec",
          borderRadius: 4,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.5s",
          }}
        />
      </div>
      <span
        style={{ fontSize: 12, color: "#888", textAlign: "right" }}
      >
        {safeScore}/{max}
      </span>
    </div>
  );
}

interface ResultCardProps {
  result: any;
  rank: number;
  defaultOpen?: boolean;
}

export function ResultCard({
  result,
  rank,
  defaultOpen = false,
}: ResultCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const v = result.vehicle;
  const score = result.total_score || 0;
  const safetyScore = getSafetyScore(result);
  const chargingScore = getChargingScore(result);
  const rankEmoji = rankEmojis[rank] || `#${rank + 1}`;

  // 推荐理由
  const reasons = result.rank_reason
  ? result.rank_reason.split('；').filter(Boolean).map((r: string) => r.replace(/^推荐理由：/, '').trim())
  : [];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        border: `1px solid ${open ? "#5a7a5a" : "#e8e8e4"}`,
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
    >
      {/* 卡片头部（始终显示） */}
      <div
        className="recommend-result-head"
        onClick={() => setOpen(!open)}
        style={{
          padding: "14px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderLeft: `4px solid ${rankColors[rank] || "#e0e0d8"}`,
        }}
      >
        {/* 排名 */}
        <span style={{ fontSize: 20, flexShrink: 0 }}>{rankEmoji}</span>

        {/* 车型信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: "#2d2d2d" }}>
              {v ? `${v.brand} ${v.model}` : `车型ID ${result.vehicle_id}`}
            </span>
            {v && (
              <>
                <span style={{ fontSize: 11, color: "#888" }}>
                  {v.energy_type}
                </span>
                <span style={{ fontSize: 11, color: "#888" }}>
                  {v.body_type}
                </span>
                {v.range_km > 0 && (
                  <span style={{ fontSize: 11, color: "#888" }}>
                    {v.range_km}km
                  </span>
                )}
              </>
            )}
          </div>
          {v && (
            <>
              <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>
                {v.price_min}-{v.price_max}万 · {v.seats}座
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 6,
                }}
              >
                {typeof v.safety_score === "number" && (
                  <span style={{ fontSize: 11, color: "#6f766f" }}>
                    安全 {v.safety_score}分
                  </span>
                )}
                {v.fast_charge_minutes && (
                  <span style={{ fontSize: 11, color: "#6f766f" }}>
                    快充约{v.fast_charge_minutes}分钟
                  </span>
                )}
                {v.monthly_sales && (
                  <span style={{ fontSize: 11, color: "#6f766f" }}>
                    月销 {v.monthly_sales}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* 评分 + 展开箭头 */}
        <div
          className="recommend-result-score"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: "#2f3a46" }}>
            {score}
            <span style={{ fontSize: 12, color: "#999", fontWeight: 400 }}>
              分
            </span>
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#bbb",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* 展开内容 */}
      {open && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0ec" }}>
          <div
            className="recommend-card-body-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 18,
            }}
          >
            {/* 左：评分条 */}
            <div style={{ minWidth: 0 }}>
              <ScoreBar
                label="预算匹配度"
                score={result.price_score || 0}
                max={25}
              />
              <ScoreBar
                label="续航匹配度"
                score={result.range_score || 0}
                max={15}
              />
              <ScoreBar
                label="空间匹配度"
                score={result.space_score || 0}
                max={15}
              />
              <ScoreBar
                label="智驾匹配度"
                score={result.autopilot_score || 0}
                max={15}
              />
              <ScoreBar
                label="安全匹配度"
                score={safetyScore}
                max={10}
              />
              <ScoreBar
                label="补能便利"
                score={chargingScore}
                max={10}
              />
              <ScoreBar
                label="性价比"
                score={result.value_score || 0}
                max={10}
              />
            </div>

            {/* 右：推荐理由 + 证据 */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, color: "#3d5a3d", marginBottom: 6 }}>
                推荐理由
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                {reasons.length > 0 ? (
                  reasons.map((r: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}
                      >
                        {r}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "#bbb" }}>暂无推荐理由</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                证据来源
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["车型库", "RAG知识库"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 10,
                      background: "#f5f5f0",
                      color: "#888",
                      border: "1px solid #e8e8e4",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 卖点标签 */}
          {v?.highlights?.length > 0 && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {v.highlights.map((h: string, i: number) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 10,
                    background: "#f0f4f0",
                    color: "#3d5a3d",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
