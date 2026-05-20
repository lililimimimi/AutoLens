// AutoLens — components/customer/CustomerModal.tsx
import { useState } from "react";
import type { CustomerStage, FocusPoint } from "../../types";

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
const focusPoints: FocusPoint[] = [
  "续航",
  "空间",
  "智驾",
  "安全",
  "性价比",
  "补能",
];

interface CustomerModalProps {
  customer?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1.5px solid #e0e0d8",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default function CustomerModal({ onSave, onClose, customer }: CustomerModalProps) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    city: customer?.city || "",
    stage: customer?.stage || ("新线索" as CustomerStage),
    notes: customer?.notes || "",
    profile: {
      budget_min: customer?.profile?.budget_min || "",
      budget_max: customer?.profile?.budget_max || "",
      charging_available:
        customer?.profile?.charging_available ||
        ("" as "有" | "无" | "不确定" | ""),
      focus_points: customer?.profile?.focus_points || ([] as FocusPoint[]),
    },
  });

  const toggleFocus = (f: FocusPoint) => {
    setForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        focus_points: prev.profile.focus_points.includes(f)
          ? prev.profile.focus_points.filter((x: FocusPoint) => x !== f)
          : prev.profile.focus_points.length >= 4
            ? prev.profile.focus_points
          : [...prev.profile.focus_points, f],
      },
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("请填写客户姓名");
      return;
    }
    const data = {
      name: form.name,
      phone: form.phone,
      city: form.city,
      stage: form.stage,
      notes: form.notes,
      profile: {
        budget_min: form.profile.budget_min
          ? Number(form.profile.budget_min)
          : undefined,
        budget_max: form.profile.budget_max
          ? Number(form.profile.budget_max)
          : undefined,
        charging_available: form.profile.charging_available || undefined,
        focus_points:
          form.profile.focus_points.length > 0
            ? form.profile.focus_points
            : undefined,
      },
    };
    onSave(data);
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="customer-modal-card app-modal-card"
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 32px",
          width: 520,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* 标题 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2d2d2d" }}>
            新增客户
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#999",
            }}
          >
            ×
          </button>
        </div>

        {/* 基本信息 */}
        <div
          className="modal-form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 20px",
          }}
        >
          <Field label="姓名 *">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="请输入姓名"
              style={inputStyle}
            />
          </Field>
          <Field label="电话">
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="请输入电话"
              style={inputStyle}
            />
          </Field>
          <Field label="城市">
            <input
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              placeholder="请输入城市"
              style={inputStyle}
            />
          </Field>
          <Field label="跟进阶段">
            <select
              value={form.stage}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  stage: e.target.value as CustomerStage,
                }))
              }
              style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="预算下限（万）">
            <input
              type="number"
              value={form.profile.budget_min}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  profile: { ...p.profile, budget_min: e.target.value },
                }))
              }
              placeholder="如：15"
              style={inputStyle}
            />
          </Field>
          <Field label="预算上限（万）">
            <input
              type="number"
              value={form.profile.budget_max}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  profile: { ...p.profile, budget_max: e.target.value },
                }))
              }
              placeholder="如：25"
              style={inputStyle}
            />
          </Field>
        </div>

        {/* 有无家充 */}
        <Field label="有无家充">
          <div style={{ display: "flex", gap: 8 }}>
            {(["有", "无", "不确定"] as const).map((c) => (
              <button
                key={c}
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    profile: { ...p.profile, charging_available: c },
                  }))
                }
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  border: `1.5px solid ${form.profile.charging_available === c ? GREEN : "#e0e0d8"}`,
                  background:
                    form.profile.charging_available === c ? "#f0f4f0" : "#fff",
                  color:
                    form.profile.charging_available === c ? GREEN_DARK : "#666",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        {/* 关注点 */}
        <Field label="关注点（多选，最多4项）">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {focusPoints.map((f) => {
              const selected = form.profile.focus_points.includes(f);
              const disabled = !selected && form.profile.focus_points.length >= 4;
              return (
                <button
                  key={f}
                  onClick={() => toggleFocus(f)}
                  disabled={disabled}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    border: `1.5px solid ${selected ? GREEN : "#e0e0d8"}`,
                    background: selected ? "#f0f4f0" : "#fff",
                    color: selected ? GREEN_DARK : disabled ? "#bbb" : "#666",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.55 : 1,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
          {form.profile.focus_points.length > 0 && (
            <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
              已选择 {form.profile.focus_points.length}/4 项
            </div>
          )}
        </Field>

        {/* 备注 */}
        <Field label="跟进备注">
          <textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="请输入备注..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>

        {/* 按钮 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 14,
              border: "1.5px solid #e0e0d8",
              background: "#fff",
              color: "#666",
              cursor: "pointer",
            }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 14,
              background: GREEN_DARK,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
