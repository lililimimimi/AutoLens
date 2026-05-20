
import type { EnergyType, BodyType } from "../../types";

const GREEN_DARK = "#3d5a3d";
const GREEN = "#5a7a5a";

const energyOptions: (EnergyType | "全部")[] = ["全部", "纯电", "插混", "增程"];
const bodyOptions: (BodyType | "全部")[] = [
  "全部",
  "SUV",
  "轿车",
  "MPV",
  "跑车",
];

interface VehicleFilterProps {
  search: string;
  onSearch: (v: string) => void;
  energy: string;
  onEnergy: (v: string) => void;
  body: string;
  onBody: (v: string) => void;
  onAdd: () => void;
}

export default function VehicleFilter({
  search,
  onSearch,
  energy,
  onEnergy,
  body,
  onBody,
  onAdd,
}: VehicleFilterProps) {
  return (
    <div
      className="vehicle-filter-bar"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      {/* 搜索框 */}
      <input
        className="vehicle-filter-input"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="搜索品牌或车型..."
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 14,
          border: "1.5px solid #e0e0d8",
          outline: "none",
          width: 200,
        }}
      />
      {/* 能源筛选 */}
      <div className="vehicle-filter-group" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 14,
            color: "#3d5a3d",
            fontWeight: 600,
            whiteSpace: "nowrap",
            marginRight: 4,
          }}
        >
          能源类型：
        </span>
        <select
          value={energy}
          onChange={(e) => onEnergy(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 14,
            border: "1.5px solid #e0e0d8",
            background: "#fff",
            color: "#666",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="全部">全部</option>
          <option value="纯电">纯电</option>
          <option value="插混">插混</option>
          <option value="增程">增程</option>
        </select>
      </div>
      <div className="vehicle-filter-group" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 14,
            color: "#3d5a3d",
            fontWeight: 600,
            whiteSpace: "nowrap",
            marginRight: 4,
          }}
        >
          车身类型：
        </span>
        <select
          value={body}
          onChange={(e) => onBody(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 14,
            border: "1.5px solid #e0e0d8",
            background: "#fff",
            color: "#666",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="全部">全部</option>
          <option value="SUV">SUV</option>
          <option value="轿车">轿车</option>
          <option value="MPV">MPV</option>
          <option value="跑车">跑车</option>
        </select>
      </div>
      {/* 新增按钮 */}
      <button
        className="vehicle-filter-add"
        onClick={onAdd}
        style={{
          marginLeft: "auto",
          padding: "8px 18px",
          borderRadius: 8,
          fontSize: 14,
          background: GREEN_DARK,
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        + 新增车型
      </button>
    </div>
  );
}
