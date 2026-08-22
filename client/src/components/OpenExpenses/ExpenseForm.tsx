import React, { useState } from "react";
import type { Group, Expense, ExpenseShare } from "../../pages/OpenExpenses/OpenExpenses";
import { generateId } from "../../pages/OpenExpenses/OpenExpenses";
import CustomSelect from "../CustomSelect/CustomSelect";
import styles from "./ExpenseForm.module.css";

interface ExpenseFormProps {
  group: Group;
  expense?: Expense;
  onSubmit: (expense: Expense) => void;
}

export default function ExpenseForm({ group, expense, onSubmit }: ExpenseFormProps) {
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [paidBy, setPaidBy] = useState(expense?.paidBy || group.members[0]?.id || "");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    expense?.shares.map((s: ExpenseShare) => s.memberId) || group.members.map((m) => m.id)
  );
  const [customShares, setCustomShares] = useState<{ [memberId: string]: string }>(
    expense?.shares.reduce(
      (acc: { [memberId: string]: string }, share: ExpenseShare) => ({
        ...acc,
        [share.memberId]: share.amount.toString(),
      }),
      {}
    ) || {}
  );

  const memberOptions = group.members.map((m) => ({ value: m.id, label: m.name }));

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]));
  };

  const updateCustomShare = (memberId: string, value: string) => {
    setCustomShares((prev) => ({
      ...prev,
      [memberId]: value,
    }));
  };

  const calculateShares = (): ExpenseShare[] => {
    const totalAmount = Number.parseFloat(amount) || 0;
    if (splitType === "equal") {
      const shareAmount = totalAmount / selectedMembers.length;
      return selectedMembers.map((memberId) => ({
        memberId,
        amount: shareAmount,
      }));
    } else {
      return selectedMembers.map((memberId) => ({
        memberId,
        amount: Number.parseFloat(customShares[memberId] || "0") || 0,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = calculateShares();
    const totalShares = shares.reduce((sum, share) => sum + share.amount, 0);
    const totalAmount = Number.parseFloat(amount) || 0;
    if (Math.abs(totalShares - totalAmount) > 0.01) {
      return;
    }
    const expenseData: Expense = {
      id: expense?.id || generateId(),
      description: description.trim(),
      amount: totalAmount,
      paidBy,
      shares,
      date: expense?.date || new Date().toISOString(),
    };
    onSubmit(expenseData);
  };

  const shares = calculateShares();
  const totalShares = shares.reduce((sum, share) => sum + share.amount, 0);
  const totalAmount = Number.parseFloat(amount) || 0;
  const sharesMatch = Math.abs(totalShares - totalAmount) <= 0.01;

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="amount">
            Amount
          </label>
          <div className={styles.amountWrap}>
            <span className={styles.amountPrefix}>₹</span>
            <input
              id="amount"
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
          <label className={styles.label}>Paid by</label>
          <CustomSelect
            options={memberOptions}
            value={memberOptions.find((opt) => opt.value === paidBy) || null}
            onChange={(option: { value: string }) => setPaidBy(option.value)}
            placeholder="Select who paid"
            isSearchable={false}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Split between</label>
          <div className={styles.memberList}>
            {group.members.map((member) => (
              <div key={member.id} className={styles.memberRow}>
                <input type="checkbox" checked={selectedMembers.includes(member.id)} onChange={() => toggleMember(member.id)} />
                <span className={styles.memberName}>{member.name}</span>
                {selectedMembers.includes(member.id) && splitType === "custom" && (
                  <div className={styles.shareInputWrap}>
                    <span>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={customShares[member.id] || ""}
                      onChange={(e) => updateCustomShare(member.id, e.target.value)}
                      className={styles.shareInput}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Split type</label>
          <div className={styles.segmented}>
            <button
              type="button"
              className={`${styles.segmentBtn} ${splitType === "equal" ? styles.segmentBtnActive : ""}`}
              onClick={() => setSplitType("equal")}
            >
              Split equally
            </button>
            <button
              type="button"
              className={`${styles.segmentBtn} ${splitType === "custom" ? styles.segmentBtnActive : ""}`}
              onClick={() => setSplitType("custom")}
            >
              Custom amounts
            </button>
          </div>
        </div>

        {selectedMembers.length > 0 && (
          <div className={styles.summaryCard}>
            <h4 className={styles.summaryTitle}>Share breakdown</h4>
            {shares.map((share) => (
              <div key={share.memberId} className={styles.summaryRow}>
                <span>{group.members.find((m) => m.id === share.memberId)?.name}</span>
                <span>₹{share.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className={styles.summaryTotalRow}>
              <span>Total</span>
              <span style={{ color: sharesMatch ? "var(--hk-positive)" : "var(--hk-negative)" }}>₹{totalShares.toFixed(2)}</span>
            </div>
            {!sharesMatch && <p className={styles.mismatch}>Shares must add up to ₹{totalAmount.toFixed(2)}</p>}
          </div>
        )}

        <button type="submit" className="hk-btn-primary" disabled={!sharesMatch} style={{ opacity: sharesMatch ? 1 : 0.5 }}>
          {expense ? "Update Expense" : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
