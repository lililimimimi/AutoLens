import { useState } from "react";
import StageTag from "./StageTag";
import { Phone, Search, Calendar } from "lucide-react";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";
const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);

  const filtered = customers.filter(
    (c) =>
      c.name.includes(search) ||
      c.phone?.includes(search) ||
      c.city?.includes(search),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        border: "1.5px solid #e8ede8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* 顶部 */}
      <div
        style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f0f0ec" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#2d2d2d" }}>
              客户列表
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#999",
                background: "#f0f0ec",
                borderRadius: 10,
                padding: "2px 8px",
              }}
            >
              共 {customers.length} 位
            </span>
          </div>
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
            placeholder="搜索姓名、电话、城市..."
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

      {/* 客户列表 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {paginated.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            style={{
              padding: "16px 20px",
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
                alignItems: "flex-start",
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 5,
                    }}
                  >
                    <Phone size={11} color="#bbb" />
                    <span style={{ fontSize: 12, color: "#999" }}>
                      {c.phone}
                    </span>
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
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: 42,
                marginTop: 6,
              }}
            >
              <Calendar size={11} color="#ccc" />
              <span style={{ fontSize: 11, color: "#ccc" }}>
                最近跟进：{c.updated_at?.split("T")[0]}
              </span>
            </div>
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
              (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1,
            )
            .reduce<(number | string)[]>((acc, n, i, arr) => {
              if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(n);
              return acc;
            }, [])
            .map((n, i) =>
              n === "..." ? (
                <span key={`e-${i}`} style={{ color: "#ccc", fontSize: 13 }}>
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
  );
}
