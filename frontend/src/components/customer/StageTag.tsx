
import type { CustomerStage } from "../../types";

const stageConfig: Record<CustomerStage, { color: string; bg: string }> = {
  新线索: { color: "#666", bg: "#f0f0ec" },
  已联系: { color: "#1a73e8", bg: "#e8f0fe" },
  有意向: { color: "#e67e00", bg: "#fff3e0" },
  谈判中: { color: "#b8860b", bg: "#fffde7" },
  已成交: { color: "#3d5a3d", bg: "#f0f4f0" },
  已流失: { color: "#cc0000", bg: "#fce8e6" },
};

interface StageTagProps {
  stage: CustomerStage;
  size?: "sm" | "md";
}

export default function StageTag({ stage, size = "md" }: StageTagProps) {
  const { color, bg } = stageConfig[stage] || { color: "#666", bg: "#f0f0ec" };
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 12,
        padding: size === "sm" ? "2px 8px" : "4px 12px",
        fontSize: size === "sm" ? 11 : 13,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {stage}
    </span>
  );
}
