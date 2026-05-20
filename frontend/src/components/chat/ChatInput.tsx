import { Send, Globe, ChevronDown } from "lucide-react";

const GREEN = "#5a7a5a";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading: boolean;
  webSearch: boolean;
  onToggleWebSearch: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading,
  webSearch,
  onToggleWebSearch,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) onSend();
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderTop: "1px solid #e8e8e4",
        padding: "16px 20px",
        borderRadius: "0 0 12px 12px",
      }}
    >
      {/* 输入框 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          background: "#fff",
          border: "1.5px solid #e0e0d8",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 10,
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入问题，Enter 发送，Shift+Enter 换行"
          rows={2}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 15,
            lineHeight: 1.6,
            resize: "none",
            color: "#2d2d2d",
            fontFamily: "inherit",
          }}
        />
        {/* 发送按钮 */}
        <button
          onClick={onSend}
          disabled={loading || !value.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: loading || !value.trim() ? "#e0e0d8" : "#3d5a3d",
            border: "none",
            cursor: loading || !value.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>

      {/* 底部工具栏 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* 联网搜索按钮 */}
        <button
          onClick={onToggleWebSearch}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 20,
            border: `1.5px solid ${webSearch ? GREEN : "#e0e0d8"}`,
            background: webSearch ? "#f0f4f0" : "#fff",
            color: webSearch ? GREEN : "#999",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: webSearch ? 600 : 400,
            transition: "all 0.2s",
          }}
        >
          <Globe size={13} />
          <span>联网搜索</span>
          <ChevronDown size={12} />
        </button>

        <span style={{ fontSize: 12, color: "#ccc" }}>
          {webSearch
            ? "已开启，将调用 DeepSearchAgent"
            : "关闭，仅使用本地知识库"}
        </span>
      </div>
    </div>
  );
}
