import React, { useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import { MessageSquare, Send, Receipt } from "lucide-react";
import { Button } from "../ui/button";
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
          <MessageSquare className="text-blue-600" />
          <h2 className="text-xl font-bold ml-2">Share Expense</h2>
        </div>

        <p className="text-gray-500 text-sm mb-4">Sharing this expense in the group chat.</p>

        <div className={styles.previewCard}>
          <div className={styles.iconBox}>
            <Receipt className="text-green-600" size={20} />
          </div>
          <div className={styles.info}>
            <h4 className="font-semibold text-gray-800">{expense.expense_name}</h4>
            <span className="text-xs text-gray-500">₹{expense.amount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
          <textarea
            className={styles.textarea}
            placeholder="e.g. Why am I in this expense? / Check this out!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            autoFocus
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              <Send size={16} className="mr-2" />
              Share Now
            </Button>
          </div>
        </form>
      </div>
    </ModalComponent>
  );
};

export default ShareExpenseModal;
