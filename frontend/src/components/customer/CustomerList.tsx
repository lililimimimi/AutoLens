// AutoLens — components/customer/CustomerList.tsx
import { useState } from "react";
import StageTag from "./StageTag";
import type { CustomerStage } from "../../types";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";


interface CustomerListProps {
  customers: any[];
  selected: any | null;
  onSelect: (c: any) => void;
  onAdd: () => void;
}

export default function CustomerList({
  customers,
  selected,
  onSelect,
  onAdd,
}: CustomerListProps) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
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
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 220px)",
        }}
      >
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
              {c.updated_at?.split("T")[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
