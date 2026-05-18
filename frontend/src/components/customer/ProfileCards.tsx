
import { Wallet, Navigation, Zap, Users, Star, Car } from "lucide-react";

const GREEN = "#5a7a5a";

interface Props {
  profile: any;
}

export default function ProfileCards({ profile }: Props) {
  if (!profile || Object.keys(profile).length === 0) return null;

  const items = [
    {
      icon: <Wallet size={16} color="#fff" />,
      label: "预算范围",
      value:
        profile.budget_min && profile.budget_max
          ? `${profile.budget_min} - ${profile.budget_max} 万`
          : null,
    },
    {
      icon: <Navigation size={16} color="#fff" />,
      label: "通勤距离",
      value: profile.commute_distance || null,
    },
    {
      icon: <Zap size={16} color="#fff" />,
      label: "有无家充",
      value: profile.charging_available || null,
    },
    {
      icon: <Users size={16} color="#fff" />,
      label: "家庭人数",
      value: profile.family_size ? `${profile.family_size} 人` : null,
    },
    {
      icon: <Star size={16} color="#fff" />,
      label: "关注点",
      value:
        profile.focus_points?.length > 0
          ? profile.focus_points.join(" · ")
          : null,
    },
    {
      icon: <Car size={16} color="#fff" />,
      label: "偏好车身",
      value:
        profile.preferred_body?.length > 0
          ? profile.preferred_body.join(" · ")
          : null,
    },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#2d2d2d",
          marginBottom: 12,
        }}
      >
        购车画像
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              background: "#f5f5f0",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              border: "1.5px solid #e0e8e0",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2d2d2d" }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
