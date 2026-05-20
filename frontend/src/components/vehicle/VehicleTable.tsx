
import { Pencil, Trash2 } from "lucide-react";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const energyColors: Record<string, { color: string; bg: string }> = {
  纯电: { color: "#1a73e8", bg: "#e8f0fe" },
  插混: { color: "#3d5a3d", bg: "#f0f4f0" },
  增程: { color: "#e67e00", bg: "#fff3e0" },
  燃油: { color: "#666", bg: "#f5f5f0" },
};

interface VehicleTableProps {
  vehicles: any[];
  onEdit: (v: any) => void;
  onDelete: (id: number) => void;
}

export default function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  return (
    <div
      className="vehicle-table-card table-scroll-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        border: "1.5px solid #e8e8e4",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="table-scroll-inner">
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
        <thead>
          <tr
            style={{
              background: "#f5f5f0",
              borderBottom: "2px solid #e8e8e4",
              borderTop: "2px solid #e8e8e4",
            }}
          >
            {[
              "品牌",
              "车型",
              "能源",
              "车身",
              "价格区间（万）",
              "续航（km）",
              "智驾",
              "座位",
              "卖点",
              "操作",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 14px",
                  textAlign: "left",
                  fontSize: 13,
                  color: "#3d5a3d",
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v, i) => (
            <tr
              key={v.id}
              style={{
                borderBottom: "1px solid #f5f5f0",
                background: i % 2 === 0 ? "#fff" : "#fafaf8",
                transition: "background 0.15s",
              }}
            >
              <td
                style={{ padding: "14px", fontWeight: 600, color: GREEN_DARK }}
              >
                {v.brand}
              </td>
              <td style={{ padding: "14px", fontWeight: 500 }}>{v.model}</td>
              <td style={{ padding: "14px" }}>
                <span
                  style={{
                    ...(energyColors[v.energy_type] || {
                      color: "#666",
                      bg: "#f5f5f0",
                    }),
                    borderRadius: 12,
                    padding: "3px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {v.energy_type}
                </span>
              </td>
              <td style={{ padding: "14px", color: "#666" }}>{v.body_type}</td>
              <td style={{ padding: "14px", fontWeight: 500 }}>
                {v.price_min} - {v.price_max}
              </td>
              <td style={{ padding: "14px", color: "#2d2d2d" }}>
                {v.range_km || "-"}
              </td>
              <td style={{ padding: "14px", color: "#666" }}>
                {v.autopilot_level}
              </td>
              <td style={{ padding: "14px", color: "#666" }}>{v.seats}</td>
              <td style={{ padding: "14px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(v.highlights || []).map((h: string, idx: number) => (
                    <span
                      key={idx}
                      style={{
                        background: "#f0f4f0",
                        color: GREEN,
                        borderRadius: 10,
                        padding: "2px 8px",
                        fontSize: 11,
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: "14px" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onEdit(v)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid #e0e0d8",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pencil size={14} color={GREEN} />
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1.5px solid #fce8e6",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={14} color="#cc0000" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {vehicles.length === 0 && (
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            color: "#bbb",
            fontSize: 15,
          }}
        >
          暂无车型数据
        </div>
      )}
    </div>
  );
}
