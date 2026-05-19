
import {
  Building2,
  Route,
  Cpu,
  UsersRound,
  Wallet,
  Lightbulb,
} from "lucide-react";

const lucideIcons = [
  <Building2 size={20} color="#5a7a5a" />,
  <Route size={20} color="#5a7a5a" />,
  <Cpu size={20} color="#5a7a5a" />,
  <UsersRound size={20} color="#5a7a5a" />,
  <Wallet size={20} color="#5a7a5a" />,
];

interface Props {
  buyingAdvice: any[];
  reportLoading: boolean;
  onGenerateReport: () => void;
}

export default function CompareBuyingAdvice({
  buyingAdvice,
  reportLoading,
  onGenerateReport,
}: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        选购建议
      </div>
      {buyingAdvice.map((b, i) => (
        <div
          key={i}
          style={{
            marginBottom: 12,
            padding: "14px 16px",
            border: "1.5px solid #e8ede8",
            borderRadius: 10,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#f0f5f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {lucideIcons[i % lucideIcons.length]}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#2d2d2d" }}>
                {b.scenario}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: "1px 8px",
                  borderRadius: 10,
                  background: "#f0f5f0",
                  color: "#5a7a5a",
                  fontWeight: 500,
                }}
              >
                推荐
              </span>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#3d5a3d",
                marginBottom: 4,
              }}
            >
              推荐车型：{b.recommendation}
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              {b.reason}
            </div>
          </div>
          <div style={{ color: "#ccc", fontSize: 16, alignSelf: "center" }}>
            ›
          </div>
        </div>
      ))}

      {/* 选购小贴士 */}
      <div
        style={{
          marginTop: 16,
          padding: "30px 34px",
          background: "#f5f5f0",
          borderRadius: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30, flex: 1 }}>
          <Lightbulb size={70} color="#e67e00" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#e67e00" }}>
              选购小贴士
            </div>
            <div style={{ fontSize: 14, color: "#999", marginTop: 10 }}>
              建议根据用车场景、预算和充电条件综合考虑
            </div>
          </div>
        </div>
        <button
          onClick={onGenerateReport}
          disabled={reportLoading}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13,
            border: "1.5px solid #e0e0d8",
            background: "#fff",
            color: reportLoading ? "#bbb" : "#3d5a3d",
            cursor: reportLoading ? "default" : "pointer",
            fontWeight: 500,
            whiteSpace: "nowrap",
            width: 140,
            textAlign: "center" as const,
          }}
        >
          {reportLoading ? "生成中..." : "查看完整报告 ›"}
        </button>
      </div>
    </div>
  );
}
