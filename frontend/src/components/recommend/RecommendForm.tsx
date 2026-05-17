// AutoLens — components/recommend/RecommendForm.tsx
import OptionBtn from "./OptionBtn";
import type {
  UserProfile,
  BodyType,
  EnergyType,
  FocusPoint,
} from "../../types";

const GREEN = "#5a7a5a";

const bodyTypes: BodyType[] = ["SUV", "轿车", "MPV", "跑车", "不限"];
const energyTypes: EnergyType[] = ["纯电", "插混", "增程", "不限"];
const focusPoints: FocusPoint[] = [
  "续航",
  "空间",
  "智驾",
  "安全",
  "性价比",
  "补能",
  "保值",
];

// ── 表单行 ────────────────────────────────
function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 100,
          fontSize: 13,
          color: "#666",
          paddingTop: 8,
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

interface RecommendFormProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  topN: number;
  setTopN: (n: number) => void;
  deepSearch: boolean;
  setDeepSearch: (v: boolean) => void;
  loading: boolean;
  onSubmit: () => void;
}

export default function RecommendForm({
  profile,
  setProfile,
  topN,
  setTopN,
  deepSearch,
  setDeepSearch,
  loading,
  onSubmit,
}: RecommendFormProps) {
  const toggleList = <T extends string>(list: T[] | undefined, val: T): T[] => {
    const arr = list || [];
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "24px 28px" }}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
        购车需求表单
      </div>

      {/* 预算范围 */}
      <FormRow label="预算范围（万）">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            value={profile.budget_min || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, budget_min: Number(e.target.value) }))
            }
            style={{
              width: 64,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1.5px solid #e0e0d8",
              fontSize: 13,
            }}
          />
          <span style={{ color: "#999" }}>—</span>
          <input
            type="number"
            value={profile.budget_max || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, budget_max: Number(e.target.value) }))
            }
            style={{
              width: 64,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1.5px solid #e0e0d8",
              fontSize: 13,
            }}
          />
        </div>
      </FormRow>

      {/* 家庭人数 */}
      <FormRow label="家庭人数">
        {[1, 2, 3, 4].map((n) => (
          <OptionBtn
            key={n}
            label={n === 4 ? "4人以上" : `${n}人`}
            selected={profile.family_size === n}
            onClick={() => setProfile((p) => ({ ...p, family_size: n }))}
          />
        ))}
      </FormRow>

      {/* 通勤距离 */}
      <FormRow label="通勤距离">
        {(["50km以内", "50-100km", "100km以上"] as const).map((d) => (
          <OptionBtn
            key={d}
            label={d}
            selected={profile.commute_distance === d}
            onClick={() => setProfile((p) => ({ ...p, commute_distance: d }))}
          />
        ))}
      </FormRow>

      {/* 有无家充 */}
      <FormRow label="有无家充">
        {(["有", "无", "不确定"] as const).map((c) => (
          <OptionBtn
            key={c}
            label={c}
            selected={profile.charging_available === c}
            onClick={() => setProfile((p) => ({ ...p, charging_available: c }))}
          />
        ))}
      </FormRow>

      {/* 偏好车型 */}
      <FormRow label="偏好车型">
        {bodyTypes.map((b) => (
          <OptionBtn
            key={b}
            label={b}
            selected={(profile.preferred_body || []).includes(b)}
            onClick={() =>
              setProfile((p) => ({
                ...p,
                preferred_body: toggleList(p.preferred_body, b),
              }))
            }
          />
        ))}
      </FormRow>

      {/* 偏好能源 */}
      <FormRow label="偏好能源">
        {energyTypes.map((e) => (
          <OptionBtn
            key={e}
            label={e}
            selected={(profile.preferred_energy || []).includes(e)}
            onClick={() =>
              setProfile((p) => ({
                ...p,
                preferred_energy: toggleList(p.preferred_energy, e),
              }))
            }
          />
        ))}
      </FormRow>

      {/* 关注点 */}
      <FormRow label="关注点（多选）">
        {focusPoints.map((f) => (
          <OptionBtn
            key={f}
            label={f}
            selected={(profile.focus_points || []).includes(f)}
            onClick={() =>
              setProfile((p) => ({
                ...p,
                focus_points: toggleList(p.focus_points, f),
              }))
            }
          />
        ))}
      </FormRow>

      {/* 推荐数量 */}
      <FormRow label="推荐数量">
        {[1, 2, 3, 4, 5].map((n) => (
          <OptionBtn
            key={n}
            label={`${n}辆`}
            selected={topN === n}
            onClick={() => setTopN(n)}
          />
        ))}
      </FormRow>

      {/* 联网搜索开关 */}
      <FormRow label="启用联网搜索">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            onClick={() => setDeepSearch(!deepSearch)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: deepSearch ? GREEN : "#ddd",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: "#fff",
                position: "absolute",
                top: 2,
                left: deepSearch ? 22 : 2,
                transition: "left 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#999" }}>
            {deepSearch
              ? "开启，调用 DeepSearchAgent 补充实时资料"
              : "关闭，仅使用本地知识库"}
          </span>
        </div>
      </FormRow>

      {/* 提交按钮 */}
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 0",
          background: loading ? "#aaa" : GREEN,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: 8,
        }}
      >
        {loading ? "推荐生成中..." : "✦ 生成推荐"}
      </button>
    </div>
  );
}
