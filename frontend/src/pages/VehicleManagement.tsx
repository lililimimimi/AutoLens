
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

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [energy, setEnergy] = useState("全部");
  const [body, setBody] = useState("全部");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  useEffect(() => {
    getVehicles().then(setVehicles).catch(console.error);
  }, []);
  

  // 筛选
  const filtered = vehicles.filter((v) => {
    const matchSearch = v.brand.includes(search) || v.model.includes(search);
    const matchEnergy = energy === "全部" || v.energy_type === energy;
    const matchBody = body === "全部" || v.body_type === body;
    return matchSearch && matchEnergy && matchBody;
  });

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
        onSearch={setSearch}
        energy={energy}
        onEnergy={setEnergy}
        body={body}
        onBody={setBody}
        onAdd={handleAdd}
      />

      {/* 统计栏 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[
          { label: "全部车型", value: vehicles.length },
          {
            label: "纯电",
            value: vehicles.filter((v) => v.energy_type === "纯电").length,
          },
          {
            label: "插混",
            value: vehicles.filter((v) => v.energy_type === "插混").length,
          },
          {
            label: "增程",
            value: vehicles.filter((v) => v.energy_type === "增程").length,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: "#3d5a3d" }}>
              {s.value}
            </span>
            <span style={{ fontSize: 13, color: "#999" }}>{s.label}</span>
          </div>
        ))}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            fontSize: 13,
            color: "#bbb",
          }}
        >
          显示 {filtered.length} / {vehicles.length} 条
        </div>
      </div>

      {/* 表格 */}
      <VehicleTable
        vehicles={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
