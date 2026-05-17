// AutoLens — pages/Compare.tsx
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import VehicleSelector, {
  mockVehicles,
  type CompareVehicle,
} from "../components/compare/VehicleSelector";
import ScoreChart from "../components/compare/ScoreChart";
import PriceRangeChart from "../components/compare/PriceRangeChart";
import AbilityChart from "../components/compare/AbilityChart";
import CompareTable from "../components/compare/CompareTable";

export default function Compare() {
  const [selected, setSelected] = useState<CompareVehicle[]>([
    mockVehicles[0],
    mockVehicles[1],
    mockVehicles[2],
  ]);
  const [compared, setCompared] = useState(true);

  const handleAdd = (v: CompareVehicle) => {
    if (selected.length < 4) setSelected((prev) => [...prev, v]);
  };

  const handleRemove = (id: number) => {
    setSelected((prev) => prev.filter((v) => v.id !== id));
    if (selected.length <= 2) setCompared(false);
  };

  const handleCompare = () => setCompared(true);

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · DEEPSEARCH · SKILLS · SQLITE"
        title="竞品对比"
        description="围绕价格、续航、空间、智驾、补能和场景做竞品对比。"
        actionLabel="一键生成报告"
        onAction={handleCompare}
      />

      {/* 选车区域 */}
      <VehicleSelector
        selected={selected}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onCompare={handleCompare}
      />

      {/* 图表区域 */}
      {compared && selected.length >= 2 && (
        <>
          {/* 第一行：综合评分 + 价格续航 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <ScoreChart vehicles={selected} />
            <PriceRangeChart vehicles={selected} />
          </div>

          {/* 第二行：分项能力 */}
          <div style={{ marginBottom: 20 }}>
            <AbilityChart vehicles={selected} />
          </div>

          {/* 第三行：详细对比表格 */}
          <CompareTable vehicles={selected} />
        </>
      )}

      {/* 未对比提示 */}
      {!compared && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "60px 0",
            textAlign: "center",
            color: "#bbb",
            fontSize: 15,
          }}
        >
          请选择至少 2 辆车型，点击「生成对比」
        </div>
      )}
    </div>
  );
}
