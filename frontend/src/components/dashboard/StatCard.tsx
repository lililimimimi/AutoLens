import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: ReactNode;
}

export default function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div
      className="dashboard-stat-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {icon}
        <span style={{ fontSize: 13, color: "#888" }}>{label}</span>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#2d2d2d",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>{sub}</div>
    </div>
  );
}
