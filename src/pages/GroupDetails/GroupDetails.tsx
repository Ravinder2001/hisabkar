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
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import GroupPairs from "../../components/GroupPairs/GroupPairs";

export default function GroupDetails() {
  const location = useLocation();
  const GroupId = location.pathname.split("/")[2];

  const {
    fetchData: fetchGroupDetails,
    response: groupRes,
    isLoading: groupDetailsLoading,
  } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_DETAILS + GroupId);
  const {
    fetchData: fetchAllExpenses,
    response: expenseRes,
    isLoading: expenseListLoading,
  } = useApiFetch(CONSTANTS.API_ROUTES.ALL_EXPENSES + GroupId);

  const [groupData, setGroupData] = useState<GroupDataType | null>();
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);
  const [isAddExpModal, setAddExpModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ExpenseType | null>(null);

  const handleExpModal = () => {
    if (isAddExpModal && selectedRow) {
      setSelectedRow(null);
    }
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

  return (
    <div className={styles.container}>
      <div className={styles.detailsCon}>
        <Card className="bg-white p-0 h-full">
          <CardHeader className={styles.cardHeader}>
            <CardTitle className="lg:block hidden">Group Details</CardTitle>
            <Accordion type="single" collapsible className="w-full lg:hidden">
              <AccordionItem value="group-details">
                <AccordionTrigger className="text-xl font-semibold">Group Details</AccordionTrigger>
                <AccordionContent>{groupData ? <GroupDetailsContent {...groupData} /> : null}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardHeader>
          {groupDetailsLoading ? (
            <CircularLoader />
          ) : (
            <CardContent className="hidden lg:block">{groupData ? <GroupDetailsContent {...groupData} /> : null}</CardContent>
          )}
        </Card>
      </div>
      <div className={styles.pairsCon}>
        <Card className="bg-white p-0 h-full">
          <CardHeader className={styles.cardHeader}>
            <CardTitle className="lg:block hidden">Your Expense Summary</CardTitle>
            <Accordion type="single" collapsible className="w-full lg:hidden">
              <AccordionItem value="group-pairs">
                <AccordionTrigger className="text-xl font-semibold">Your Expense Summary</AccordionTrigger>
                <AccordionContent>{groupData ? <GroupPairs /> : null}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardHeader>
          {groupDetailsLoading ? <CircularLoader /> : <CardContent className="hidden lg:block">{groupData ? <GroupPairs /> : null}</CardContent>}
        </Card>
      </div>

      <div className={styles.expCon}>
        <Card className="bg-white h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses Timeline</CardTitle>
            <Badge variant="outline" className="bg-black text-white">
              Unsettled
            </Badge>
          </CardHeader>
          {expenseListLoading ? (
            <CircularLoader />
          ) : (
            <CardContent className={styles.expBox}>
              {/* <ScrollArea className="h-[400px] lg:h-[400px]"> */}
              {expenseList.map((expense, index) => (
                <ExpenseCard
                  key={expense.expense_id}
                  {...expense}
                  allMembersList={groupData?.members ?? []}
                  index={index}
                  totalItemsCount={expenseList.length}
                  setAddExpModal={() => {
                    handleExpModal();
                    setSelectedRow(expense);
                  }}
                />
              ))}
              {/* </ScrollArea> */}
            </CardContent>
          )}
        </Card>
      </div>
      <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-black text-white" onClick={handleExpModal}>
        <Plus className="w-6 h-6" />
      </Button>
      {isAddExpModal ? (
        <AddExpenseModal
          isOpen={isAddExpModal}
          setIsOpen={handleExpModal}
          groupId={GroupId}
          memberList={groupData?.members ?? []}
          setExpenseList={setExpenseList}
          selectedRow={selectedRow}
        />
      ) : null}
    </div>
  );
}
