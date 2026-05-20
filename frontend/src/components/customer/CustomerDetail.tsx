
import { useState, useEffect } from "react";
import type { CustomerStage } from "../../types";
import { updateCustomer, updateCustomerNotes } from "../../api/client";
import CustomerModal from "./CustomerModal";
import CustomerHeader from "./CustomerHeader";
import StageProgress from "./StageProgress";
import ProfileCards from "./ProfileCards";
import HistoryPanel from "./HistoryPanel";
import NotesTimeline from "./NotesTimeline";

interface Props {
  customer: any;
  onStageChange?: (id: number, stage: string) => void;
}

export default function CustomerDetail({ customer, onStageChange }: Props) {
  const [notes, setNotes] = useState(customer.notes || "");
  const [stage, setStage] = useState<CustomerStage>(customer.stage);
  const [editingNotes, setEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    setNotes(customer.notes || "");
    setStage(customer.stage);
    setEditingNotes(false);
  }, [customer.id]);

  const handleStageChange = async (s: CustomerStage) => {
    setStage(s);
    try {
      await updateCustomer(customer.id, { stage: s });
      onStageChange?.(customer.id, s);
    } catch (e) {
      console.error("更新阶段失败", e);
    }
  };

  const handleEdit = async (data: any) => {
    await updateCustomer(customer.id, data);
    setEditModalOpen(false);
    window.location.reload();
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateCustomerNotes(customer.id, notes);
      setEditingNotes(false);
    } catch (e) {
      console.error("保存备注失败", e);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div
      className="customer-detail-panel"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "24px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <CustomerHeader
        customer={customer}
        stage={stage}
        onEdit={() => setEditModalOpen(true)}
      />
      <StageProgress stage={stage} onChange={handleStageChange} />
      <ProfileCards profile={customer.profile || {}} />
      <HistoryPanel />
      <NotesTimeline
        notes={notes}
        setNotes={setNotes}
        editing={editingNotes}
        saving={savingNotes}
        onEdit={() => setEditingNotes(true)}
        onSave={handleSaveNotes}
      />

      {editModalOpen && (
        <CustomerModal
          customer={customer}
          onSave={handleEdit}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}
