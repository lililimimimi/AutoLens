
const GREEN = "#5a7a5a";

const agentSteps = [
  { key: "router", desc: "需求解析", time: "2.1s" },
  { key: "scene", desc: "场景判断", time: "1.8s" },
  { key: "recommender", desc: "车型筛选", time: "3.2s" },
  { key: "research", desc: "RAG 检索", time: "4.6s" },
  { key: "deep", desc: "联网搜索", time: "8.3s" },
  { key: "sales", desc: "推荐排序", time: "2.5s" },
  { key: "reflection", desc: "报告生成", time: "1.8s" },
];

interface AgentChainProps {
  currentStep: number;
}

export default function AgentChain({ currentStep }: AgentChainProps) {
  const done = currentStep >= agentSteps.length;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600 }}>Agent 调用链路</div>
        {done && (
          <div
            style={{
              fontSize: 12,
              color: GREEN,
              background: "#f0f4f0",
              borderRadius: 20,
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            运行完成 ✓
          </div>
        )}
        {currentStep >= 0 && !done && (
          <div
            style={{
              fontSize: 12,
              color: "#999",
              background: "#f5f5f0",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            运行中...
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {agentSteps.map((step, i) => {
          const isDone = currentStep > i || done;
          const isActive = currentStep === i && !done;
          return (
            <div
              key={step.key}
              style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {/* 圆圈 + 连线 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {i > 0 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: isDone ? GREEN : "#e8e8e4",
                        transition: "background 0.3s",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      flexShrink: 0,
                      background: isDone
                        ? GREEN
                        : isActive
                          ? "#8aaa7a"
                          : "#f0f0ec",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                      border: isActive
                        ? `2px solid ${GREEN}`
                        : "2px solid transparent",
                    }}
                  >
                    {isDone ? (
                      <span style={{ color: "#fff", fontSize: 13 }}>✓</span>
                    ) : isActive ? (
                      <span style={{ fontSize: 11 }}>⋯</span>
                    ) : (
                      <span style={{ fontSize: 11, color: "#bbb" }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  {i < agentSteps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: currentStep > i ? GREEN : "#e8e8e4",
                        transition: "background 0.3s",
                      }}
                    />
                  )}
                </div>
                {/* 文字 */}
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: isDone || isActive ? 600 : 400,
                      color: isDone ? "#2d2d2d" : isActive ? GREEN : "#bbb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.desc}
                  </div>
                  {isDone && (
                    <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>
                      {step.time}
                    </div>
                  )}
                  {isActive && (
                    <div style={{ fontSize: 10, color: GREEN, marginTop: 2 }}>
                      运行中
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
