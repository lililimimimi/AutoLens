// AutoLens — components/chat/ChatBubble.tsx
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types";

const GREEN = "#5a7a5a";
const GREEN_DARK = "#3d5a3d";

interface ChatBubbleProps {
  message: ChatMessage;
}

function normalizeMarkdown(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const content = isUser ? message.content : normalizeMarkdown(message.content);

  return (
    <div
      className={`chat-bubble-row ${isUser ? "is-user" : "is-assistant"}`}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 18,
        width: "100%",
        paddingLeft: isUser ? 48 : 0,
        paddingRight: isUser ? 0 : 24,
      }}
    >
      {/* 头像 */}
      <div
        className="chat-avatar"
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
        className={`chat-bubble ${isUser ? "is-user" : "is-assistant"}`}
        style={{
          maxWidth: isUser
            ? "min(72%, 420px, calc(100% - 94px))"
            : "min(78%, 620px, calc(100% - 94px))",
          width: isUser ? "fit-content" : "min(78%, 620px, calc(100% - 94px))",
          minWidth: 0,
          background: isUser ? GREEN_DARK : "#f5f5f0",
          color: isUser ? "#fff" : "#2d2d2d",
          borderRadius: isUser ? "10px 4px 10px 10px" : "4px 12px 12px 12px",
          padding: isUser ? "10px 12px 8px" : "16px 18px",
          fontSize: isUser ? 13 : 14,
          lineHeight: isUser ? 1.45 : 1.75,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: isUser ? "pre-wrap" : "normal",
        }}
      >
        {isUser ? (
          <div
            style={{
              fontWeight: 600,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
          </div>
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
                    margin: "10px 0 4px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 14,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {children}
                </p>
              ),
              ol: ({ children }) => (
                <ol style={{ margin: "8px 0 10px", paddingLeft: 20 }}>
                  {children}
                </ol>
              ),
              ul: ({ children }) => (
                <ul style={{ margin: "8px 0 10px", paddingLeft: 20 }}>
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li
                  style={{
                    margin: "4px 0",
                    fontSize: 14,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
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
                    margin: "10px 0",
                  }}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}

        {/* 时间 */}
        <div
          style={{
            fontSize: isUser ? 10 : 11,
            color: isUser ? "rgba(255,255,255,0.6)" : "#bbb",
            marginTop: isUser ? 2 : 4,
            textAlign: "right",
            lineHeight: 1.2,
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
