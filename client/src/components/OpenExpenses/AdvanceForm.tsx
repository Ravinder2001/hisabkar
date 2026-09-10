import React, { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import type { Group, Expense } from "../../pages/OpenExpenses/OpenExpenses";
import { generateId } from "../../pages/OpenExpenses/OpenExpenses";
import CustomSelect from "../CustomSelect/CustomSelect";
import styles from "./AdvanceForm.module.css";

interface AdvanceFormProps {
  group: Group;
  expense?: Expense;
  initialPaidBy?: string;
  initialToMemberId?: string;
  initialAmount?: number;
  onSubmit: (expense: Expense) => void;
}

export default function AdvanceForm({ group, expense, initialPaidBy, initialToMemberId, initialAmount, onSubmit }: AdvanceFormProps) {
  const defaultPaidBy = expense?.paidBy || initialPaidBy || group.members[0]?.id || "";
  const defaultToMemberId =
    expense?.toMemberId ||
    (expense?.shares && expense.shares.length > 0 ? expense.shares[0].memberId : "") ||
    initialToMemberId ||
    group.members.find((m) => m.id !== defaultPaidBy)?.id ||
    "";

  const [paidBy, setPaidBy] = useState<string>(defaultPaidBy);
  const [toMemberId, setToMemberId] = useState<string>(defaultToMemberId);
  const [amount, setAmount] = useState<string>(expense?.amount ? expense.amount.toString() : initialAmount ? initialAmount.toString() : "");
  const [description, setDescription] = useState<string>(expense?.description || "");

  const memberOptions = group.members.map((m) => ({ value: m.id, label: m.name }));

  const numAmount = Number.parseFloat(amount) || 0;
  const isSameMember = paidBy && toMemberId && paidBy === toMemberId;
  const isValid = numAmount > 0 && paidBy && toMemberId && !isSameMember;

  const getMemberName = (id: string) => group.members.find((m) => m.id === id)?.name || "Unknown";
  const getMemberInitial = (id: string) => getMemberName(id).charAt(0).toUpperCase();
  const getMemberIndex = (id: string) => group.members.findIndex((m) => m.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const receiverName = getMemberName(toMemberId);
    const finalDescription = description.trim() || `Advance to ${receiverName}`;

    const advanceData: Expense = {
      id: expense?.id || generateId(),
      description: finalDescription,
      amount: numAmount,
      paidBy,
      toMemberId,
      type: "advance",
      shares: [
        {
          memberId: toMemberId,
          amount: numAmount,
        },
      ],
      date: expense?.date || new Date().toISOString(),
    };

    onSubmit(advanceData);
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Given by (Payer)</label>
          <CustomSelect
            options={memberOptions}
            value={memberOptions.find((opt) => opt.value === paidBy) || null}
            onChange={(option: { value: string }) => {
              setPaidBy(option.value);
              if (option.value === toMemberId) {
                const nextMember = group.members.find((m) => m.id !== option.value);
                if (nextMember) setToMemberId(nextMember.id);
              }
            }}
            placeholder="Select who gave money"
            isSearchable={false}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Given to (Receiver)</label>
          <CustomSelect
            options={memberOptions}
            value={memberOptions.find((opt) => opt.value === toMemberId) || null}
            onChange={(option: { value: string }) => setToMemberId(option.value)}
            placeholder="Select who received money"
            isSearchable={false}
          />
          {isSameMember && <p className={styles.errorText}>Sender and receiver cannot be the same member.</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="advanceAmount">
            Amount
          </label>
          <div className={styles.amountWrap}>
            <span className={styles.amountPrefix}>₹</span>
            <input
              id="advanceAmount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="advanceNote">
            Note / Purpose (Optional)
          </label>
          <input
            id="advanceNote"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            placeholder={`e.g. Cash advance, Cab share, Room deposit`}
          />
        </div>

        {paidBy && toMemberId && !isSameMember && numAmount > 0 && (
          <div className={styles.transferPreview}>
            <div className={styles.memberPreview}>
              <div
                className="hk-avatar"
                style={{
                  width: 36,
                  height: 36,
                  fontSize: "0.85rem",
                  background: `var(--hk-avatar-${(getMemberIndex(paidBy) % 5) + 1})`,
                }}
              >
                {getMemberInitial(paidBy)}
              </div>
              <span className={styles.memberPreviewName}>{getMemberName(paidBy)}</span>
              <span className={styles.memberPreviewRole}>Gave Money</span>
            </div>

            <div className={styles.previewArrowWrap}>
              <span className={`hk-money ${styles.previewAmount}`}>₹{numAmount.toFixed(2)}</span>
              <ArrowRight size={18} className={styles.previewArrow} />
            </div>

            <div className={styles.memberPreview}>
              <div
                className="hk-avatar"
                style={{
                  width: 36,
                  height: 36,
                  fontSize: "0.85rem",
                  background: `var(--hk-avatar-${(getMemberIndex(toMemberId) % 5) + 1})`,
                }}
              >
                {getMemberInitial(toMemberId)}
              </div>
              <span className={styles.memberPreviewName}>{getMemberName(toMemberId)}</span>
              <span className={styles.memberPreviewRole}>Received Money</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="hk-btn-primary"
          disabled={!isValid}
          style={{
            opacity: isValid ? 1 : 0.5,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Send size={16} />
          {expense ? "Update Advance" : "Record Advance"}
        </button>
      </form>
    </div>
  );
}
