// AutoLens — components/customer/CustomerDetail.tsx
import { useState, useEffect } from "react";
import StageTag from "./StageTag";
import type { CustomerStage } from "../../types";
import { updateCustomer, updateCustomerNotes } from "../../api/client";
import CustomerModal from "./CustomerModal";

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

interface CustomerDetailProps {
  customer: any;
  onStageChange?: (id: number, stage: string) => void;
}

export default function CustomerDetail({ customer,onStageChange  }: CustomerDetailProps) {
  const [notes, setNotes] = useState(customer.notes || "");
  const [stage, setStage] = useState<CustomerStage>(customer.stage);
  const [editingNotes, setEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // 切换客户时重置状态
  useEffect(() => {
    setNotes(customer.notes || "");
    setStage(customer.stage);
    setEditingNotes(false);
  }, [customer.id]);

  // 更新阶段
  const handleStageChange = async (s: CustomerStage) => {
    setStage(s);
    try {
      await updateCustomer(customer.id, { stage: s });
      onStageChange?.(customer.id, s);
    } catch (e) {
      console.error("更新阶段失败", e);
    }
  };
  // 编辑客户信息
  const handleEdit = async (data: any) => {
    await updateCustomer(customer.id, data);
    setEditModalOpen(false);
    window.location.reload();
  };

  // 保存备注
  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateCustomerNotes(customer.id, notes);
      setEditingNotes(false);
    } catch (e) {
      console.error("保存备注失败", e);
    } finally {
      setSavingNotes(false);
    }
  };

  const profile = customer.profile || {};

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
        <button
          onClick={() => setEditModalOpen(true)}
          style={{
            fontSize: 13,
            color: "#5a7a5a",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          编辑
        </button>
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
              onClick={() => handleStageChange(s)}
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
      {profile && Object.keys(profile).length > 0 && (
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
            {profile.budget_min && profile.budget_max && (
              <div>
                <span style={{ fontSize: 12, color: "#999" }}>预算范围</span>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                  {profile.budget_min} - {profile.budget_max} 万
                </div>
              </div>
            )}
            {profile.commute_distance && (
              <div>
                <span style={{ fontSize: 12, color: "#999" }}>通勤距离</span>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                  {profile.commute_distance}
                </div>
              </div>
            )}
            {profile.charging_available && (
              <div>
                <span style={{ fontSize: 12, color: "#999" }}>有无家充</span>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                  {profile.charging_available}
                </div>
              </div>
            )}
            {profile.focus_points?.length > 0 && (
              <div>
                <span style={{ fontSize: 12, color: "#999" }}>关注点</span>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                  {profile.focus_points.join(" · ")}
                </div>
              </div>
            )}
            {profile.family_size && (
              <div>
                <span style={{ fontSize: 12, color: "#999" }}>家庭人数</span>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                  {profile.family_size}人
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
        <div style={{ color: "#bbb", fontSize: 13, padding: "12px 0" }}>
          暂无推荐历史
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
        <div style={{ color: "#bbb", fontSize: 13, padding: "12px 0" }}>
          暂无对话历史
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
            onClick={
              editingNotes ? handleSaveNotes : () => setEditingNotes(true)
            }
            disabled={savingNotes}
            style={{
              fontSize: 13,
              color: GREEN,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {savingNotes ? "保存中..." : editingNotes ? "保存" : "编辑"}
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
      {editModalOpen && (
        <CustomerModal
          customer={customer}
          onSave={handleEdit}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}