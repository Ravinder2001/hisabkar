 
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import styles from "./style.module.css";
import { Button } from "../../components/ui/button";
import AddExpenseModal from "../../components/AddExpense/AddExpense";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useLocation } from "react-router-dom";
import GroupDetailsContent from "../../components/GroupDetailsContent/GroupDetailsContent";
import { Plus } from "lucide-react";
import { ExpenseType, GroupDataType } from "../../utils/comman/CommanTypes";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";

export default function GroupDetails() {
  const location = useLocation();
  const GroupId = location.pathname.split("/")[2];

  const { fetchData: fetchGroupDetails, response: groupRes } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_DETAILS + GroupId);
  const { fetchData: fetchAllExpenses, response: expenseRes } = useApiFetch(CONSTANTS.API_ROUTES.ALL_EXPENSES + GroupId);

  const [groupData, setGroupData] = useState<GroupDataType | null>();
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);

  const [isAddExpModal, setAddExpModal] = useState<boolean>(false);

  const handleExpModal = () => {
    setAddExpModal(!isAddExpModal);
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchAllExpenses();
  }, [GroupId]);

  useEffect(() => {
    if (groupRes?.success == 1) {
      setGroupData(groupRes.data);
    }
  }, [groupRes]);

  useEffect(() => {
    if (expenseRes?.success == 1) {
      setExpenseList(expenseRes.data);
    }
  }, [expenseRes]);

  return !groupData ? (
    <div>...Loading</div>
  ) : (
    <div className="container space-y-6">
      <div className="grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 pb-4">
          <Card className="bg-white p-0">
            <CardHeader className={styles.cardHeader}>
              <CardTitle className="lg:block hidden">Group Details</CardTitle>
              <Accordion type="single" collapsible className="w-full lg:hidden">
                <AccordionItem value="group-details">
                  <AccordionTrigger className="text-xl font-semibold">Group Details</AccordionTrigger>
                  <AccordionContent>
                    <GroupDetailsContent {...groupData} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardHeader>
            <CardContent className="hidden lg:block">
              <GroupDetailsContent {...groupData} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expenses Timeline</CardTitle>
              <Badge variant="outline" className="bg-black text-white">
                Unsettled
              </Badge>
            </CardHeader>
            <CardContent>
              {/* <ScrollArea className="h-[400px] lg:h-[400px]"> */}
              {expenseList.map((expense, index) => (
                <ExpenseCard
                  key={expense.expense_id}
                  {...expense}
                  allMembersList={groupData.members}
                  index={index}
                  totalItemsCount={expenseList.length}
                />
              ))}
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        </div>
      </div>
      <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-black text-white" onClick={handleExpModal}>
        <Plus className="w-6 h-6" />
      </Button>
      <AddExpenseModal isOpen={isAddExpModal} setIsOpen={setAddExpModal} />
    </div>
  );
}
