import type { UserProfile, RecommendEvidence } from "../../types";
import { FileText, Star, User, Search } from "lucide-react";

const ACCENT = "#5a7a5a";
const WARM = "#d9822b";
const MUTED = "#6f7f8f";

interface RecommendSummaryProps {
  reportMd: string;
  profile: UserProfile;
  evidence: RecommendEvidence[];
  scene: string;
  sceneReason?: string;
  createdAt?: string;
}

export default function RecommendSummary({
  reportMd,
  profile,
  evidence,
  scene,
  sceneReason,
  createdAt,
}: RecommendSummaryProps) {
  if (!reportMd) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          color: "#ccc",
          fontSize: 14,
        }}
      >
        生成推荐后显示报告
      </div>
    );
  }

  // 提取报告总结（优先取“整体推荐”段落）
  const lines = reportMd.split("\n").filter((l) => l.trim());
  const summaryIndex = lines.findIndex((l) => l.trim() === "## 整体推荐");
  const summary =
    summaryIndex >= 0
      ? lines
          .slice(summaryIndex + 1)
          .find((l) => !l.startsWith("#") && l.length > 20) || ""
      : lines.find((l) => !l.startsWith("#") && l.length > 20) || "";

  // 推荐理由（bullet points）
  const reasons = lines
    .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("•"))
    .filter((l) => !l.trim().match(/^[-•]\s*--?\s*$/))
    .slice(0, 4)
    .map((l) =>
      l
        .replace(/^[-•]\s*/, "")
        .replace(/\*\*/g, "") 
        .replace(/^#+\s*/, "") 
        .trim(),
    );

  return (
    <div
      className="recommend-summary-card"
      style={{ background: "#fff", borderRadius: 12, padding: "24px", minWidth: 0 }}
    >
      {/* 标题 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={18} color={ACCENT} />
          <span style={{ fontSize: 18, fontWeight: 600, color: "#2d2d2d" }}>
            推荐报告
          </span>
        </div>
        {createdAt && (
          <div style={{ fontSize: 12, color: "#bbb" }}>
            生成时间：
            {new Date(createdAt).toLocaleString("zh-CN", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {/* 推荐结论 */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <FileText size={16} color={ACCENT} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}>
            推荐结论
          </span>
        </div>
        <div
          className="recommend-profile-grid"
          style={{
            background: "#f5f7f2",
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 13,
            color: "#555",
            lineHeight: 1.7,
            borderLeft: `3px solid ${ACCENT}`,
          }}
        >
          {summary || "基于您的需求，已为您筛选出最匹配的车型。"}
        </div>
      </div>

      {/* 推荐理由 */}
      {reasons.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Star size={16} color={WARM} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}>
              推荐理由
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reasons.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 13,
                  color: "#555",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: WARM,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <span style={{ lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 用户画像摘要 */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <User size={16} color={MUTED} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}>
            用户画像摘要
          </span>
        </div>
        <div
          style={{
            background: "#fafafa",
            borderRadius: 8,
            padding: "12px 14px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 16px",
            fontSize: 12,
          }}
        >
          {[
            {
              label: "预算范围",
              value:
                profile.budget_min && profile.budget_max
                  ? `${profile.budget_min}–${profile.budget_max}万`
                  : "未填写",
            },
            {
              label: "家庭人数",
              value: profile.family_size
                ? `${profile.family_size}人`
                : "未填写",
            },
            { label: "通勤距离", value: profile.commute_distance || "未填写" },
            {
              label: "家充条件",
              value: profile.charging_available || "未填写",
            },
            {
              label: "偏好车型",
              value: profile.preferred_body?.join("/") || "不限",
            },
            {
              label: "偏好能源",
              value: profile.preferred_energy?.join("/") || "不限",
            },
            {
              label: "关注点",
              value: profile.focus_points?.join("、") || "未填写",
            },
            { label: "推荐场景", value: scene || "通用" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: 6 }}>
              <span style={{ color: "#999", flexShrink: 0 }}>
                {item.label}：
              </span>
              <span style={{ color: "#555", fontWeight: 500 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {sceneReason && (
          <div
            style={{
              marginTop: 10,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 12,
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            {sceneReason}
          </div>
        )}
      </div>

      {/* 证据来源 */}
      {evidence.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Search size={16} color={ACCENT} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}>
              证据来源
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["车型库", "RAG知识库", "DeepSearch"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 12,
                  background: "#f0f4f0",
                  color: ACCENT,
                  border: "1px solid #c8d8c8",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {evidence.slice(0, 2).map((e, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  color: "#888",
                  background: "#fafafa",
                  borderRadius: 6,
                  padding: "8px 12px",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: ACCENT, fontWeight: 500 }}>
                  [{e.source}]
                </span>{" "}
                {e.content.slice(0, 60)}...
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
