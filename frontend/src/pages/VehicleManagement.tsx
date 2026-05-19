
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import VehicleFilter from "../components/vehicle/VehicleFilter";
import VehicleTable from "../components/vehicle/VehicleTable";
import VehicleModal from "../components/vehicle/VehicleModal";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../api/client";
import { useEffect } from "react";
import { Car, Zap, Fuel, Battery } from "lucide-react";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [energy, setEnergy] = useState("全部");
  const [body, setBody] = useState("全部");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  useEffect(() => {
    getVehicles().then(setVehicles).catch(console.error);
  }, []);

  // 筛选
  // 先过滤
  const filtered = vehicles.filter((v) => {
    const matchSearch = v.brand.includes(search) || v.model.includes(search);
    const matchEnergy = energy === "全部" || v.energy_type === energy;
    const matchBody = body === "全部" || v.body_type === body;
    return matchSearch && matchEnergy && matchBody;
  });

  // 再分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAdd = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleEdit = (v: any) => {
    setEditingVehicle(v);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("确认删除该车型？")) {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingVehicle) {
        const updated = await updateVehicle(editingVehicle.id, data);
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicle.id ? updated : v)),
        );
      } else {
        const created = await createVehicle(data);
        setVehicles((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (e: any) {
      alert(e.response?.data?.detail || "保存失败，请检查必填项是否填写完整");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        tags="车型库 · RAG · ChromaDB · SQLite"
        title="车型管理"
        description="管理新能源车型数据库，支持增删改查，实时同步至推荐系统。"
        actionLabel="新增车型"
        onAction={handleAdd}
      />

      {/* 筛选栏 */}
      <VehicleFilter
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        energy={energy}
        onEnergy={(v) => {
          setEnergy(v);
          setPage(1);
        }}
        onBody={(v) => {
          setBody(v);
          setPage(1);
        }}
        body={body}
        onAdd={handleAdd}
      />

      {/* 统计栏 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[
          {
            label: "全部车型",
            value: vehicles.length,
            icon: <Car size={18} color="#5a7a5a" />,
            filterValue: "全部",
          },
          {
            label: "纯电",
            value: vehicles.filter((v) => v.energy_type === "纯电").length,
            icon: <Zap size={18} color="#5a7a5a" />,
            filterValue: "纯电",
          },
          {
            label: "插混",
            value: vehicles.filter((v) => v.energy_type === "插混").length,
            icon: <Fuel size={18} color="#5a7a5a" />,
            filterValue: "插混",
          },
          {
            label: "增程",
            value: vehicles.filter((v) => v.energy_type === "增程").length,
            icon: <Battery size={18} color="#5a7a5a" />,
            filterValue: "增程",
          },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => setEnergy(s.filterValue)}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              border:
                energy === s.filterValue
                  ? "1.5px solid #3d5a3d"
                  : "1.5px solid #e8ede8",
              minWidth: 0,
              flex: 1,
              height: 56,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: energy === s.filterValue ? "#d4e4d4" : "#f0f5f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#3d5a3d",
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
        
      </div>

      {/* 表格 */}
      <VehicleTable
        vehicles={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* 分页 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
          fontSize: 14,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            fontSize: 14,
            border: "1.5px solid #e0e0d8",
            background: page === 1 ? "#f5f5f0" : "#fff",
            color: page === 1 ? "#bbb" : "#2d2d2d",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          上一页
        </button>
        <span style={{ color: "#888" }}>
          第 {page} / {totalPages} 页，共 {filtered.length} 条
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            fontSize: 14,
            border: "1.5px solid #e0e0d8",
            background: page === totalPages ? "#f5f5f0" : "#fff",
            color: page === totalPages ? "#bbb" : "#2d2d2d",
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          下一页
        </button>
      </div>

      {/* 弹窗 */}
      {modalOpen && (
        <VehicleModal
          vehicle={editingVehicle}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
