// AutoLens — components/chat/ChatBubble.tsx
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

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
        gap: 10,
        marginBottom: 20,
        marginLeft: isUser ? "20%" : 0,
      }}
    >
      {/* 头像 */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          flexShrink: 0,
          background: isUser ? "#e8e8e4" : GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          color: isUser ? "#666" : "#fff",
        }}
      >
        {isUser ? "客" : "A"}
      </div>

      {/* 气泡 */}
      <div
        style={{
          maxWidth: "80%",
          background: isUser ? GREEN_DARK : "#f5f5f0",
          color: isUser ? "#fff" : "#2d2d2d",
          borderRadius: "12px 12px 12px 12px",
          padding: "14px 16px",
          fontSize: 14,
          lineHeight: 1.7,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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
                    fontSize: 15,
                    fontWeight: 700,
                    margin: "12px 0 6px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    margin: "10px 10px 4px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ margin: "10px 10px 4px", fontSize: 14 }}>
                  {children}
                </p>
              ),
              li: ({ children }) => (
                <li style={{ margin: "10px 10px 4px", fontSize: 14 }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 600, color: GREEN_DARK }}>
                  {children}
                </strong>
              ),
              hr: () => (
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #e8e8e4",
                    margin: "10px 10px 4px",
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
            marginTop: 4,
            textAlign: "right",
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
