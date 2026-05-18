
const GREEN_DARK = "#3d5a3d";

const QUICK_FILTERS = [
  "全部",
  "热门推荐",
  "纯电 SUV",
  "插混/增程",
  "20万以内",
  "20-30万",
  "30万以上",
];

interface Props {
  active: string;
  onChange: (f: string) => void;
}

export default function QuickFilters({ active, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
      {QUICK_FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            fontSize: 13,
            border: "1.5px solid",
            borderColor: active === f ? GREEN_DARK : "#e0e0d8",
            background: active === f ? GREEN_DARK : "#fff",
            color: active === f ? "#fff" : "#666",
            cursor: "pointer",
            fontWeight: active === f ? 600 : 400,
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
