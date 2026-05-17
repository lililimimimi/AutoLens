// AutoLens — components/recommend/RecommendReport.tsx
import ReactMarkdown from "react-markdown";

interface RecommendReportProps {
  loading: boolean;
  result: string | null;
}

export default function RecommendReport({
  loading,
  result,
}: RecommendReportProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minHeight: 200,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
        推荐报告
      </div>

      {/* 未开始 */}
      {!result && !loading && (
        <div
          style={{
            color: "#bbb",
            fontSize: 13,
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          填写左侧表单，点击「生成推荐」
        </div>
      )}

      {/* 加载中 */}
      {loading && (
        <div
          style={{
            color: "#999",
            fontSize: 13,
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          Agent 链路运行中，请稍候...
        </div>
      )}

      {/* 结果 */}
      {result && (
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.8,
            color: "#2d2d2d",
          }}
        >
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "20px 0 8px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    margin: "14px 0 6px",
                    color: "#2d2d2d",
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ margin: "6px 0", color: "#444" }}>{children}</p>
              ),
              li: ({ children }) => (
                <li style={{ margin: "4px 0", color: "#555" }}>{children}</li>
              ),
              hr: () => (
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #f0f0ec",
                    margin: "16px 0",
                  }}
                />
              ),
              strong: ({ children }) => (
                <strong style={{ color: "#2d2d2d", fontWeight: 600 }}>
                  {children}
                </strong>
              ),
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
