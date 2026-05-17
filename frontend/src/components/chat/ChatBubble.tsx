// AutoLens — components/chat/ChatBubble.tsx
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types";

const GREEN = "#5a7a5a";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {/* 头像 */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          flexShrink: 0,
          background: isUser ? "#e8e8e4" : GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 700,
          color: isUser ? "#666" : "#fff",
        }}
      >
        {isUser ? "客" : "A"}
      </div>

      {/* 气泡 */}
      <div
        style={{
          maxWidth: "75%",
          background: isUser ? GREEN : "#e8ede8",
          color: isUser ? "#fff" : "#1a1a1a",
          borderRadius: isUser ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
          padding: "14px 18px",
          fontSize: 18,
          lineHeight: 1.7,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    margin: "16px 0 8px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    margin: "12px 0 6px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ margin: "6px 0", fontSize: 18 }}>{children}</p>
              ),
              li: ({ children }) => (
                <li style={{ margin: "4px 0", fontSize: 18 }}>{children}</li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 600 }}>{children}</strong>
              ),
              hr: () => (
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #e8e8e4",
                    margin: "12px 0",
                  }}
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {/* 时间 */}
        <div
          style={{
            fontSize: 11,
            color: isUser ? "rgba(255,255,255,0.6)" : "#bbb",
            marginTop: 6,
            textAlign: isUser ? "left" : "right",
          }}
        >
          {new Date(message.created_at).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
