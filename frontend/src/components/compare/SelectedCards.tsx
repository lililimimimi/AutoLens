
import { X, Plus } from "lucide-react";
import type { CompareVehicle } from "./VehicleSelector";

const GREEN_DARK = "#3d5a3d";
const MAX = 5;

const energyColor = (e: string) => {
  if (e === "纯电") return { bg: "#e8f4e8", color: "#3d7a3d" };
  if (e === "插混") return { bg: "#fff3e0", color: "#e07020" };
  if (e === "增程") return { bg: "#e8f0ff", color: "#3050c0" };
  return { bg: "#f0f0f0", color: "#888" };
};

interface Props {
  selected: CompareVehicle[];
  onRemove: (id: number) => void;
  onOpenModal: () => void;
}

export default function SelectedCards({
  selected,
  onRemove,
  onOpenModal,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
      {selected.map((v) => (
        <div
          key={v.id}
          style={{
            border: "1.5px solid #e0e8e0",
            borderRadius: 10,
            padding: "12px 16px",
            minWidth: 160,
            flex: "0 0 auto",
            position: "relative",
            background: "#fff",
          }}
        >
          <button
            onClick={() => onRemove(v.id)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ccc",
              padding: 0,
              display: "flex",
            }}
          >
            <X size={14} />
          </button>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#2d2d2d",
              marginBottom: 8,
              paddingRight: 16,
            }}
          >
            {v.brand} {v.model}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 10,
                background: energyColor(v.energy_type).bg,
                color: energyColor(v.energy_type).color,
              }}
            >
              {v.energy_type}
            </span>
            {v.body_type && (
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "#f0f0ec",
                  color: "#888",
                }}
              >
                {v.body_type}
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 500 }}>
            {v.price_min} - {v.price_max ?? "?"} 万元
          </div>
        </div>
      ))}

      {selected.length < MAX && (
        <div
          onClick={onOpenModal}
          style={{
            border: "1.5px dashed #d0d8d0",
            borderRadius: 10,
            padding: "12px 16px",
            minWidth: 160,
            minHeight: 100,
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            color: "#bbb",
            background: "#fafafa",
          }}
        >
          <Plus size={20} color="#ccc" />
          <span style={{ fontSize: 13 }}>添加车型</span>
        </div>
      )}
    </div>
  );
}
