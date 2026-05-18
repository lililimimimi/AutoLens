

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

export interface CompareVehicle {
  id: number;
  brand: string;
  model: string;
  energy_type: string;
  price_min: number;
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


interface VehicleSelectorProps {
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
}: VehicleSelectorProps) {
  const available = allVehicles.filter(
    (v) => !selected.find((s) => s.id === v.id),
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600 }}>选择对比车型</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 14,
              border: "1.5px solid #e0e0d8",
              background: "#fff",
              color: "#666",
              cursor: "pointer",
            }}
          >
            导出 CSV
          </button>
          <button
            onClick={onCompare}
            disabled={selected.length < 2}
            style={{
              padding: "7px 16px",
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

      {/* 已选车型标签 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: selected.length < 4 ? 12 : 0,
        }}
      >
        {selected.map((v) => (
          <div
            key={v.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#f0f4f0",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 14,
              color: GREEN_DARK,
              border: `1px solid ${GREEN}`,
            }}
          >
            <span>
              {v.brand} {v.model}
            </span>
            <span
              onClick={() => onRemove(v.id)}
              style={{
                cursor: "pointer",
                color: "#999",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ×
            </span>
          </div>
        ))}

        {/* 添加车型下拉 */}
        {selected.length < 4 && available.length > 0 && (
          <select
            onChange={(e) => {
              const v = allVehicles.find(
                (v) => v.id === Number(e.target.value),
              );
              if (v) onAdd(v);
              e.target.value = "";
            }}
            defaultValue=""
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 14,
              border: "1.5px dashed #e0e0d8",
              background: "#fff",
              color: "#999",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="" disabled>
              + 添加车型
            </option>
            {available.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
