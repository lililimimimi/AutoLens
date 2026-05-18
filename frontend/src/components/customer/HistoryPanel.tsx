
import { ClipboardList, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GREEN_DARK = "#3d5a3d";

export default function HistoryPanel() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {/* 推荐历史 */}
      <div
        style={{
          border: "1.5px solid #e8ede8",
          borderRadius: 10,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 4,
          }}
        >
          推荐历史
        </div>
        <ClipboardList size={36} color="#d0d8d0" strokeWidth={1.5} />
        <div style={{ fontSize: 13, color: "#bbb", textAlign: "center" }}>
          暂无推荐历史
        </div>
        <div style={{ fontSize: 12, color: "#ccc", textAlign: "center" }}>
          生成推荐后，将在这里展示推荐车型与评分。
        </div>
        <button
          onClick={() => navigate("/recommend")}
          style={{
            marginTop: 4,
            padding: "6px 16px",
            borderRadius: 8,
            fontSize: 13,
            background: GREEN_DARK,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          生成推荐
        </button>
      </div>

      {/* 对话历史 */}
      <div
        style={{
          border: "1.5px solid #e8ede8",
          borderRadius: 10,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 4,
          }}
        >
          对话历史
        </div>
        <MessageCircle size={36} color="#d0d8d0" strokeWidth={1.5} />
        <div style={{ fontSize: 13, color: "#bbb", textAlign: "center" }}>
          暂无对话记录
        </div>
        <div style={{ fontSize: 12, color: "#ccc", textAlign: "center" }}>
          客户咨询内容会自动同步到这里。
        </div>
        <button
          style={{
            marginTop: 4,
            padding: "6px 16px",
            borderRadius: 8,
            fontSize: 13,
            border: "1.5px solid #e0e0d8",
            background: "#fff",
            color: GREEN_DARK,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          查看对话
        </button>
      </div>
    </div>
  );
}
