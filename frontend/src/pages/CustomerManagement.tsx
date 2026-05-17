
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import CustomerList, {
  mockCustomers,
  type MockCustomer,
} from "../components/customer/CustomerList";
import CustomerDetail from "../components/customer/CustomerDetail";

export default function CustomerManagement() {
  const [selected, setSelected] = useState<MockCustomer | null>(
    mockCustomers[0],
  );

  const handleAdd = () => {
    // TODO: 弹出新增客户表单
    alert("新增客户功能开发中");
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        tags="CRM · 线索管理 · 推荐历史 · 对话历史"
        title="客户管理"
        description="管理销售线索和客户档案，查看推荐历史、对话记录和跟进备注。"
        actionLabel="新增客户"
        onAction={handleAdd}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 20,
          height: "calc(100vh - 260px)",
        }}
      >
        {/* 左：客户列表 */}
        <CustomerList
          selected={selected}
          onSelect={setSelected}
          onAdd={handleAdd}
        />

        {/* 右：客户详情 */}
        {selected ? (
          <CustomerDetail key={selected.id} customer={selected} />
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
    </div>
  );
}
