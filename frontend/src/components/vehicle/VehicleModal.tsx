// AutoLens — components/vehicle/VehicleModal.tsx
import { useState, useEffect } from "react";
import type { MockVehicle } from "./VehicleTable";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const emptyVehicle: Omit<MockVehicle, "id"> = {
  brand: "",
  model: "",
  energy_type: "纯电",
  body_type: "SUV",
  price_min: 0,
  price_max: 0,
  range_km: 0,
  autopilot_level: "L2",
  seats: 5,
  highlights: [],
};

interface VehicleModalProps {
  vehicle: MockVehicle | null; // null = 新增，有值 = 编辑
  onSave: (v: Omit<MockVehicle, "id">) => void;
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

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1.5px solid #e0e0d8",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

const selectStyle = {
  ...inputStyle,
  background: "#fff",
  cursor: "pointer",
};

export default function VehicleModal({
  vehicle,
  onSave,
  onClose,
}: VehicleModalProps) {
  const [form, setForm] = useState<Omit<MockVehicle, "id">>(emptyVehicle);
  const [highlightInput, setHighlightInput] = useState("");

  useEffect(() => {
    if (vehicle) {
      const { id, ...rest } = vehicle;
      setForm(rest);
    } else {
      setForm(emptyVehicle);
    }
  }, [vehicle]);

  const set = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addHighlight = () => {
    if (
      highlightInput.trim() &&
      !form.highlights.includes(highlightInput.trim())
    ) {
      setForm((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (h: string) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((x) => x !== h),
    }));
  };

  return (
    // 遮罩
    <div
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
      {/* 弹窗 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 32px",
          width: 560,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2d2d2d" }}>
            {vehicle ? "编辑车型" : "新增车型"}
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

        {/* 两列布局 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 20px",
          }}
        >
          <Field label="品牌 *">
            <input
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              style={inputStyle}
              placeholder="如：比亚迪"
            />
          </Field>
          <Field label="车型 *">
            <input
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              style={inputStyle}
              placeholder="如：宋PLUS DM-i"
            />
          </Field>
          <Field label="能源类型">
            <select
              value={form.energy_type}
              onChange={(e) => set("energy_type", e.target.value)}
              style={selectStyle}
            >
              <option>纯电</option>
              <option>插混</option>
              <option>增程</option>
            </select>
          </Field>
          <Field label="车身类型">
            <select
              value={form.body_type}
              onChange={(e) => set("body_type", e.target.value)}
              style={selectStyle}
            >
              <option>SUV</option>
              <option>轿车</option>
              <option>MPV</option>
              <option>跑车</option>
            </select>
          </Field>
          <Field label="最低价格（万）">
            <input
              type="number"
              value={form.price_min}
              onChange={(e) => set("price_min", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="最高价格（万）">
            <input
              type="number"
              value={form.price_max}
              onChange={(e) => set("price_max", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="CLTC续航（km）">
            <input
              type="number"
              value={form.range_km}
              onChange={(e) => set("range_km", Number(e.target.value))}
              style={inputStyle}
            />
          </Field>
          <Field label="智驾等级">
            <select
              value={form.autopilot_level}
              onChange={(e) => set("autopilot_level", e.target.value)}
              style={selectStyle}
            >
              <option>L2</option>
              <option>L2+</option>
              <option>L3</option>
            </select>
          </Field>
          <Field label="座位数">
            <input
              type="number"
              value={form.seats}
              onChange={(e) => set("seats", Number(e.target.value))}
              style={inputStyle}
              min={2}
              max={9}
            />
          </Field>
        </div>

        {/* 卖点标签 */}
        <Field label="卖点标签">
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHighlight();
                }
              }}
              placeholder="输入标签，Enter 添加"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={addHighlight}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: GREEN,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              添加
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {form.highlights.map((h) => (
              <span
                key={h}
                style={{
                  background: "#f0f4f0",
                  color: GREEN_DARK,
                  borderRadius: 12,
                  padding: "4px 12px",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {h}
                <span
                  onClick={() => removeHighlight(h)}
                  style={{ cursor: "pointer", color: "#999" }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>
        </Field>

        {/* 按钮 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 24,
            justifyContent: "flex-end",
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
            onClick={() => onSave(form)}
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
