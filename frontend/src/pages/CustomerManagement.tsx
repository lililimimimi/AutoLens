
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { getCustomers } from "../api/client";
import { useEffect } from "react";
import CustomerList from "../components/customer/CustomerList";
import CustomerDetail from "../components/customer/CustomerDetail";
import CustomerModal from "../components/customer/CustomerModal";
import { createCustomer } from "../api/client";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getCustomers()
      .then((data) => {
        setCustomers(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(console.error);
  }, []);

  const handleAdd = () => setModalOpen(true);

  const handleSave = async (data: any) => {
    const created = await createCustomer(data);
    setCustomers((prev) => [created, ...prev]);
    setSelected(created);
    setModalOpen(false);
  };

  const handleStageChange = (id: number, stage: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage } : c)),
    );
    setSelected((prev: any) => (prev?.id === id ? { ...prev, stage } : prev));
  };

  const handleCustomerUpdate = (updated: any) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
    setSelected(updated);
  };

  return (
    <div className="customer-page responsive-page" style={{ width: "100%" }}>
      <PageHeader
        tags="CRM · 线索管理 · 推荐历史 · 对话历史"
        title="客户管理"
        description="管理销售线索和客户档案，查看推荐历史、对话记录和跟进备注。"
        actionLabel="新增客户"
        onAction={handleAdd}
      />

      <div
        className="customer-management-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 20,
          height: "calc(100vh - 220px)",
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        {/* 左：客户列表 */}
        <CustomerList
          customers={customers}
          selected={selected}
          onSelect={setSelected}
          onAdd={handleAdd}
        />

        {/* 右：客户详情 */}
        {selected ? (
          <CustomerDetail
            key={selected.id}
            customer={selected}
            onStageChange={handleStageChange}
            onCustomerUpdate={handleCustomerUpdate}
          />
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: 15,
              
            }}
          >
            点击左侧客户查看详情
          </div>
        )}
      </div>

      {modalOpen && (
        <CustomerModal
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
