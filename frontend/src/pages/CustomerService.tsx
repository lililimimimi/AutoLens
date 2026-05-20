
import { useState, useRef, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import ChatAgentChain from "../components/chat/ChatAgentChain";
import ChatEvidence from "../components/chat/ChatEvidence";
import type { ChatMessage, RecommendEvidence } from "../types";
import { chat } from "../api/client";



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
  const [sessionId, setSessionId] = useState<string | null>(null);
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

    try {
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1500);

      const res = await chat({
        message: input,
        session_id: sessionId || undefined,
        enable_web_search: webSearch,
      });

      clearInterval(stepTimer);
      setSessionId(res.session_id);
      setCurrentStep(4);
      setEvidence(res.evidence || []);

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: res.answer,
        created_at: res.created_at,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setCurrentStep(-1);
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "抱歉，服务出现问题，请稍后重试。",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([welcomeMessage]);
    setEvidence([]);
    setCurrentStep(-1);
  };

  return (
    <div className="chat-page responsive-page" style={{ width: "100%" }}>
      <PageHeader
        tags="MULTI-AGENT · RAG · MEMORY · SQLITE"
        title="智能客服"
        description="面向销售顾问和客户咨询的 Agent 智能客服，支持 RAG 和合规检查。"
      />

      <div
        className="chat-layout-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 20,
          height: "calc(100vh - 250px)",
        }}
      >
        {/* 左：对话区域 */}
        <div
          className="chat-main-panel"
          style={{
            background: "#fff",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            minHeight: 600,
            border: "1.5px solid #e8ede8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* 顶部标题栏 */}
          <div
            className="chat-panel-header"
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
          <div
            className="chat-message-list"
            style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}
          >
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
                    borderRadius: "12px 12px 12px 12px",
                    padding: "14px 18px",
                    fontSize: 14,
                    color: "#999",
                  }}
                >
                  正在识别需求、检索知识库并生成回复，请稍候...
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
        <div className="chat-side-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ChatAgentChain currentStep={currentStep} />
          {/* 证据区域，始终显示 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "20px 24px",
              flex: 1,
              minHeight: 300
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
