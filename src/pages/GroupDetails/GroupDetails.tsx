import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import styles from "./style.module.css";
import { Button } from "../../components/ui/button";
import AddExpenseModal from "../../components/AddExpense/AddExpense";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useLocation } from "react-router-dom";
import GroupDetailsContent from "../../components/GroupDetailsContent/GroupDetailsContent";
import { Logs, Plus } from "lucide-react";
import { ExpenseType, GroupDataType, GroupPairsData } from "../../utils/comman/CommanTypes";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import GroupPairs from "../../components/GroupPairs/GroupPairs";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import Messages from "../../utils/constant/Messages";
import showToast from "../../utils/helpers/toastHelper";
import GroupLogs from "../../components/GroupLogs/GroupLogs";

export default function GroupDetails() {
  const location = useLocation();
  const GroupId = location.pathname.split("/")[2];

  const {
    fetchData: fetchGroupDetails,
    response: groupRes,
    isLoading: groupDetailsLoading,
  } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_DETAILS + "/" + GroupId);
  const {
    fetchData: fetchAllExpenses,
    response: expenseRes,
    isLoading: expenseListLoading,
  } = useApiFetch(CONSTANTS.API_ROUTES.ALL_EXPENSES + "/" + GroupId);
  const { fetchData: fetchMyPairs, response: pairsRes, isLoading: pairsLoading } = useApiFetch(CONSTANTS.API_ROUTES.MY_PAIRS + GroupId);
  const { fetchData: deleteExpense, response: deleteExpRes, isLoading: deleteExpLoading } = useApiFetch("");

  const [groupData, setGroupData] = useState<GroupDataType | null>(null);
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);
  const [pairsData, setPairsData] = useState<GroupPairsData>({
    send: [],
    receive: [],
  });
  const [isAddExpModal, setAddExpModal] = useState<boolean>(false);
  const [isDeleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ExpenseType | null>(null);
  const [logModal, setLogModal] = useState<boolean>(false);

  const handleExpModal = () => {
    if (isAddExpModal && selectedRow) {
      setSelectedRow(null);
    }
    setAddExpModal(!isAddExpModal);
  };

  const handleDeleteModal = () => {
    if (isDeleteModal && selectedRow) {
      setSelectedRow(null);
    }
    setDeleteModal(!isDeleteModal);
  };

  const handleDelete = async () => {
    await deleteExpense(CONSTANTS.API_ROUTES.DELETE_EXPENSE + `/${GroupId}/${selectedRow?.expense_id}`, {
      method: "DELETE",
    });
  };

  const handleLogModal = () => {
    setLogModal(!logModal);
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchAllExpenses();
    fetchMyPairs();
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

  useEffect(() => {
    if (pairsRes?.success == 1) {
      setPairsData(pairsRes?.data);
    }
  }, [pairsRes]);

  useEffect(() => {
    if (deleteExpRes) {
      if (deleteExpRes.success == 1) {
        fetchGroupDetails();
        fetchMyPairs();
        setExpenseList((prevExpenses) => prevExpenses.filter((expense) => expense.expense_id !== selectedRow?.expense_id));
        showToast("Expense deleted Succesfully", "success");
      }
      handleDeleteModal();
    }
  }, [deleteExpRes]);

  return (
    <div className={styles.container}>
      <div className={styles.detailsCon}>
        <Card className="bg-white p-0 h-full">
          <CardHeader className={styles.cardHeader}>
            <CardTitle className="lg:block hidden">Group Details</CardTitle>
            <Accordion type="single" collapsible className={`w-full lg:hidden ${styles.accordion}`}>
              <AccordionItem value="group-details">
                <AccordionTrigger className="text-sm font-semibold px-4">Group Details</AccordionTrigger>
                <AccordionContent>
                  {groupDetailsLoading ? (
                    <CircularLoader />
                  ) : groupData ? (
                    <GroupDetailsContent {...groupData} GroupId={GroupId} setGroupData={setGroupData} />
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardHeader>
          {groupDetailsLoading ? (
            <CircularLoader />
          ) : (
            <CardContent className="hidden lg:block">
              {groupData ? <GroupDetailsContent {...groupData} GroupId={GroupId} setGroupData={setGroupData} /> : null}
            </CardContent>
          )}
        </Card>
      </div>
      <div className={styles.pairsCon}>
        <Card className="bg-white p-0 h-full">
          <CardHeader className={styles.cardHeader}>
            <CardTitle className="lg:block hidden">Your Expense Summary</CardTitle>
            <Accordion type="single" collapsible className={`w-full lg:hidden ${styles.accordion}`}>
              <AccordionItem value="group-pairs">
                <AccordionTrigger className="text-sm font-semibold px-4">Your Expense Summary</AccordionTrigger>
                <AccordionContent>
                  {pairsLoading ? <CircularLoader /> : groupData ? <GroupPairs isSettled={groupData.is_settled} pairsData={pairsData} /> : null}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardHeader>
          {pairsLoading ? (
            <CircularLoader />
          ) : (
            <CardContent className="hidden lg:block">
              {groupData ? <GroupPairs isSettled={groupData.is_settled} pairsData={pairsData} /> : null}
            </CardContent>
          )}
        </Card>
      </div>

      <div className={styles.expCon}>
        <Card className="bg-white h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <Logs onClick={handleLogModal} size={18} />
            </div>
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
                  setDeleteModal={() => {
                    handleDeleteModal();
                    setSelectedRow(expense);
                  }}
                />
              ))}
              {/* </ScrollArea> */}
            </CardContent>
          )}
        </Card>
      </div>
      {!groupData?.is_settled ? (
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-black text-white" onClick={handleExpModal}>
          <Plus className="w-6 h-6" />
        </Button>
      ) : null}

      {isAddExpModal ? (
        <AddExpenseModal
          isOpen={isAddExpModal}
          setIsOpen={handleExpModal}
          groupId={GroupId}
          memberList={groupData?.members ?? []}
          setExpenseList={setExpenseList}
          selectedRow={selectedRow}
          callback={() => {
            fetchMyPairs();
            fetchGroupDetails();
          }}
        />
      ) : null}
      <CustomAlert
        isOpen={isDeleteModal}
        onClose={handleDeleteModal}
        onSubmit={handleDelete}
        description={Messages.EXPENSE.DELETE_ALERT(selectedRow?.expense_name ?? "")}
        isLoading={deleteExpLoading}
      />
      {logModal ? <GroupLogs groupId={GroupId} isOpen={logModal} setIsOpen={handleLogModal} /> : null}
    </div>
  );
}
