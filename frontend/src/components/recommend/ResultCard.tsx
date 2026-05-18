// AutoLens — components/recommend/ResultCard.tsx
import { useState } from "react";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const rankColors = ["#d4a017", "#aaa", "#cd7f32"];
const rankEmojis = ["🥇", "🥈", "🥉"];

function ScoreBar({
  label,
  score,
  max,
}: {
  label: string;
  score: number;
  max: number;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}
    >
      <span style={{ fontSize: 12, color: "#888", width: 72, flexShrink: 0 }}>
        {label}
      </span>
      <div
        style={{ flex: 1, background: "#f0f0ec", borderRadius: 4, height: 6 }}
      >
        <div
          style={{
            width: `${(score / max) * 100}%`,
            height: "100%",
            background: GREEN,
            borderRadius: 4,
            transition: "width 0.5s",
          }}
        />
      </div>
      <span
        style={{ fontSize: 12, color: "#888", width: 36, textAlign: "right" }}
      >
        {score}/{max}
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
        border: `1px solid ${open ? GREEN : "#e8e8e4"}`,
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
    >
      {/* 卡片头部（始终显示） */}
      <div
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
            <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>
              {v.price_min}-{v.price_max}万 · {v.seats}座
            </div>
          )}
        </div>

        {/* 评分 + 展开箭头 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: GREEN_DARK }}>
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
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            {/* 左：评分条 */}
            <div>
              <ScoreBar
                label="预算匹配度"
                score={result.price_score || 0}
                max={30}
              />
              <ScoreBar
                label="续航匹配度"
                score={result.range_score || 0}
                max={20}
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
                label="性价比"
                score={result.value_score || 0}
                max={20}
              />
            </div>

            {/* 右：推荐理由 + 证据 */}
            <div>
              <div style={{ fontSize: 14, color: "#5a7a5a", marginBottom: 6 }}>
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
                {["车型库", "RAG知识库", "DeepSearch"].map((tag) => (
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
                    color: GREEN_DARK,
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
