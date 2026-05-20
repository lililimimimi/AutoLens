
import { useState } from "react";
import ScoreChart from "./ScoreChart";
import PriceRangeChart from "./PriceRangeChart";
import AbilityChart from "./AbilityChart";
import CompareReport from "./CompareReport";

const GREEN_DARK = "#3d5a3d";

interface Props {
  vehicles: any[];
  reportData: any | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CompareCharts({
  vehicles,
  reportData,
  activeTab,
  setActiveTab,
}: Props) {
  const [activeChart, setActiveChart] = useState("能力雷达");

  return (
    <div
      className="compare-charts-card"
      style={{ background: "#fff", borderRadius: 12, marginTop: 20, minWidth: 0 }}
    >
      {/* Tab 切换 */}
      <div
        className="compare-tabs"
        style={{
          display: "flex",
          borderBottom: "1.5px solid #f0f0ec",
          padding: "0 24px",
        }}
      >
        {["图表分析", "完整报告"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "14px 20px",
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? GREEN_DARK : "#999",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? `2px solid ${GREEN_DARK}`
                  : "2px solid transparent",
              cursor: "pointer",
              marginBottom: -1.5,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="compare-charts-body" style={{ padding: "20px 24px", minWidth: 0 }}>
        {activeTab === "图表分析" && (
          <>
            <div
              className="compare-chart-tabs"
              style={{ display: "flex", gap: 8, marginBottom: 20 }}
            >
              {["能力雷达", "价格·续航对比", "分项能力对比"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveChart(t)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    border: "1.5px solid",
                    borderColor: activeChart === t ? GREEN_DARK : "#e0e0d8",
                    background: activeChart === t ? "#f0f4f0" : "#fff",
                    color: activeChart === t ? GREEN_DARK : "#666",
                    cursor: "pointer",
                    fontWeight: activeChart === t ? 600 : 400,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {activeChart === "能力雷达" && <ScoreChart vehicles={vehicles} />}
            {activeChart === "价格·续航对比" && (
              <PriceRangeChart vehicles={vehicles} />
            )}
            {activeChart === "分项能力对比" && (
              <AbilityChart vehicles={vehicles} />
            )}
          </>
        )}

        {activeTab === "完整报告" && reportData && (
          <div
            className="markdown-report"
            style={{
              fontSize: 14,
              color: "#444",
              lineHeight: 1.8,
              maxWidth: "100%",
            }}
          >
            <CompareReport reportData={reportData} vehicles={vehicles} />
          </div>
        )}
      </div>
    </div>
  );
}
