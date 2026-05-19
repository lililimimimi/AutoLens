// components/compare/CompareSummary.tsx
import { Leaf, Zap, Users } from "lucide-react";

const colors = ["#3d5a3d", "#e67e00", "#1a73e8"];
const lucideIcons = [
  <Leaf size={18} color="#fff" />,
  <Zap size={18} color="#fff" />,
  <Users size={18} color="#fff" />,
];

interface Props {
  analyses: any[];
  selected: any[];
}

export default function CompareSummary({ analyses, selected }: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        对比总结
      </div>
      {analyses.map((a, i) => {
        const vehicle = selected.find((v) => v.id === a.vehicle_id);
        if (!vehicle) return null;
        return (
          <div
            key={a.vehicle_id}
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
                borderRadius: "50%",
                background: colors[i % colors.length],
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
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}
                >
                  {vehicle.brand} {vehicle.model}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: "1px 8px",
                    borderRadius: 10,
                    background: "#f0f5f0",
                    color: "#5a7a5a",
                  }}
                >
                  {vehicle.energy_type}
                </span>
              </div>
              {a.tagline && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors[i % colors.length],
                    marginBottom: 4,
                  }}
                >
                  {a.tagline}
                </div>
              )}
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                {a.description}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                适合：{a.suitable_for}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                {vehicle.price_min && (
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2d2d2d",
                      }}
                    >
                      {vehicle.price_min}–{vehicle.price_max}万
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>价格区间</div>
                  </div>
                )}
                {vehicle.range_km && (
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2d2d2d",
                      }}
                    >
                      {vehicle.range_km}km
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>综合续航</div>
                  </div>
                )}
                {vehicle.battery_kwh && (
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2d2d2d",
                      }}
                    >
                      {vehicle.battery_kwh}kWh
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>电池容量</div>
                  </div>
                )}
                {vehicle.fast_charge_minutes && (
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2d2d2d",
                      }}
                    >
                      {vehicle.fast_charge_minutes}分钟
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>快充时间</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
