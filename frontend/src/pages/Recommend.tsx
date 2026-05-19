// AutoLens — pages/Recommend.tsx
import { useState } from "react";
import { Trophy } from "lucide-react";
import PageHeader from "../components/PageHeader";
import RecommendForm from "../components/recommend/RecommendForm";
import AgentChain from "../components/recommend/AgentChain";
import { ResultCard } from "../components/recommend/ResultCard";
import RecommendSummary from "../components/recommend/RecommendSummary";
import RecommendRadarChart from "../components/recommend/RadarChart";
import { recommend } from "../api/client";
import type { UserProfile, RecommendEvidence } from "../types";

const GREEN = "#5a7a5a";

export default function Recommend() {
  const [profile, setProfile] = useState<UserProfile>({
    budget_min: 15,
    budget_max: 25,
    family_size: 4,
    commute_distance: "100km以上",
    charging_available: "有",
    preferred_body: ["SUV"],
    preferred_energy: ["插混"],
    focus_points: ["续航", "智驾", "安全"],
  });
  const [topN, setTopN] = useState(3);
  const [deepSearch, setDeepSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [results, setResults] = useState<any[]>([]);
  const [reportMd, setReportMd] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<RecommendEvidence[]>([]);
  const [scene, setScene] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setResults([]);
    setReportMd(null);
    setEvidence([]);
    setCurrentStep(0);

    setTimeout(() => setCurrentStep(1), 600);
    setTimeout(() => setCurrentStep(2), 1200);

    try {
      const res = await recommend({
        profile,
        top_n: topN,
        enable_deep_search: deepSearch,
      });
      setCurrentStep(7);
      setResults(res.results || []);
      setReportMd(res.report_md);
      setEvidence(res.evidence || []);
      setScene((res as any).scene || "");
      setCreatedAt(res.created_at);
      setAiSummary(res.ai_summary ?? "");
    } catch (e) {
      setCurrentStep(-1);
      setReportMd("推荐生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · DEEPSEARCH · SQLITE"
        title="智能推荐"
        description="基于用户画像、车型库和多 Agent 协作生成可解释推荐，可开启联网搜索增强。"
        actionLabel="一键生成推荐"
        onAction={handleSubmit}
      />

      {/* 上半部分：表单 + Agent链路 + 雷达图 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
          alignItems: "stretch",
        }}
      >
        {/* 左：表单 */}
        <RecommendForm
          profile={profile}
          setProfile={setProfile}
          topN={topN}
          setTopN={setTopN}
          deepSearch={deepSearch}
          setDeepSearch={setDeepSearch}
          loading={loading}
          onSubmit={handleSubmit}
        />

        {/* 右：Agent链路 + 雷达图 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: "100%",
          }}
        >
          <AgentChain currentStep={currentStep} />
          <div style={{ flex: 1, minHeight: 300 }}>
            <RecommendRadarChart results={results} aiSummary={aiSummary} />
          </div>
        </div>
      </div>

      {/* 下半部分：推荐结果 + 推荐报告 */}
      {(results.length > 0 || loading) && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* 左：推荐结果 */}
          <div
            style={{ background: "#fff", borderRadius: 12, padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              <Trophy size={18} color={GREEN} />
              推荐结果
              <span
                style={{
                  fontSize: 14,
                  color: "#999",
                  fontWeight: 400,
                  marginLeft: 4,
                }}
              >
                共 {results.length} 辆
              </span>
            </div>

            {loading && (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  fontSize: 14,
                  padding: "40px 0",
                }}
              >
                Agent 链路运行中，请稍候...
              </div>
            )}

            {results.map((r, i) => (
              <ResultCard key={i} result={r} rank={i} defaultOpen={i === 0} />
            ))}
          </div>

          {/* 右：推荐报告 */}
          <RecommendSummary
            reportMd={reportMd || ""}
            profile={profile}
            evidence={evidence}
            scene={scene}
            createdAt={createdAt}
          />
        </div>
      )}

      {/* 未开始提示 */}
      {!loading && results.length === 0 && !reportMd && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "60px 0",
            textAlign: "center",
            color: "#bbb",
            fontSize: 14,
          }}
        >
          填写左侧表单，点击「生成推荐」
        </div>
      )}
    </div>
  );
}
