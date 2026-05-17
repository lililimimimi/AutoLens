// AutoLens — pages/CustomerService.tsx
import { useState, useRef, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import ChatAgentChain from "../components/chat/ChatAgentChain";
import ChatEvidence from "../components/chat/ChatEvidence";
import type { ChatMessage, RecommendEvidence } from "../types";

const mockAnswers: Record<string, string> = {
  default: `根据您的问题，我为您整理了以下信息：

**关于新能源汽车选购：**

1. **纯电车型** 适合有家充、日常通勤距离短的用户
2. **插混/增程** 适合没有家充或长途需求较多的用户
3. **预算参考** 15-25万是目前新能源性价比最高的区间

如需更精准的推荐，可以告诉我您的具体需求。`,
};

const mockEvidence: RecommendEvidence[] = [
  {
    source: "车型知识库",
    content: "比亚迪DM-i插混系统在无家充场景下表现优异，亏电油耗约5.5L/100km",
    relevance: 0.92,
  },
  {
    source: "政策法规",
    content: "2024年新能源汽车购置税减免政策延续，购车最高可减免1万元",
    relevance: 0.87,
  },
  {
    source: "用户案例",
    content: "无家充用户选择增程车型满意度显著高于纯电车型",
    relevance: 0.81,
  },
];

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content: `您好，我是 AutoLens 智能客服。可以帮您解答车型选择、充电续航、智能驾驶、价格权益和竞品对比问题。`,
  created_at: new Date().toISOString(),
};

export default function CustomerService() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [evidence, setEvidence] = useState<RecommendEvidence[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setEvidence([]);
    setCurrentStep(0);

    // 模拟 Agent 链路
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setCurrentStep(i);
    }

    await new Promise((r) => setTimeout(r, 500));

    const aiMsg: ChatMessage = {
      role: "assistant",
      content: mockAnswers.default,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setEvidence(mockEvidence);
    setCurrentStep(4);
    setLoading(false);
  };

  const handleClear = () => {
    setMessages([welcomeMessage]);
    setEvidence([]);
    setCurrentStep(-1);
  };

  return (
    <div style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · MEMORY · SQLITE"
        title="智能客服"
        description="面向销售顾问和客户咨询的 Agent 智能客服，支持 RAG 和合规检查。"
      />

      <div
        style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}
      >
        {/* 左：对话区域 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            minHeight: 600,
          }}
        >
          {/* 顶部标题栏 */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e8e8e4",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                AutoLens 智能客服
              </span>
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  color: "#5a7a5a",
                  background: "#f0f4f0",
                  borderRadius: 10,
                  padding: "2px 10px",
                }}
              >
                ● 在线
              </span>
            </div>
            <button
              onClick={handleClear}
              style={{
                fontSize: 13,
                color: "#999",
                background: "none",
                border: "1px solid #e8e8e4",
                borderRadius: 6,
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              清空对话
            </button>
          </div>

          {/* 消息列表 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    background: "#5a7a5a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  A
                </div>
                <div
                  style={{
                    background: "#f5f5f0",
                    borderRadius: "2px 12px 12px 12px",
                    padding: "14px 18px",
                    fontSize: 18,
                    color: "#999",
                  }}
                >
                  正在思考中...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 输入框 */}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            loading={loading}
            webSearch={webSearch}
            onToggleWebSearch={() => setWebSearch((v) => !v)}
          />
        </div>

        {/* 右：Agent链路 + 证据 */}
        {/* 右：Agent链路 + 证据 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ChatAgentChain currentStep={currentStep} />
          {/* 证据区域，始终显示 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "20px 24px",
              flex: 1,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              引用证据
            </div>
            {evidence.length === 0 ? (
              <div
                style={{
                  color: "#ccc",
                  fontSize: 18,
                  textAlign: "center",
                  padding: "30px 0",
                }}
              >
                发送问题后显示引用来源
              </div>
            ) : (
              <ChatEvidence evidence={evidence} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
