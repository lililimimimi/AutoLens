// AutoLens — pages/Recommend.tsx
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import RecommendForm from "../components/recommend/RecommendForm";
import AgentChain from "../components/recommend/AgentChain";
import RecommendReport from "../components/recommend/RecommendReport";
import type { UserProfile } from "../types";

const mockReport = `
## 推荐总结

基于您的需求（预算 15-25 万，4人以上家庭），我们为您推荐以下 3 款最匹配的新能源车型。

---

## 🥇 比亚迪宋PLUS DM-i — 92分

**直接结论：** 综合性价比最高，家庭用车首选。

- 插混系统成熟，综合续航 1200km
- 空间宽敞，适合4人以上家庭
- 价格区间 15-19万，性价比极高

---

## 🥈 理想L7 — 89分

**直接结论：** 增程旗舰，长途无焦虑。

- 综合续航 1315km
- 家庭舒适性顶级

---

## 🥉 问界M7 — 87分

**直接结论：** 华为智驾加持，科技感强。

- HUAWEI ADS 2.0，智驾能力业界标杆
- 6/7座可选
`;

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
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    for (let i = 0; i < 7; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    setResult(mockReport);
    setLoading(false);
    setCurrentStep(7);
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · DEEPSEARCH · SQLITE"
        title="智能推荐"
        description="基于用户画像、车型库和多 Agent 协作生成可解释推荐。"
        actionLabel="一键生成推荐"
        onAction={handleSubmit}
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}
      >
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AgentChain currentStep={currentStep} />
          <RecommendReport loading={loading} result={result} />
        </div>
      </div>
    </div>
  );
}
