// components/customer/NotesTimeline.tsx
import { Check, Plus } from "lucide-react";

const GREEN = "#5a7a5a";

interface Props {
  notes: string;
  setNotes: (v: string) => void;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export default function NotesTimeline({
  notes,
  setNotes,
  editing,
  saving,
  onEdit,
  onSave,
}: Props) {
  const lines = notes.split("\n").filter(Boolean);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d" }}>
          跟进备注
        </div>
        <button
          onClick={editing ? onSave : onEdit}
          disabled={saving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            color: GREEN,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {editing ? (
            <>
              <Check size={13} />
              {saving ? "保存中..." : "保存"}
            </>
          ) : (
            <>
              <Plus size={13} />
              添加备注
            </>
          )}
        </button>
      </div>

      {editing && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="记录跟进情况..."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: `1.5px solid ${GREEN}`,
            fontSize: 14,
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            boxSizing: "border-box",
            marginBottom: 12,
          }}
        />
      )}

      {lines.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {lines.map((line: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: GREEN,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                {i < lines.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: "#e8ede8",
                      minHeight: 20,
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: 16 }}>
                <div
                  style={{ fontSize: 14, color: "#2d2d2d", lineHeight: 1.6 }}
                >
                  {line}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            border: "1.5px dashed #e0e0d8",
            borderRadius: 8,
            padding: "20px",
            textAlign: "center",
            fontSize: 13,
            color: "#ccc",
          }}
        >
          暂无备注，点击添加备注
        </div>
      )}
    </div>
  );
}
