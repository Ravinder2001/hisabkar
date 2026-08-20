import React, { useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import { MessageSquare, Send, Receipt } from "lucide-react";
import styles from "./ShareExpenseModal.module.css";
import { ExpenseType } from "../../utils/comman/CommanTypes";

interface ShareExpenseModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  expense: ExpenseType | null;
  onShare: (message: string) => void;
}

const ShareExpenseModal: React.FC<ShareExpenseModalProps> = ({ isOpen, setIsOpen, expense, onShare }) => {
  const [message, setMessage] = useState("");

  if (!expense) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShare(message);
    setIsOpen(false);
    setMessage("");
  };

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen} className={styles.modalContent}>
      <div className={styles.container}>
        <div className={styles.header}>
          <MessageSquare style={{ color: "var(--hk-accent)" }} />
          <h2 className="text-xl font-bold ml-2">Share Expense</h2>
        </div>

        <p className={styles.subtitle}>Sharing this expense in the group chat.</p>

        <div className={styles.previewCard}>
          <div className={styles.iconBox}>
            <Receipt size={20} />
          </div>
          <div className={styles.info}>
            <h4 className={styles.expenseName}>{expense.expense_name}</h4>
            <span className={styles.expenseAmount}>₹{expense.amount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className={styles.label}>Message (Optional)</label>
          <textarea
            className={styles.textarea}
            placeholder="e.g. Why am I in this expense? / Check this out!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            autoFocus
          />

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="hk-btn-primary">
              <Send size={16} />
              Share Now
            </button>
          </div>
        </form>
      </div>
    </ModalComponent>
  );
};

export default ShareExpenseModal;
