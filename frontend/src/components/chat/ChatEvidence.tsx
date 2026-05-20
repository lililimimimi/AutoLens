// AutoLens — components/chat/ChatEvidence.tsx
import { useState } from "react";
import type { RecommendEvidence } from "../../types";
import { ChevronDown, ChevronUp } from "lucide-react";

const GREEN = "#5a7a5a";

interface ChatEvidenceProps {
  evidence: RecommendEvidence[];
}

export default function ChatEvidence({ evidence }: ChatEvidenceProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (evidence.length === 0) return null;

  const unique = evidence.filter(
    (e, i, arr) => arr.findIndex((x) => x.source === e.source) === i,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {unique.map((e, i) => (
        <div
          key={i}
          style={{
            background: "#f5f5f0",
            borderRadius: 8,
            borderLeft: `3px solid ${GREEN}`,
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: GREEN,
                fontWeight: 600,
                flex: 1,
                marginRight: 8,
              }}
            >
              {e.source}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, color: "#bbb" }}>
                {Math.round(e.relevance * 100)}%
              </span>
              {expanded === i ? (
                <ChevronUp size={14} color="#bbb" />
              ) : (
                <ChevronDown size={14} color="#bbb" />
              )}
            </div>
          </div>

          {expanded === i && (
            <div
              style={{
                padding: "0 14px 12px",
                fontSize: 13,
                color: "#555",
                lineHeight: 1.6,
                width: "100%",
                boxSizing: "border-box",
                wordBreak: "break-word",
              }}
            >
              {e.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
