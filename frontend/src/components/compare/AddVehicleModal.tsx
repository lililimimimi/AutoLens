// components/compare/AddVehicleModal.tsx
import { useState } from "react";
import { X, Search } from "lucide-react";

const GREEN_DARK = "#3d5a3d";
const GREEN = "#5a7a5a";
const PAGE_SIZE = 5;

const BODY_TYPES = ["全部", "轿车", "SUV", "MPV", "跑车", "皮卡", "其他"];

const energyColor = (e: string) => {
  if (e === "纯电") return { background: "#e8f4e8", color: "#3d7a3d" };
  if (e === "插混") return { background: "#fff3e0", color: "#e07020" };
  if (e === "增程") return { background: "#e8f0ff", color: "#3050c0" };
  return { background: "#f0f0f0", color: "#888" };
};

interface Props {
  vehicles: any[];
  selectedIds: number[];
  onAdd: (v: any) => void;
  onClose: () => void;
}

export default function AddVehicleModal({
  vehicles,
  selectedIds,
  onAdd,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [bodyFilter, setBodyFilter] = useState("全部");
  const [page, setPage] = useState(1);

  const available = vehicles.filter((v) => !selectedIds.includes(v.id));

  const filtered = available.filter((v) => {
    const matchSearch =
      !search || v.brand.includes(search) || v.model.includes(search);
    const matchBody = bodyFilter === "全部" || v.body_type === bodyFilter;
    return matchSearch && matchBody;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: 760,
          height: 560,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部 */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f0f0ec",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600 }}>添加对比车型</div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                display: "flex",
              }}
            >
              <X size={18} />
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              color="#bbb"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="搜索品牌或车型名称"
              style={{
                width: "100%",
                padding: "8px 12px 8px 30px",
                borderRadius: 8,
                border: "1.5px solid #e0e0d8",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* 主体 */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* 左侧车身类型 */}
          <div
            style={{
              width: 100,
              borderRight: "1px solid #f0f0ec",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            {BODY_TYPES.map((b) => (
              <div
                key={b}
                onClick={() => {
                  setBodyFilter(b);
                  setPage(1);
                }}
                style={{
                  padding: "10px 16px",
                  fontSize: 13,
                  cursor: "pointer",
                  background: bodyFilter === b ? "#f0f4f0" : "transparent",
                  color: bodyFilter === b ? GREEN_DARK : "#666",
                  fontWeight: bodyFilter === b ? 600 : 400,
                  borderLeft:
                    bodyFilter === b
                      ? `3px solid ${GREEN_DARK}`
                      : "3px solid transparent",
                }}
              >
                {b}
              </div>
            ))}
          </div>

          {/* 右侧列表 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* 表头 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 160px 80px",
                padding: "10px 20px",
                fontSize: 13,
                color: "#3d5a3d",
                fontWeight: 600,
                borderBottom: "1.5px solid #e8e8e4",
                background: "#fafafa",
                flexShrink: 0,
              }}
            >
              <span>车型</span>
              <span>标签</span>
              <span>价格区间</span>
              <span>操作</span>
            </div>

            {/* 列表 */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {paginated.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 200px 160px 80px",
                    padding: "12px 20px",
                    borderBottom: "1px solid #f5f5f0",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: "#2d2d2d" }}
                  >
                    {v.brand} {v.model}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 10,
                        ...energyColor(v.energy_type),
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
                  <span style={{ fontSize: 13, color: "#666" }}>
                    {v.price_min} - {v.price_max ?? "?"} 万元
                  </span>
                  <button
                    onClick={() => onAdd(v)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      border: `1.5px solid #e0e8e0`,
                      background: "#fff",
                      color: GREEN_DARK,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    添加
                  </button>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px 20px",
                  borderTop: "1px solid #f0f0ec",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1.5px solid #e0e0d8",
                    background: "#fff",
                    color: page === 1 ? "#ccc" : "#666",
                    cursor: page === 1 ? "default" : "pointer",
                    fontSize: 13,
                  }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (n) =>
                      n === 1 || n === totalPages || Math.abs(n - page) <= 1,
                  )
                  .reduce<(number | string)[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1)
                      acc.push("...");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "..." ? (
                      <span
                        key={`e-${i}`}
                        style={{ color: "#ccc", fontSize: 13 }}
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(n as number)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "1.5px solid",
                          borderColor: page === n ? GREEN_DARK : "#e0e0d8",
                          background: page === n ? GREEN_DARK : "#fff",
                          color: page === n ? "#fff" : "#666",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: page === n ? 600 : 400,
                        }}
                      >
                        {n}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1.5px solid #e0e0d8",
                    background: "#fff",
                    color: page === totalPages ? "#ccc" : "#666",
                    cursor: page === totalPages ? "default" : "pointer",
                    fontSize: 13,
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
