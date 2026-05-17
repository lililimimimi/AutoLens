
import { Pencil, Trash2 } from "lucide-react";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

export interface MockVehicle {
  id: number;
  brand: string;
  model: string;
  energy_type: string;
  body_type: string;
  price_min: number;
  price_max: number;
  range_km: number;
  autopilot_level: string;
  seats: number;
  highlights: string[];
}

export const mockVehicleList: MockVehicle[] = [
  {
    id: 1,
    brand: "比亚迪",
    model: "宋PLUS DM-i",
    energy_type: "插混",
    body_type: "SUV",
    price_min: 15.98,
    price_max: 19.98,
    range_km: 100,
    autopilot_level: "L2",
    seats: 5,
    highlights: ["性价比", "低油耗", "大空间"],
  },
  {
    id: 2,
    brand: "特斯拉",
    model: "Model Y",
    energy_type: "纯电",
    body_type: "SUV",
    price_min: 26.39,
    price_max: 35.99,
    range_km: 688,
    autopilot_level: "L2+",
    seats: 5,
    highlights: ["补能网络", "保值率高", "OTA升级"],
  },
  {
    id: 3,
    brand: "理想",
    model: "L7",
    energy_type: "增程",
    body_type: "SUV",
    price_min: 31.98,
    price_max: 37.98,
    range_km: 1315,
    autopilot_level: "L2+",
    seats: 5,
    highlights: ["超长续航", "家庭舒适", "智驾强"],
  },
  {
    id: 4,
    brand: "小鹏",
    model: "G6",
    energy_type: "纯电",
    body_type: "SUV",
    price_min: 19.99,
    price_max: 27.99,
    range_km: 755,
    autopilot_level: "L2+",
    seats: 5,
    highlights: ["800V快充", "智驾强", "性价比"],
  },
  {
    id: 5,
    brand: "问界",
    model: "M7",
    energy_type: "增程",
    body_type: "SUV",
    price_min: 24.98,
    price_max: 32.98,
    range_km: 1300,
    autopilot_level: "L2+",
    seats: 6,
    highlights: ["华为智驾", "6座", "豪华内饰"],
  },
  {
    id: 6,
    brand: "比亚迪",
    model: "海豹",
    energy_type: "纯电",
    body_type: "轿车",
    price_min: 18.98,
    price_max: 28.98,
    range_km: 700,
    autopilot_level: "L2",
    seats: 5,
    highlights: ["运动外观", "CTB电池", "操控好"],
  },
  {
    id: 7,
    brand: "蔚来",
    model: "ET5",
    energy_type: "纯电",
    body_type: "轿车",
    price_min: 32.8,
    price_max: 38.6,
    range_km: 1000,
    autopilot_level: "L2+",
    seats: 5,
    highlights: ["换电模式", "豪华内饰", "社区服务"],
  },
  {
    id: 8,
    brand: "零跑",
    model: "C11",
    energy_type: "增程",
    body_type: "SUV",
    price_min: 14.99,
    price_max: 19.99,
    range_km: 1100,
    autopilot_level: "L2",
    seats: 5,
    highlights: ["入门增程", "性价比极高", "空间大"],
  },
];

const energyColors: Record<string, { color: string; bg: string }> = {
  纯电: { color: "#1a73e8", bg: "#e8f0fe" },
  插混: { color: "#3d5a3d", bg: "#f0f4f0" },
  增程: { color: "#e67e00", bg: "#fff3e0" },
};

interface VehicleTableProps {
  vehicles: MockVehicle[];
  onEdit: (v: MockVehicle) => void;
  onDelete: (id: number) => void;
}

export default function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <thead>
          <tr
            style={{ background: "#f5f5f0", borderBottom: "2px solid #e8e8e4" }}
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
                  color: "#888",
                  fontWeight: 500,
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
              {/* 品牌 */}
              <td
                style={{ padding: "14px", fontWeight: 600, color: GREEN_DARK }}
              >
                {v.brand}
              </td>

              {/* 车型 */}
              <td style={{ padding: "14px", fontWeight: 500 }}>{v.model}</td>

              {/* 能源 */}
              <td style={{ padding: "14px" }}>
                <span
                  style={{
                    ...energyColors[v.energy_type],
                    borderRadius: 12,
                    padding: "3px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {v.energy_type}
                </span>
              </td>

              {/* 车身 */}
              <td style={{ padding: "14px", color: "#666" }}>{v.body_type}</td>

              {/* 价格 */}
              <td style={{ padding: "14px", fontWeight: 500 }}>
                {v.price_min} - {v.price_max}
              </td>

              {/* 续航 */}
              <td style={{ padding: "14px", color: "#2d2d2d" }}>
                {v.range_km}
              </td>

              {/* 智驾 */}
              <td style={{ padding: "14px", color: "#666" }}>
                {v.autopilot_level}
              </td>

              {/* 座位 */}
              <td style={{ padding: "14px", color: "#666" }}>{v.seats}</td>

              {/* 卖点 */}
              <td style={{ padding: "14px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {v.highlights.map((h, i) => (
                    <span
                      key={i}
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

              {/* 操作 */}
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
