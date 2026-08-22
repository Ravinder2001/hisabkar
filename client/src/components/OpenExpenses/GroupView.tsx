import React, { useState } from "react";
import { Users, Receipt, Calculator, Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import type { Group, Expense } from "../../pages/OpenExpenses/OpenExpenses";
import CustomAlert from "../CustomAlert/CustomAlert";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./GroupView.module.css";

interface GroupViewProps {
  group: Group;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onSettleUp: () => void;
  onAddMember: (name: string) => void;
  getMemberName: (memberId: string) => string;
}

export default function GroupView({ group, onAddExpense, onEditExpense, onDeleteExpense, onSettleUp, onAddMember, getMemberName }: GroupViewProps) {
  const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const closeDeleteModal = () => setExpenseToDelete(null);

  const confirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete.id);
      closeDeleteModal();
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName);
    setNewMemberName("");
  };

  // Function to calculate total spent by a member
  const getTotalSpent = (memberId: string) => {
    return group.expenses
      .filter((exp) => exp.paidBy === memberId)
      .reduce((sum, exp) => sum + exp.amount, 0)
      .toFixed(2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <div className={`hk-card ${styles.statCard}`}>
          <div className={styles.statIcon}>
            <Users size={12} />
          </div>
          <div className={styles.statText}>
            <p className={styles.statLabel}>Members</p>
            <p className={styles.statValue}>{group.members.length}</p>
          </div>
        </div>
        <div className={`hk-card ${styles.statCard}`}>
          <div className={styles.statIcon}>
            <Receipt size={12} />
          </div>
          <div className={styles.statText}>
            <p className={styles.statLabel}>Expenses</p>
            <p className={styles.statValue}>{group.expenses.length}</p>
          </div>
        </div>
        <div className={`hk-card ${styles.statCard}`}>
          <div className={styles.statIcon}>
            <Calculator size={12} />
          </div>
          <div className={styles.statText}>
            <p className={styles.statLabel}>Total</p>
            <p className={`hk-money ${styles.statValue}`}>₹{totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button className={styles.addMemberBtn} onClick={() => setAddMemberModalOpen(true)} aria-label="Add member">
          <UserPlus size={18} />
        </button>
        <button className={`hk-btn-primary ${styles.pillBtn}`} onClick={onAddExpense}>
          <Plus size={18} />
          Add Expense
        </button>
        <button className={`${styles.settleBtn} ${styles.pillBtn}`} onClick={onSettleUp}>
          <Calculator size={18} />
          Settle Up
        </button>
      </div>

      <div className={styles.section}>
        <div className="hk-section-label">Members</div>
        <div className={`hk-card ${styles.membersCard}`}>
          <div className={styles.membersGrid}>
            {group.members.map((member, index) => (
              <div key={member.id} className={styles.memberTile}>
                <div className="hk-avatar" style={{ width: 40, height: 40, fontSize: "0.9rem", background: `var(--hk-avatar-${(index % 5) + 1})` }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <p className={styles.memberName}>{member.name}</p>
                <p className={styles.memberSpent}>₹{getTotalSpent(member.id)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className="hk-section-label">Recent Expenses</div>
        <div className={`hk-card ${styles.expensesCard}`}>
          {group.expenses.length === 0 ? (
            <div className={styles.emptyRow}>
              <Receipt size={28} />
              <p>No expenses yet</p>
            </div>
          ) : (
            group.expenses
              .slice()
              .reverse()
              .map((expense) => (
                <div key={expense.id} className={styles.expenseRow}>
                  <div className={styles.expenseInfo}>
                    <p className={styles.expenseDesc}>{expense.description}</p>
                    <p className={styles.expenseMeta}>
                      Paid by {getMemberName(expense.paidBy)} · {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.expenseRight}>
                    <span className={`hk-money ${styles.expenseAmount}`}>₹{expense.amount.toFixed(2)}</span>
                    <button className={styles.iconBtn} onClick={() => onEditExpense(expense)} aria-label="Edit expense">
                      <Edit2 size={15} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setExpenseToDelete(expense)} aria-label="Delete expense">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <CustomAlert
        isOpen={!!expenseToDelete}
        onClose={closeDeleteModal}
        onSubmit={confirmDelete}
        description={`Are you sure you want to delete "${expenseToDelete?.description}"? This action cannot be undone.`}
        isLoading={false}
      />

      <ModalComponent isOpen={addMemberModalOpen} setIsOpen={setAddMemberModalOpen}>
        <div className={styles.addMemberModal}>
          <div className={styles.addMemberModalTitle}>Add Member</div>
          <form onSubmit={handleAddMember} className={styles.addMemberForm}>
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className={styles.addMemberInput}
              placeholder="Member name"
              autoFocus
            />
            <button type="submit" className={styles.addMemberSubmit} aria-label="Add">
              <Plus size={18} />
            </button>
          </form>

          <div className={styles.existingMembersLabel}>Current Members</div>
          <div className={styles.existingMembersList}>
            {group.members.map((member, index) => (
              <div key={member.id} className={styles.existingMemberRow}>
                <div className="hk-avatar" style={{ width: 28, height: 28, fontSize: "0.7rem", background: `var(--hk-avatar-${(index % 5) + 1})` }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.existingMemberName}>{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
