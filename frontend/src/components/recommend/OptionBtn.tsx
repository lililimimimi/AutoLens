// AutoLens — components/recommend/OptionBtn.tsx

interface OptionBtnProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const GREEN = "#5a7a5a";

export default function OptionBtn({
  label,
  selected,
  onClick,
}: OptionBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 6,
        border: `1.5px solid ${selected ? GREEN : "#e0e0d8"}`,
        background: selected ? GREEN : "#fff",
        color: selected ? "#fff" : "#555",
        fontSize: 13,
        cursor: "pointer",
        fontWeight: selected ? 600 : 400,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
