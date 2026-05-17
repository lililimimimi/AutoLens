// AutoLens — components/customer/CustomerDetail.tsx
import { useState } from "react";
import StageTag from "./StageTag";
import type { MockCustomer } from "./CustomerList";
import type { CustomerStage } from "../../types";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const stages: CustomerStage[] = [
  "新线索",
  "已联系",
  "有意向",
  "谈判中",
  "已成交",
  "已流失",
];

const mockRecommendHistory = [
  { date: "2026-05-16", scene: "家庭通勤", top1: "理想L7", score: 89 },
  { date: "2026-05-14", scene: "通用", top1: "比亚迪宋PLUS DM-i", score: 92 },
];

const mockChatHistory = [
  { date: "2026-05-17", summary: "咨询增程车型的亏电油耗问题" },
  { date: "2026-05-15", summary: "询问理想L7和问界M7的对比" },
];

interface CustomerDetailProps {
  customer: MockCustomer;
}

export default function CustomerDetail({ customer }: CustomerDetailProps) {
  const [notes, setNotes] = useState(customer.notes);
  const [stage, setStage] = useState<CustomerStage>(customer.stage);
  const [editingNotes, setEditingNotes] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "24px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* 基本信息 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px solid #f0f0ec",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            background: GREEN,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {customer.name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#2d2d2d",
              marginBottom: 4,
            }}
          >
            {customer.name}
          </div>
          <div style={{ fontSize: 14, color: "#999" }}>
            {customer.city} · {customer.phone}
          </div>
        </div>
        <StageTag stage={stage} />
      </div>

      {/* 跟进阶段 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 10,
          }}
        >
          跟进阶段
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                border: `1.5px solid ${stage === s ? GREEN : "#e0e0d8"}`,
                background: stage === s ? "#f0f4f0" : "#fff",
                color: stage === s ? GREEN_DARK : "#666",
                cursor: "pointer",
                fontWeight: stage === s ? 600 : 400,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 购车画像 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 10,
          }}
        >
          购车画像
        </div>
        <div
          style={{
            background: "#f5f5f0",
            borderRadius: 10,
            padding: "14px 16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <div>
            <span style={{ fontSize: 12, color: "#999" }}>预算范围</span>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
              {customer.profile.budget_min} - {customer.profile.budget_max} 万
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: "#999" }}>通勤距离</span>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
              {customer.profile.commute_distance}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: "#999" }}>有无家充</span>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
              {customer.profile.charging_available}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: "#999" }}>关注点</span>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
              {customer.profile.focus_points.join(" · ")}
            </div>
          </div>
        </div>
      </div>

      {/* 推荐历史 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 10,
          }}
        >
          推荐历史
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {mockRecommendHistory.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#f5f5f0",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  Top1：{r.top1}
                </div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                  {r.date} · {r.scene}
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: GREEN_DARK }}>
                {r.score}分
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 对话历史 */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 10,
          }}
        >
          对话历史
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {mockChatHistory.map((c, i) => (
            <div
              key={i}
              style={{
                background: "#f5f5f0",
                borderRadius: 8,
                padding: "12px 14px",
                borderLeft: `3px solid ${GREEN}`,
              }}
            >
              <div style={{ fontSize: 13, color: "#2d2d2d" }}>{c.summary}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {c.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 跟进备注 */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}>
            跟进备注
          </div>
          <button
            onClick={() => setEditingNotes(!editingNotes)}
            style={{
              fontSize: 13,
              color: GREEN,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {editingNotes ? "保存" : "编辑"}
          </button>
        </div>
        {editingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: `1.5px solid ${GREEN}`,
              fontSize: 14,
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <div
            style={{
              background: "#f5f5f0",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 14,
              color: notes ? "#2d2d2d" : "#bbb",
              lineHeight: 1.6,
              minHeight: 80,
            }}
          >
            {notes || "暂无备注，点击编辑添加"}
          </div>
        )}
      </div>
    </div>
  );
}
