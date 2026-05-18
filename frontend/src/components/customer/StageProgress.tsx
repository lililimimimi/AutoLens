
import {
  UserPlus,
  Phone,
  Heart,
  MessageSquare,
  CheckCircle,
  X,
} from "lucide-react";
import type { CustomerStage } from "../../types";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

const stages: CustomerStage[] = [
  "新线索",
  "已联系",
  "有意向",
  "谈判中",
  "已成交",
  "已流失",
];

const iconMap: Record<string, React.ReactNode> = {
  新线索: <UserPlus size={14} />,
  已联系: <Phone size={14} />,
  有意向: <Heart size={14} />,
  谈判中: <MessageSquare size={14} />,
  已成交: <CheckCircle size={14} />,
  已流失: <X size={14} />,
};

interface Props {
  stage: CustomerStage;
  onChange: (s: CustomerStage) => void;
}

export default function StageProgress({ stage, onChange }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#2d2d2d",
          marginBottom: 14,
        }}
      >
        跟进阶段
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {stages.map((s, i) => {
          const currentIndex = stages.indexOf(stage);
          const isDone = i < currentIndex;
          const isActive = s === stage;
          const isLost = s === "已流失";

          const color = isActive
            ? isLost
              ? "#e07070"
              : GREEN_DARK
            : isDone
              ? GREEN
              : "#ccc";

          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                flex: s === "已流失" ? "none" : 1,
              }}
            >
              <div
                onClick={() => onChange(s)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: `2px solid ${color}`,
                    background: isActive
                      ? isLost
                        ? "#e07070"
                        : GREEN_DARK
                      : isDone
                        ? GREEN_DARK
                        : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#fff" : isDone ? "#fff" : "#ccc",
                    transition: "all 0.15s",
                  }}
                >
                  {iconMap[s]}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color,
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: isDone ? GREEN : "#e8e8e4",
                    marginBottom: 20,
                    marginLeft: 4,
                    marginRight: 4,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
