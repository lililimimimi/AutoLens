// AutoLens — components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  BarChart2,
  Sparkles,
  MessageCircle,
  GitCompare,
  Users,
  Car,
} from "lucide-react";

const navItems = [
  { path: "/", icon: BarChart2, label: "数据总览"},
  { path: "/recommend", icon: Sparkles, label: "智能推荐"},
  {
    path: "/customer-service",
    icon: MessageCircle,
    label: "智能客服",
  },
  { path: "/compare", icon: GitCompare, label: "竞品对比" },
  { path: "/customers", icon: Users, label: "客户管理"},
  { path: "/vehicles", icon: Car, label: "车型管理"},
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #e8e8e4",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 20px 32px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: "#5a7a5a",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            A
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#2d2d2d" }}>
          AutoLens
        </div>
        <div style={{ fontSize: 14, color: "#999", marginTop: 2 }}>
          新能源智能推荐平台
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              textDecoration: "none",
              color: isActive ? "#5a7a5a" : "#666",
              background: isActive ? "#f0f4f0" : "transparent",
              borderRight: isActive
                ? "3px solid #5a7a5a"
                : "3px solid transparent",
              fontSize: 16,
              fontWeight: isActive ? 600 : 400,
              transition: "all 0.15s",
            })}
          >
            <span
              style={{ fontSize: 11, color: "inherit", opacity: 0.6 }}
            ></span>
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
