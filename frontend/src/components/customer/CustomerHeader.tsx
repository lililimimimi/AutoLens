
import StageTag from "./StageTag";
import type { CustomerStage } from "../../types";

const GREEN = "#5a7a5a";

interface Props {
  customer: any;
  stage: CustomerStage;
  onEdit: () => void;
}

export default function CustomerHeader({ customer, stage, onEdit }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: "1px solid #f0f0ec",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: GREEN,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {customer.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#2d2d2d",
            marginBottom: 4,
          }}
        >
          {customer.name}
        </div>
        <div style={{ fontSize: 14, color: "#999" }}>
          {customer.city} · {customer.phone}
        </div>
      </div>
      <StageTag stage={stage} />
      <button
        onClick={onEdit}
        style={{
          fontSize: 13,
          color: GREEN,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        编辑
      </button>
    </div>
  );
}
