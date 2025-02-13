import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
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

type PropsType = ExpenseType & {
  allMembersList: MemberType;
  index: number;
  totalItemsCount: number;
  setAddExpModal: () => void;
  setDeleteModal: () => void;
};

function ExpenseCard(expense: PropsType) {
  const expenseTypeList = useSelector((state: RootState) => state.data.expenseTypeList);

  const expenseType = expenseTypeList.find((type) => type.id === expense.expense_type_id);
  const paidByUser = expense.allMembersList.find((member) => member.id === expense.paid_by);

  return (
    <div className={`${styles.expenseCon} w-full`}>
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
          <div className="flex-1 mb-8 w-full">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4">
              {/* Expense Info */}
              <div className="flex flex-wrap items-start justify-between">
                <div className="min-w-0">
                  <h4 className="font-semibold text-base sm:text-lg truncate">{expense.expense_name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{expense.description}</p>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <img src={expenseType?.icon ?? ""} alt={expenseType?.name} className="w-4 h-4" />
                    <div className="text-sm">{expenseType?.name}</div>
                  </div>
                </div>
                <div className="text-right min-w-[80px] sm:min-w-[100px]">
                  <p className="font-semibold text-green-600 text-sm sm:text-base">
                    ₹<CustomCountUp count={Number(expense.amount)} />
                  </p>
                  <p className="text-xs text-gray-500">{formatDateTime(expense.created_at)}</p>
                </div>
              </div>

              {/* Paid By */}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={paidByUser?.avatar} />
                  <AvatarFallback>{paidByUser?.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex justify-between w-full">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Paid by <span className="font-medium">{paidByUser?.name}</span>
                  </span>
                  {expense.is_own_expense ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
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
              </div>

              {/* Split Between */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="split-details">
                  <AccordionTrigger className="text-sm sm:text-base font-medium text-gray-700">
                    Split between ({expense.members_count} People)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {expense.members.map((exMember) => {
                      const expenseMember = expense.allMembersList.find((member) => member.id === exMember.id);
                      return (
                        <div key={expenseMember?.id} className="flex flex-wrap items-center justify-between bg-white/50 p-2 rounded-md">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={expenseMember?.avatar} />
                              <AvatarFallback>{expenseMember?.name[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs sm:text-sm font-medium truncate">{expenseMember?.name}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-green-600 font-medium">₹{exMember.amount}</span>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCard;
