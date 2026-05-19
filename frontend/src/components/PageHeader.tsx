
interface PageHeaderProps {
  tags?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

export default function PageHeader({
  tags,
  title,
  description,
  actionLabel,
  onAction,
  disabled,
}: PageHeaderProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #3d5a3d 0%, #5a7a5a 100%)",
        borderRadius: 12,
        padding: "24px 28px",
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        {tags && (
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            {tags}
          </div>
        )}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 6,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)" }}>
          {description}
        </p>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          disabled={disabled}
          style={{
            background: disabled ? "rgba(255,255,255,0.4)" : "#fff",
            color: disabled ? "rgba(61,90,61,0.5)" : "#3d5a3d",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 18,
            cursor: disabled ? "not-allowed" : "pointer",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          ✦ {actionLabel}
        </button>
      )}
    </div>
  );
}
