// AutoLens — components/Header.tsx
import { Menu } from "lucide-react";

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
