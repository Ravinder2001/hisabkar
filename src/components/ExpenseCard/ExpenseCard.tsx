import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import styles from "./style.module.css";
import { Receipt } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ExpenseType, MemberType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type PropsType = ExpenseType & {
  allMembersList: MemberType;
  index: number;
  totalItemsCount: number;
};

function ExpenseCard(expense: PropsType) {
  const expenseTypeList = useSelector((state: RootState) => state.data.expenseTypeList);

  const expenseType = expenseTypeList.find((type) => type.id === expense.expense_type_id);
  const paidByUser = expense.allMembersList.find((member) => member.id === expense.paid_by);
  return (
    <div className={styles.expenseCon}>
      <div className="relative">
        <div className="flex items-start gap-2">
          <div className="relative h-[100%]">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-green-600" />
            </div>
            {expense.index !== expense.totalItemsCount - 1 && (
              <div className="absolute top-8 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" style={{ height: "calc(100% + 1rem)" }} />
            )}
          </div>
          <div className="flex-1 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{expense.expense_name}</h4>
                  <h4 className="font-semibold text-lg">{expenseType?.name}</h4>
                  <p className="text-sm text-gray-600">{expense.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{expense.amount}</p>
                  <p className="text-xs text-gray-500">{new Date(expense.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={paidByUser?.avatar} />
                  <AvatarFallback>{paidByUser?.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  Paid by <span className="font-medium">{paidByUser?.name}</span>
                </span>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="split-details">
                  <AccordionTrigger className="text-sm font-medium text-gray-700">Split between ({expense.members_count} People)</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {expense.members.map((exMember) => {
                      const expenseMember = expense.allMembersList.find((member) => member.id === exMember.id);
                      return (
                        <div key={expenseMember?.id} className="flex items-center justify-between bg-white/50 p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={expenseMember?.avatar} />
                              <AvatarFallback>{expenseMember?.name[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{expenseMember?.name}</span>
                          </div>
                          <span className="text-sm text-green-600 font-medium">₹{exMember.amount}</span>
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
