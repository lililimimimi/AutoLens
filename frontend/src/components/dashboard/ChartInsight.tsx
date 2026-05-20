interface ChartInsightProps {
  children: React.ReactNode;
  accent?: string;
  background?: string;
}

export default function ChartInsight({
  children,
  accent = "#8c9a8c",
  background = "#f5f7f5",
}: ChartInsightProps) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: "8px 10px",
        borderRadius: 8,
        background,
        color: "#5c625c",
        fontSize: 12,
        lineHeight: 1.5,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      {children}
    </div>
  );
}
