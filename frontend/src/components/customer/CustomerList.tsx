// AutoLens — components/customer/CustomerList.tsx
import { useState } from "react";
import StageTag from "./StageTag";
import type { CustomerStage } from "../../types";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

export interface MockCustomer {
  id: number;
  name: string;
  phone: string;
  city: string;
  stage: CustomerStage;
  notes: string;
  updated_at: string;
  profile: {
    budget_min: number;
    budget_max: number;
    focus_points: string[];
    commute_distance: string;
    charging_available: string;
  };
}

export const mockCustomers: MockCustomer[] = [
  {
    id: 1,
    name: "张伟",
    phone: "138****8888",
    city: "上海",
    stage: "有意向",
    notes: "对理想L7很感兴趣，下周来店试驾",
    updated_at: "2026-05-17",
    profile: {
      budget_min: 25,
      budget_max: 35,
      focus_points: ["续航", "空间", "智驾"],
      commute_distance: "50-100km",
      charging_available: "有",
    },
  },
  {
    id: 2,
    name: "李娜",
    phone: "139****6666",
    city: "北京",
    stage: "谈判中",
    notes: "预算卡在30万，考虑问界M7和理想L6",
    updated_at: "2026-05-16",
    profile: {
      budget_min: 28,
      budget_max: 32,
      focus_points: ["智驾", "安全"],
      commute_distance: "100km以上",
      charging_available: "无",
    },
  },
  {
    id: 3,
    name: "王芳",
    phone: "137****5555",
    city: "深圳",
    stage: "已成交",
    notes: "已购比亚迪宋PLUS DM-i，满意度高",
    updated_at: "2026-05-15",
    profile: {
      budget_min: 15,
      budget_max: 20,
      focus_points: ["性价比", "续航"],
      commute_distance: "50km以内",
      charging_available: "有",
    },
  },
  {
    id: 4,
    name: "刘洋",
    phone: "136****4444",
    city: "广州",
    stage: "新线索",
    notes: "",
    updated_at: "2026-05-14",
    profile: {
      budget_min: 20,
      budget_max: 30,
      focus_points: ["空间", "补能"],
      commute_distance: "50-100km",
      charging_available: "不确定",
    },
  },
  {
    id: 5,
    name: "陈静",
    phone: "135****3333",
    city: "杭州",
    stage: "已联系",
    notes: "家庭用车，4口人，关注空间和安全",
    updated_at: "2026-05-13",
    profile: {
      budget_min: 18,
      budget_max: 25,
      focus_points: ["空间", "安全", "性价比"],
      commute_distance: "50km以内",
      charging_available: "有",
    },
  },
  {
    id: 6,
    name: "赵磊",
    phone: "134****2222",
    city: "成都",
    stage: "已流失",
    notes: "选择了燃油车，暂时不考虑新能源",
    updated_at: "2026-05-10",
    profile: {
      budget_min: 15,
      budget_max: 20,
      focus_points: ["性价比"],
      commute_distance: "50km以内",
      charging_available: "无",
    },
  },
];

interface CustomerListProps {
  selected: MockCustomer | null;
  onSelect: (c: MockCustomer) => void;
  onAdd: () => void;
}

export default function CustomerList({
  selected,
  onSelect,
  onAdd,
}: CustomerListProps) {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.includes(search) ||
      c.phone.includes(search) ||
      c.city.includes(search),
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 顶部 */}
      <div
        style={{ padding: "20px 20px 12px", borderBottom: "1px solid #f0f0ec" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600 }}>客户列表</div>
          <button
            onClick={onAdd}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              background: GREEN_DARK,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            + 新增客户
          </button>
        </div>
        {/* 搜索框 */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索姓名、电话、城市..."
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1.5px solid #e0e0d8",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* 客户列表 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f5f5f0",
              cursor: "pointer",
              background: selected?.id === c.id ? "#f0f4f0" : "#fff",
              borderLeft:
                selected?.id === c.id
                  ? `3px solid ${GREEN}`
                  : "3px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* 头像 */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: GREEN,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {c.name[0]}
                </div>
                <div>
                  <div
                    style={{ fontSize: 15, fontWeight: 600, color: "#2d2d2d" }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    {c.city} · {c.phone}
                  </div>
                </div>
              </div>
              <StageTag stage={c.stage} size="sm" />
            </div>
            {c.notes && (
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginLeft: 42,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.notes}
              </div>
            )}
            <div
              style={{
                fontSize: 11,
                color: "#ccc",
                marginLeft: 42,
                marginTop: 4,
              }}
            >
              {c.updated_at}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
