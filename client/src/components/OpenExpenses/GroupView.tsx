import React, { useState } from "react";
import { Users, Receipt, Calculator, Plus, Edit2, Trash2, UserPlus, Send, HandCoins, ChevronDown } from "lucide-react";
import type { Group, Expense } from "../../pages/OpenExpenses/OpenExpenses";
import CustomAlert from "../CustomAlert/CustomAlert";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./GroupView.module.css";

interface GroupViewProps {
  group: Group;
  onAddExpense: () => void;
  onAddAdvance: () => void;
  onEditTransaction: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onSettleUp: () => void;
  onAddMember: (name: string) => void;
  getMemberName: (memberId: string) => string;
}

export default function GroupView({
  group,
  onAddExpense,
  onAddAdvance,
  onEditTransaction,
  onDeleteExpense,
  onSettleUp,
  onAddMember,
  getMemberName,
}: GroupViewProps) {
  const [isMembersExpanded, setIsMembersExpanded] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "expense" | "advance">("all");
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const expensesOnly = group.expenses.filter((exp) => exp.type !== "advance");
  const advancesOnly = group.expenses.filter((exp) => exp.type === "advance");

  const totalExpenses = expensesOnly.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAdvances = advancesOnly.reduce((sum, exp) => sum + exp.amount, 0);

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

  // Net balance for each member
  const getMemberNetBalance = (memberId: string) => {
    let net = 0;
    group.expenses.forEach((expense) => {
      if (expense.paidBy === memberId) {
        net += expense.amount;
      }
      expense.shares.forEach((share) => {
        if (share.memberId === memberId) {
          net -= share.amount;
        }
      });
    });
    return net;
  };

  const filteredExpenses = group.expenses.filter((item) => {
    if (filterType === "expense") return item.type !== "advance";
    if (filterType === "advance") return item.type === "advance";
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <div className={`hk-card ${styles.statCard}`}>
          <div className={`${styles.statIcon} ${styles.statIconMembers}`}>
            <Users size={12} />
          </div>
          <div className={styles.statText}>
            <p className={styles.statLabel}>Members</p>
            <p className={styles.statValue}>{group.members.length}</p>
          </div>
        </div>
        <div className={`hk-card ${styles.statCard}`}>
          <div className={`${styles.statIcon} ${styles.statIconExpenses}`}>
            <Receipt size={12} />
          </div>
          <div className={styles.statText}>
            <p className={styles.statLabel}>Expenses ({expensesOnly.length})</p>
            <p className={`hk-money ${styles.statValue}`}>₹{totalExpenses.toFixed(2)}</p>
          </div>
        </div>
        <div className={`hk-card ${styles.statCard}`}>
          <div className={`${styles.statIcon} ${styles.statIconAdvances}`}>
            <HandCoins size={12} />
          </div>
          <div className={styles.statText}>
            <p className={styles.statLabel}>Advances ({advancesOnly.length})</p>
            <p className={`hk-money ${styles.statValue}`}>₹{totalAdvances.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button className={styles.addMemberBtn} onClick={() => setAddMemberModalOpen(true)} aria-label="Add member" title="Add member">
          <UserPlus size={18} />
        </button>
        <button className={`hk-btn-primary ${styles.pillBtn}`} onClick={onAddExpense}>
          <Plus size={16} />
          Expense
        </button>
        <button className={`${styles.advanceBtn} ${styles.pillBtn}`} onClick={onAddAdvance}>
          <Send size={15} />
          Advance
        </button>
        <button className={`${styles.settleBtn} ${styles.pillBtn}`} onClick={onSettleUp}>
          <Calculator size={15} />
          Settle
        </button>
      </div>

      <div className={styles.section}>
        <button
          type="button"
          className={styles.membersToggleHeader}
          onClick={() => setIsMembersExpanded((prev) => !prev)}
          aria-expanded={isMembersExpanded}
          aria-label="Toggle members and balances list"
        >
          <div className={styles.membersToggleLeft}>
            <span className="hk-section-label" style={{ marginBottom: 0 }}>
              Members & Balances ({group.members.length})
            </span>
          </div>
          <div className={styles.membersToggleRight}>
            <span className={styles.toggleHintText}>{isMembersExpanded ? "Hide" : "Show"}</span>
            <ChevronDown size={15} className={`${styles.chevronIcon} ${isMembersExpanded ? styles.chevronOpen : ""}`} />
          </div>
        </button>

        <div className={`${styles.membersCollapsibleWrapper} ${isMembersExpanded ? styles.membersCollapsibleOpen : ""}`}>
          <div className={styles.membersCollapsibleInner}>
            <div className={`hk-card ${styles.membersCard}`}>
              <div className={styles.membersGrid}>
                {group.members.map((member, index) => {
                  const netBalance = getMemberNetBalance(member.id);
                  const isPositive = netBalance > 0.01;
                  const isNegative = netBalance < -0.01;

                  return (
                    <div key={member.id} className={styles.memberTile}>
                      <div
                        className="hk-avatar"
                        style={{
                          width: 40,
                          height: 40,
                          fontSize: "0.9rem",
                          background: `var(--hk-avatar-${(index % 5) + 1})`,
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <p className={styles.memberName}>{member.name}</p>
                      <p
                        className={`${styles.memberNetStatus} ${
                          isPositive ? styles.memberNetPositive : isNegative ? styles.memberNetNegative : styles.memberNetZero
                        }`}
                      >
                        {isPositive && `+₹${netBalance.toFixed(2)}`}
                        {isNegative && `-₹${Math.abs(netBalance).toFixed(2)}`}
                        {!isPositive && !isNegative && "Settled"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <div className="hk-section-label">Recent Activity</div>
          <div className={styles.filterTabs}>
            <button className={`${styles.tabBtn} ${filterType === "all" ? styles.tabBtnActive : ""}`} onClick={() => setFilterType("all")}>
              All ({group.expenses.length})
            </button>
            <button className={`${styles.tabBtn} ${filterType === "expense" ? styles.tabBtnActive : ""}`} onClick={() => setFilterType("expense")}>
              Expenses ({expensesOnly.length})
            </button>
            <button className={`${styles.tabBtn} ${filterType === "advance" ? styles.tabBtnActive : ""}`} onClick={() => setFilterType("advance")}>
              Advances ({advancesOnly.length})
            </button>
          </div>
        </div>

        <div className={`hk-card ${styles.expensesCard}`}>
          {filteredExpenses.length === 0 ? (
            <div className={styles.emptyRow}>
              <Receipt size={28} />
              <p>{filterType === "advance" ? "No advances recorded yet" : filterType === "expense" ? "No expenses yet" : "No activity yet"}</p>
            </div>
          ) : (
            filteredExpenses
              .slice()
              .reverse()
              .map((item) => {
                const isAdvance = item.type === "advance";
                const receiverId = item.toMemberId || (item.shares && item.shares.length > 0 ? item.shares[0].memberId : "");

                return (
                  <div key={item.id} className={styles.expenseRow}>
                    <div className={`${styles.expenseIconWrap} ${isAdvance ? styles.expenseIconWrapAdvance : styles.expenseIconWrapExpense}`}>
                      {isAdvance ? <Send size={15} /> : <Receipt size={15} />}
                    </div>

                    <div className={styles.expenseInfo}>
                      <div className={styles.expenseTitleRow}>
                        <p className={styles.expenseDesc}>{item.description}</p>
                        {isAdvance && (
                          <span className={styles.advanceBadge}>
                            <Send size={9} /> Advance
                          </span>
                        )}
                      </div>
                      <p className={styles.expenseMeta}>
                        {isAdvance
                          ? `${getMemberName(item.paidBy)} → ${getMemberName(receiverId)} · ${new Date(item.date).toLocaleDateString()}`
                          : `Paid by ${getMemberName(item.paidBy)} · ${new Date(item.date).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className={styles.expenseRight}>
                      <span className={`hk-money ${styles.expenseAmount}`}>₹{item.amount.toFixed(2)}</span>
                      <button className={styles.iconBtn} onClick={() => onEditTransaction(item)} aria-label="Edit" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.danger}`}
                        onClick={() => setExpenseToDelete(item)}
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
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
                <div
                  className="hk-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    fontSize: "0.7rem",
                    background: `var(--hk-avatar-${(index % 5) + 1})`,
                  }}
                >
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
