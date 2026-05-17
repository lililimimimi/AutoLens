// AutoLens — components/chat/ChatEvidence.tsx
import type { RecommendEvidence } from "../../types";

const GREEN = "#5a7a5a";

interface ChatEvidenceProps {
  evidence: RecommendEvidence[];
}

export default function ChatEvidence({ evidence }: ChatEvidenceProps) {
  if (evidence.length === 0) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        引用证据
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {evidence.map((e, i) => (
          <div
            key={i}
            style={{
              background: "#f5f5f0",
              borderRadius: 8,
              padding: "12px 14px",
              borderLeft: `3px solid ${GREEN}`,
            }}
          >
            {/* 来源 + 相关度 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>
                {e.source}
              </span>
              <span style={{ fontSize: 12, color: "#bbb" }}>
                相关度 {Math.round(e.relevance * 100)}%
              </span>
            </div>
            {/* 内容 */}
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
              {e.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
