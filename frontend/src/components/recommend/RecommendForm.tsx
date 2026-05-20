import {
  ClipboardList,
  Wallet,
  Users,
  Navigation,
  Zap,
  Car,
  Star,
  BarChart2,
  Globe,
  Sparkles,
} from "lucide-react";
import OptionBtn from "./OptionBtn";
import type {
  UserProfile,
  BodyType,
  EnergyType,
  FocusPoint,
} from "../../types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const bodyTypes: BodyType[] = ["SUV", "轿车", "MPV", "跑车", "不限"];
const energyTypes: EnergyType[] = ["纯电", "插混", "增程", "不限"];
const focusPoints: FocusPoint[] = [
  "续航",
  "空间",
  "智驾",
  "安全",
  "性价比",
  "补能",
];

function FormRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="recommend-form-row"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 16,
        padding: "12px 14px",
        background: "#fafaf8",
        borderRadius: 10,
      }}
    >
      <div
        className="recommend-form-label"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: 110,
          paddingTop: 6,
          flexShrink: 0,
        }}
      >
        <div style={{ color: GREEN, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <div
        className="recommend-form-control"
        style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1, minWidth: 0 }}
      >
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
  const toggleList = <T extends string>(
    list: T[] | undefined,
    val: T,
    max?: number,
  ): T[] => {
    const arr = list || [];
    if (arr.includes(val)) return arr.filter((v) => v !== val);
    if (max && arr.length >= max) return arr;
    return [...arr, val];
  };

  // 需求画像预览
  const profileTags = [
    profile.budget_min && profile.budget_max
      ? `${profile.budget_min}–${profile.budget_max}万预算`
      : null,
    profile.family_size
      ? `${profile.family_size === 4 ? "4人以上" : profile.family_size + "人"}家庭`
      : null,
    profile.commute_distance ? `${profile.commute_distance}通勤` : null,
    profile.charging_available === "有"
      ? "有家充"
      : profile.charging_available === "无"
        ? "无家充"
        : null,
    profile.preferred_body?.length &&
    !profile.preferred_body.includes("不限" as BodyType)
      ? profile.preferred_body.join("/")
      : null,
    profile.preferred_energy?.length &&
    !profile.preferred_energy.includes("不限" as EnergyType)
      ? profile.preferred_energy.join("/")
      : null,
    profile.focus_points?.length
      ? `关注：${profile.focus_points.slice(0, 3).join("/")}`
      : null,
  ].filter(Boolean);

  return (
    <div
      className="recommend-form-card"
      style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", minWidth: 0 }}
    >
      {/* 标题栏 */}
      <div
        className="recommend-form-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            <ClipboardList size={18} color={GREEN} />
            购车需求表单
          </div>
          <div style={{ fontSize: 12, color: "#999" }}>
            填写您的需求，AI 将为您智能推荐最合适的车型
          </div>
        </div>
        <div
          className="recommend-form-badge"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "#f0f5f0",
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          <Sparkles size={14} color={GREEN} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: GREEN_DARK }}>
              AI 智能推荐
            </div>
            <div style={{ fontSize: 11, color: "#999" }}>
              基于多维需求分析与知识库匹配
            </div>
          </div>
        </div>
      </div>

      {/* 预算范围 */}
      <FormRow label="预算范围（万）" icon={<Wallet size={15} />}>
        <div style={{ width: "100%", padding: "0 4px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: GREEN_DARK,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            <span>{profile.budget_min}万</span>
            <span>{profile.budget_max}万</span>
          </div>
          <Slider
            range
            min={5}
            max={150}
            step={1}
            value={[profile.budget_min || 10, profile.budget_max || 30]}
            onChange={(val) => {
              const [min, max] = val as number[];
              setProfile((p) => ({ ...p, budget_min: min, budget_max: max }));
            }}
            styles={{
              track: { background: GREEN },
              handle: { borderColor: GREEN, background: "#fff", opacity: 1 },
              rail: { background: "#e0e0d8" },
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#ccc",
              marginTop: 6,
            }}
          >
            <span>5万</span>
            <span>150万</span>
          </div>
        </div>
      </FormRow>

      <FormRow label="家庭人数" icon={<Users size={15} />}>
        {[1, 2, 3, 4].map((n) => (
          <OptionBtn
            key={n}
            label={n === 4 ? "4人以上" : `${n}人`}
            selected={profile.family_size === n}
            onClick={() => setProfile((p) => ({ ...p, family_size: n }))}
          />
        ))}
      </FormRow>

      <FormRow label="通勤距离" icon={<Navigation size={15} />}>
        {(["50km以内", "50-100km", "100km以上"] as const).map((d) => (
          <OptionBtn
            key={d}
            label={d}
            selected={profile.commute_distance === d}
            onClick={() => setProfile((p) => ({ ...p, commute_distance: d }))}
          />
        ))}
      </FormRow>

      <FormRow label="有无家充" icon={<Zap size={15} />}>
        {(["有", "无", "不确定"] as const).map((c) => (
          <OptionBtn
            key={c}
            label={c}
            selected={profile.charging_available === c}
            onClick={() => setProfile((p) => ({ ...p, charging_available: c }))}
          />
        ))}
      </FormRow>

      <FormRow label="偏好车型" icon={<Car size={15} />}>
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

      <FormRow label="偏好能源" icon={<Zap size={15} />}>
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

      <FormRow label="关注点（多选，最多4项）" icon={<Star size={15} />}>
        {focusPoints.map((f) => {
          const selected = (profile.focus_points || []).includes(f);
          const maxReached = (profile.focus_points?.length || 0) >= 4;
          return (
            <OptionBtn
              key={f}
              label={f}
              selected={selected}
              disabled={!selected && maxReached}
              onClick={() =>
                setProfile((p) => ({
                  ...p,
                  focus_points: toggleList(p.focus_points, f, 4),
                }))
              }
            />
          );
        })}
        {(profile.focus_points?.length || 0) > 0 && (
          <div
            style={{ width: "100%", fontSize: 11, color: "#999", marginTop: 2 }}
          >
            已选择 {profile.focus_points?.length}/4 项
          </div>
        )}
      </FormRow>

      <FormRow label="推荐数量" icon={<BarChart2 size={15} />}>
        {[1, 2, 3].map((n) => (
          <OptionBtn
            key={n}
            label={`${n}辆`}
            selected={topN === n}
            onClick={() => setTopN(n)}
          />
        ))}
      </FormRow>

      <FormRow label="启用联网搜索" icon={<Globe size={15} />}>
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
              ? "开启，实时搜索汽车资讯补充推荐依据"
              : "关闭后仅使用本地车型库与知识库"}
          </span>
        </div>
      </FormRow>

      {/* 需求画像预览 */}
      {profileTags.length > 0 && (
        <div
          className="recommend-profile-tags"
          style={{
            margin: "12px 0",
            padding: "10px 14px",
            background: "#f0f5f0",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Sparkles size={13} color={GREEN} />
          <span style={{ fontSize: 12, color: GREEN_DARK, fontWeight: 600 }}>
            当前需求画像（AI 理解中）
          </span>
          {profileTags.map((tag, i) => (
            <span key={i} style={{ fontSize: 12, color: "#666" }}>
              {i > 0 && (
                <span style={{ color: "#ccc", marginRight: 6 }}>·</span>
              )}
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 提交按钮 */}
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 0",
          background: loading ? "#aaa" : GREEN_DARK,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: 8,
        }}
      >
        {loading ? "推荐生成中..." : "✦ 生成 AI 推荐"}
        {!loading && (
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              marginTop: 3,
            }}
          >
            预计耗时 10~20 秒
          </div>
        )}
      </button>

      {/* 步骤说明 */}
      {!loading && (
        <div
          className="recommend-step-list"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 12,
          }}
        >
          {["智能理解您的需求", "多维度匹配分析", "生成个性化推荐报告"].map(
            (s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#bbb",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                  }}
                >
                  {i + 1}
                </span>
                {s}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
