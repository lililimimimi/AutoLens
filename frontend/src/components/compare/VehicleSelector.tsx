// components/compare/VehicleSelector.tsx
import { useState } from "react";
import SelectedCards from "./SelectedCards";
import AddVehicleModal from "./AddVehicleModal";

const GREEN_DARK = "#3d5a3d";
const MAX = 3;

export interface CompareVehicle {
  id: number;
  brand: string;
  model: string;
  energy_type: string;
  body_type?: string;
  price_min: number;
  price_max: number;
  range_km: number;
  autopilot_level: string;
  seats: number;
  score: number;
  pros: string[];
  cons: string[];
  scores: {
    budget: number;
    range: number;
    space: number;
    charging: number;
    autopilot: number;
    safety: number;
  };
}

interface Props {
  allVehicles: any[];
  selected: CompareVehicle[];
  onAdd: (v: CompareVehicle) => void;
  onRemove: (id: number) => void;
  onCompare: () => void;
}

export default function VehicleSelector({
  allVehicles,
  selected,
  onAdd,
  onRemove,
  onCompare,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (v: any) => {
    onAdd(v);
    if (selected.length + 1 >= MAX) setModalOpen(false);
  };

  return (
    <div
      className="compare-selector-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 20,
        border: "1.5px solid #e8ede8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* 顶部 */}
      <div
        className="compare-selector-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#2d2d2d" }}>
            选择对比车型
          </div>
          <div style={{ fontSize: 13, color: "#999", marginTop: 3 }}>
            最多可选择 {MAX} 款车型，已选择{" "}
            <span style={{ color: GREEN_DARK, fontWeight: 600 }}>
              {selected.length}/{MAX}
            </span>{" "}
            款
          </div>
        </div>
        <div className="compare-selector-actions" style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCompare}
            disabled={selected.length < 2}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              fontSize: 14,
              border: "none",
              background: selected.length < 2 ? "#e0e0d8" : GREEN_DARK,
              color: "#fff",
              cursor: selected.length < 2 ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            生成对比
          </button>
        </div>
      </div>

      <SelectedCards
        selected={selected}
        onRemove={onRemove}
        onOpenModal={() => setModalOpen(true)}
      />
      

      {modalOpen && (
        <AddVehicleModal
          vehicles={allVehicles}
          selectedIds={selected.map((v) => v.id)}
          onAdd={handleAdd}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
