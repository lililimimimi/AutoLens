// AutoLens — components/Header.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  BarChart2,
  Sparkles,
  MessageCircle,
  GitCompare,
  Users,
  Car,
} from "lucide-react";

const navItems = [
  { path: "/", icon: BarChart2, label: "数据总览" },
  { path: "/recommend", icon: Sparkles, label: "智能推荐" },
  { path: "/customer-service", icon: MessageCircle, label: "智能客服" },
  { path: "/compare", icon: GitCompare, label: "竞品对比" },
  { path: "/customers", icon: Users, label: "客户管理" },
  { path: "/vehicles", icon: Car, label: "车型管理" },
];

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header
      style={{
        display: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "#fff",
        borderBottom: "1px solid #e8e8e4",
        alignItems: "center",
        padding: "0 20px",
        zIndex: 100,
      }}
      className="mobile-header"
    >
      <button
        onClick={onMenuClick}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <Menu size={22} color="#2d2d2d" />
      </button>
      <span style={{ marginLeft: 12, fontWeight: 700, fontSize: 16 }}>
        AutoLens
      </span>
    </header>
  );
}
