// pages/Compare.tsx
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import VehicleSelector, {
  type CompareVehicle,
} from "../components/compare/VehicleSelector";
import CompareTable from "../components/compare/CompareTable";
import CompareSummary from "../components/compare/CompareSummary";
import CompareBuyingAdvice from "../components/compare/CompareBuyingAdvice";
import CompareCharts from "../components/compare/CompareCharts";
import { compare, getVehicles } from "../api/client";

export default function Compare() {
  const [selected, setSelected] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [compared, setCompared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [buyingAdvice, setBuyingAdvice] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("图表分析");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    getVehicles().then(setAllVehicles).catch(console.error);
  }, []);

  const handleAdd = (v: CompareVehicle) => {
    if (selected.length < 3) setSelected((prev) => [...prev, v]);
  };

  const handleRemove = (id: number) => {
    setSelected((prev) => prev.filter((v) => v.id !== id));
    setCompared(false);
    setReportData(null);
    setAnalyses([]);
    setBuyingAdvice([]);
  };

  const handleCompare = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    try {
      const res = await compare({ vehicle_ids: selected.map((v) => v.id) });
      setAnalyses(res.analyses);
      setBuyingAdvice(res.buying_advice);
      setCompared(true);
    } catch (e) {
      console.error("对比生成失败", e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8003"}/api/compare/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicle_ids: selected.map((v) => v.id) }),
        },
      );
      const data = await res.json();
      setReportData(data);
      setActiveTab("完整报告");
    } catch (e) {
      console.error("报告生成失败", e);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="compare-page responsive-page" style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · SQLITE"
        title="竞品对比"
        description="围绕价格、续航、空间、智驾、补能和场景做竞品对比。"
        actionLabel={reportLoading ? "生成中..." : "一键生成报告"}
        onAction={handleGenerateReport}
        disabled={!compared || reportLoading}
      />

      <VehicleSelector
        allVehicles={allVehicles}
        selected={selected}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onCompare={handleCompare}
      />

      {compared && selected.length >= 2 && (
        <>
          <CompareTable vehicles={selected} />

          {(analyses.length > 0 || buyingAdvice.length > 0) && (
            <div
              className="compare-summary-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 20,
              }}
            >
              <CompareSummary analyses={analyses} selected={selected} />
              <CompareBuyingAdvice
                buyingAdvice={buyingAdvice}
                reportLoading={reportLoading}
                onGenerateReport={handleGenerateReport}
              />
            </div>
          )}

          <CompareCharts
            vehicles={selected}
            reportData={reportData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </>
      )}

      {!compared && !loading && (
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

      {loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "60px 0",
            textAlign: "center",
            color: "#999",
            fontSize: 15,
          }}
        >
          Agent 分析中，请稍候...
        </div>
      )}
    </div>
  );
}
