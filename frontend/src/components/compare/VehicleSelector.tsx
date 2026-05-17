// AutoLens — components/compare/VehicleSelector.tsx

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

// mock 车型库
export const mockVehicles: CompareVehicle[] = [
  {
    id: 1,
    brand: "特斯拉",
    model: "Model Y",
    energy_type: "纯电",
    price_min: 26.39,
    range_km: 688,
    autopilot_level: "L2+",
    seats: 5,
    score: 84.6,
    pros: ["能耗控制优秀", "补能网络成熟", "保值率高"],
    cons: ["内饰简约，舒适配置较少", "价格波动"],
    scores: {
      budget: 75,
      range: 88,
      space: 78,
      charging: 90,
      autopilot: 92,
      safety: 88,
    },
  },
  {
    id: 2,
    brand: "小鹏",
    model: "G6",
    energy_type: "纯电",
    price_min: 19.99,
    range_km: 755,
    autopilot_level: "L2+",
    seats: 5,
    score: 90.2,
    pros: ["800V快充", "智驾能力强", "性价比高"],
    cons: ["品牌影响力相对软弱", "后排舒适性一般"],
    scores: {
      budget: 90,
      range: 92,
      space: 80,
      charging: 95,
      autopilot: 90,
      safety: 85,
    },
  },
  {
    id: 3,
    brand: "比亚迪",
    model: "宋L EV",
    energy_type: "纯电",
    price_min: 18.98,
    range_km: 662,
    autopilot_level: "L2",
    seats: 5,
    score: 90.7,
    pros: ["纯电平台", "外观运动", "空间表现好"],
    cons: ["品牌温度一般", "后备厢容积中等"],
    scores: {
      budget: 92,
      range: 85,
      space: 88,
      charging: 82,
      autopilot: 78,
      safety: 90,
    },
  },
  {
    id: 4,
    brand: "理想",
    model: "L6",
    energy_type: "增程",
    price_min: 24.98,
    range_km: 1390,
    autopilot_level: "L2+",
    seats: 5,
    score: 88.5,
    pros: ["综合续航超长", "家庭舒适性强", "智驾覆盖广"],
    cons: ["增程系统略重", "纯电续航较短"],
    scores: {
      budget: 78,
      range: 98,
      space: 92,
      charging: 88,
      autopilot: 88,
      safety: 90,
    },
  },
  {
    id: 5,
    brand: "问界",
    model: "M7",
    energy_type: "增程",
    price_min: 24.98,
    range_km: 1300,
    autopilot_level: "L2+",
    seats: 6,
    score: 87.0,
    pros: ["华为智驾加持", "6座灵活", "内饰豪华"],
    cons: ["车身较重", "油耗略高"],
    scores: {
      budget: 78,
      range: 96,
      space: 95,
      charging: 85,
      autopilot: 95,
      safety: 88,
    },
  },
];

interface VehicleSelectorProps {
  selected: CompareVehicle[];
  onAdd: (v: CompareVehicle) => void;
  onRemove: (id: number) => void;
  onCompare: () => void;
}

export default function VehicleSelector({
  selected,
  onAdd,
  onRemove,
  onCompare,
}: VehicleSelectorProps) {
  const available = mockVehicles.filter(
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
              const v = mockVehicles.find(
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
