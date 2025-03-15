import React, { forwardRef } from "react";
import styles from "./style.module.css";
import { Edit, MoreVertical, Receipt, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ExpenseType, MemberType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { formatDateTime } from "../../utils/helpers/commanHelper";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import CustomCountUp from "../CustomCountUp/CustomCountUp";
import CustomAccordion from "../CustomAccordian/CustomAccordian";

type PropsType = ExpenseType & {
  allMembersList: MemberType;
  index: number;
  totalItemsCount: number;
  setAddExpModal: () => void;
  setDeleteModal: () => void;
  isSettled: boolean;
};

const ExpenseCard = forwardRef<HTMLDivElement, PropsType>((expense, ref) => {
  const expenseTypeList = useSelector((state: RootState) => state.data.expenseTypeList);

  const expenseType = expenseTypeList.find((type) => type.id === expense.expense_type_id);
  const paidByUser = expense.allMembersList.find((member) => member.id === expense.paid_by);

  // Format description into bullet points
  const descriptionPoints = expense.description
    ? expense.description
        .split(".")
        .map((point) => point.trim())
        .filter((point) => point.length > 0)
    : [];

  return (
    <div className={`${styles.expenseCon} w-full`} ref={ref}>
      <div className="relative w-full">
        <div className="flex flex-wrap items-start gap-x-2 sm:gap-x-4">
          {/* Left Icon */}
          <div className="relative h-full">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-green-600" />
            </div>
            {expense.index !== expense.totalItemsCount - 1 && (
              <div className="absolute top-8 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" style={{ height: "calc(100% + 1rem)" }} />
            )}
          </div>

          {/* Expense Card */}
          <div className="flex-1 mb-8 w-full relative">
            <div className={styles.paidByBox}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={paidByUser?.avatar} />
                <AvatarFallback>{paidByUser?.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm">Paid By {paidByUser?.name.split(" ")[0]}</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4" id={expense.is_own_expense ? styles.expOwnCard : styles.expCard}>
              <div className="flex flex-row items-start justify-between space-y-0 p-0">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <img src={expenseType?.icon ?? ""} alt={expenseType?.name} className="w-4 h-4" />
                    <div className="text-sm">{expenseType?.name}</div>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">{expense.expense_name}</h2>
                </div>
                {expense.is_own_expense ? (
                  <DropdownMenu>
                    {expense.isSettled ? null : (
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    )}

                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={expense.setAddExpModal} className="text-black-600 dark:text-red-400 bg-white cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit this Expense</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={expense.setDeleteModal} className="text-red-600 dark:text-red-400 bg-white  cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete this Expense</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>

              <div className={styles.middleCon}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 text-muted-foreground">{formatDateTime(expense.created_at, true)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" id={styles.amount}>
                        ₹<CustomCountUp count={Number(expense.amount)} />
                      </p>
                    </div>
                  </div>
                </div>

                {descriptionPoints.length ? (
                  <>
                    <div className={styles.line}></div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Description</h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {descriptionPoints.map((point, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Split Between */}
              <CustomAccordion header={`Split between (${expense.members_count} People)`} expanded={false}>
                {expense.members.map((exMember) => {
                  const expenseMember = expense.allMembersList.find((member) => member.id === exMember.id);
                  return (
                    <div key={expenseMember?.id} className="flex flex-wrap items-center justify-between bg-white/50 rounded-md my-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={expenseMember?.avatar} />
                          <AvatarFallback>{expenseMember?.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs sm:text-sm font-medium truncate">{expenseMember?.name}</span>
                      </div>
                      <span className="text-md sm:text-sm text-black-600 font-medium">₹{exMember.amount}</span>
                    </div>
                  );
                })}
              </CustomAccordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ✅ Set display name for debugging
ExpenseCard.displayName = "ExpenseCard";
export default ExpenseCard;
