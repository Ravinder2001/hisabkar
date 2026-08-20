import React, { forwardRef, useState } from "react";
import styles from "./style.module.css";
import { ChevronDown, CopyPlus, Edit, MessageSquare, MoreVertical, Trash2, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ExpenseType, MemberType } from "../../utils/comman/CommanTypes";
import { getGroupTypeIcon } from "../../utils/comman/groupTypeIcon";

type PropsType = ExpenseType & {
  allMembersList: MemberType;
  currentUserId: string;
  index: number;
  totalItemsCount: number;
  setAddExpModal: () => void;
  setDeleteModal: () => void;
  onCloneClick: () => void;
  onShareClick: () => void;
  isSettled: boolean;
  openMenuId: number | null;
  onMenuOpenChange: (id: number | null) => void;
};

const SPLIT_LABEL: Record<string, string> = {
  EQUAL: "split equally",
  PERCENTAGE: "split by percentage",
  CUSTOM: "custom split",
};

const formatMoney = (amount: number) => `₹${Math.round(Math.abs(amount)).toLocaleString("en-IN")}`;

const ExpenseCard = React.memo(
  forwardRef<HTMLDivElement, PropsType>((expense, ref) => {
    const [showSplit, setShowSplit] = useState(false);
    const paidByUser = expense.allMembersList.find((member) => member.id === expense.paid_by);
    const yourShare = expense.members.find((m) => String(m.id) === String(expense.currentUserId))?.amount ?? 0;
    const CategoryIcon = getGroupTypeIcon(expense.expense_type);

    return (
      <div ref={ref}>
        <div className={styles.row}>
          <div className={styles.icon}>
            <CategoryIcon size={18} strokeWidth={1.8} />
          </div>

          <div className={styles.body}>
            <div className={styles.title}>{expense.expense_name}</div>
            <div className={styles.meta}>
              {expense.is_own_expense ? "You" : (paidByUser?.name?.split(" ")[0] ?? "someone")} · {SPLIT_LABEL[expense.split_type] ?? "split"}
            </div>
          </div>

          <div className={styles.right}>
            <div className={`hk-money ${styles.amt}`}>{formatMoney(expense.amount)}</div>
            <div className={`hk-money ${styles.share}`}>{formatMoney(yourShare)}</div>
          </div>

          {!expense.isSettled && (
            <DropdownMenu
              open={expense.openMenuId === expense.expense_id}
              onOpenChange={(open) => expense.onMenuOpenChange(open ? expense.expense_id : null)}
            >
              <DropdownMenuTrigger asChild>
                <button type="button" className={styles.menuBtn}>
                  <span className="sr-only">Open menu</span>
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                collisionPadding={{ top: 8, bottom: 90 }}
                style={{ background: "var(--hk-surface)", color: "var(--hk-ink)", border: "1px solid var(--hk-border)", zIndex: 1000 }}
              >
                <DropdownMenuItem onClick={expense.onShareClick} className={`cursor-pointer ${styles.menuItem}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share in Chat
                </DropdownMenuItem>
                {expense.is_own_expense && (
                  <DropdownMenuItem onClick={expense.setAddExpModal} className={`cursor-pointer ${styles.menuItem}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {expense.is_own_expense && (
                  <DropdownMenuItem onClick={expense.onCloneClick} className={`cursor-pointer ${styles.menuItem}`}>
                    <CopyPlus className="mr-2 h-4 w-4" />
                    Clone
                  </DropdownMenuItem>
                )}
                {expense.is_own_expense && (
                  <DropdownMenuItem
                    onClick={expense.setDeleteModal}
                    className={`cursor-pointer ${styles.menuItem} ${styles.menuItemDanger}`}
                    style={{ color: "var(--hk-negative)" }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className={styles.splitWrap}>
          <button className={styles.splitToggle} onClick={() => setShowSplit((v) => !v)}>
            <Users size={13} />
            Split between {expense.members_count} {Number(expense.members_count) > 1 ? "people" : "person"}
            <ChevronDown size={13} style={{ transform: showSplit ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>
          <div className={`${styles.splitCollapse} ${showSplit ? styles.splitCollapseOpen : ""}`}>
            <div className={styles.splitCollapseInner}>
              <div className={styles.splitCard}>
                {expense.members.map((exMember, memberIndex) => {
                  const expenseMember = expense.allMembersList.find((m) => m.id === exMember.id);
                  const isYou = String(exMember.id) === String(expense.currentUserId);
                  return (
                    <div key={exMember.id} className={`${styles.splitRow} ${isYou ? styles.splitRowMe : ""}`}>
                      <div className={styles.splitMember}>
                        <div
                          className="hk-avatar"
                          style={{ width: 22, height: 22, fontSize: "0.62rem", background: `var(--hk-avatar-${(memberIndex % 5) + 1})` }}
                        >
                          {expenseMember?.avatar ? (
                            <img
                              src={expenseMember.avatar}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                            />
                          ) : (
                            expenseMember?.name?.[0]?.toUpperCase()
                          )}
                        </div>
                        <span className={styles.splitName}>{isYou ? "You" : expenseMember?.name}</span>
                      </div>
                      <span className="hk-money">{formatMoney(exMember.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

ExpenseCard.displayName = "ExpenseCard";
export default ExpenseCard;
