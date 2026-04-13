import React, { forwardRef } from "react";
import styles from "./style.module.css";
import { CopyPlus, Edit, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ExpenseType, MemberType } from "../../utils/comman/CommanTypes";
import { formatDateTime } from "../../utils/helpers/commanHelper";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import CustomAccordion from "../CustomAccordian/CustomAccordian";

type PropsType = ExpenseType & {
  allMembersList: MemberType;
  index: number;
  totalItemsCount: number;
  setAddExpModal: () => void;
  setDeleteModal: () => void;
  onCloneClick: () => void;
  onShareClick: () => void;
  isSettled: boolean;
};

const ExpenseCard = React.memo(
  forwardRef<HTMLDivElement, PropsType>((expense, ref) => {
    const paidByUser = expense.allMembersList.find((member) => member.id === expense.paid_by);

    const descriptionPoints = expense.description
      ? expense.description
          .split(".")
          .map((point) => point.trim())
          .filter((point) => point.length > 0)
      : [];

    const isOwn = expense.is_own_expense;
    const isLast = expense.index === expense.totalItemsCount - 1;

    return (
      <div className={`${styles.expenseCon} w-full`} ref={ref}>
        {/* Full-width card */}
        <div className={styles.card}>
          {/* ── Coloured header with SVG dot-grid pattern ── */}
          <div className={`${styles.cardHeader} ${isOwn ? styles.headerOwn : styles.headerOther}`}>
            {/* Amount hero */}
            <div className={styles.headerAmount}>
              <span className={styles.currencySymbol}>₹</span>
              <span className={styles.amountValue}>
                {/* <CustomCountUp count={Number(expense.amount)} /> */}
                {expense.amount}
              </span>
            </div>

            {/* Payer chip + menu */}
            <div className={styles.headerRight}>
              <div className={styles.payerChip}>
                <Avatar className={styles.payerAvatar}>
                  <AvatarImage src={paidByUser?.avatar} />
                  <AvatarFallback>{paidByUser?.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className={styles.payerName}>{paidByUser?.name?.split(" ")[0]}</span>
              </div>

              {!expense.isSettled && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={styles.menuBtn}>
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={expense.onShareClick} className="cursor-pointer">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Share in Chat
                    </DropdownMenuItem>
                    {expense.is_own_expense && (
                      <DropdownMenuItem onClick={expense.setAddExpModal} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {expense.is_own_expense && (
                      <DropdownMenuItem onClick={expense.onCloneClick} className="cursor-pointer">
                        <CopyPlus className="mr-2 h-4 w-4" />
                        Clone
                      </DropdownMenuItem>
                    )}
                    {expense.is_own_expense && (
                      <DropdownMenuItem onClick={expense.setDeleteModal} className="text-red-600 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* ── White body with mountain SVG bg ── */}
          <div className={styles.cardBody}>
            <div className="flex items-center gap-2 mb-2">
              <span
                style={{ fontSize: "10px" }}
                className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[8px] font-bold uppercase tracking-wider border border-slate-200"
              >
                {(() => {
                  switch (expense.expense_type) {
                    case "Food":
                      return "🍴 Food";
                    case "Grocery":
                      return "🛒 Grocery";
                    case "Shopping":
                      return "🛍️ Shopping";
                    case "Bills":
                      return "📄 Bills";
                    case "Cab":
                      return "🚕 Cab";
                    case "Entertainment":
                      return "🎬 Entertainment";
                    case "Health":
                      return "🏥 Health";
                    default:
                      return "✨ Others";
                  }
                })()}
              </span>
            </div>
            <h2 className={styles.expenseName}>{expense.expense_name}</h2>
            <p className={styles.dateText}>{formatDateTime(expense.created_at, true)}</p>

            {descriptionPoints.length > 0 && (
              <div className={styles.descSection}>
                <div className={styles.divider} />
                <ul className={styles.descList}>
                  {descriptionPoints.map((point, i) => (
                    <li key={i} className={styles.descItem}>
                      <span className={styles.descDot} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.accordionWrap}>
              <CustomAccordion
                header={`Split between ${expense.members_count} ${Number(expense.members_count) > 1 ? "people" : "person"}`}
                expanded={false}
              >
                {expense.members.map((exMember) => {
                  const expenseMember = expense.allMembersList.find((m) => m.id === exMember.id);
                  return (
                    <div key={exMember.id} className={styles.splitRow}>
                      <div className={styles.splitMember}>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={expenseMember?.avatar} />
                          <AvatarFallback>{expenseMember?.name?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className={styles.splitName}>{expenseMember?.name}</span>
                      </div>
                      <span className={styles.splitAmount}>₹{exMember.amount}</span>
                    </div>
                  );
                })}
              </CustomAccordion>
            </div>
          </div>
        </div>

        {/* ── Branch connector line between cards ── */}
        {!isLast && (
          <div className={`${styles.branchConnector} ${isOwn ? styles.branchOwn : styles.branchOther}`}>
            <div className={styles.branchLine} />
          </div>
        )}
      </div>
    );
  })
);

ExpenseCard.displayName = "ExpenseCard";
export default ExpenseCard;
