// AutoLens — components/recommend/OptionBtn.tsx

interface OptionBtnProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const GREEN = "#5a7a5a";

export default function OptionBtn({
  label,
  selected,
  onClick,
  disabled = false,
}: OptionBtnProps) {
  return (
    <button
      className="recommend-option-btn"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 14px",
        borderRadius: 6,
        border: `1.5px solid ${selected ? GREEN : "#e0e0d8"}`,
        background: selected ? GREEN : "#fff",
        color: selected ? "#fff" : disabled ? "#bbb" : "#555",
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: selected ? 600 : 400,
        opacity: disabled ? 0.55 : 1,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
