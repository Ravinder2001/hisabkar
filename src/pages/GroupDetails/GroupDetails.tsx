/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import styles from "./style.module.css";
import { Button } from "../../components/ui/button";
import AddExpenseModal from "../../components/AddExpense/AddExpense";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useLocation } from "react-router-dom";
import GroupDetailsContent from "../../components/GroupDetailsContent/GroupDetailsContent";
import { Plus, MessageSquare } from "lucide-react";
import { ExpenseType, GroupDataType, GroupPairsData } from "../../utils/comman/CommanTypes";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ENVConfig from "../../config/config";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import GroupPairs from "../../components/GroupPairs/GroupPairs";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import Messages from "../../utils/constant/Messages";
import showToast from "../../utils/helpers/toastHelper";
import GroupLogs from "../../components/GroupLogs/GroupLogs";
import GroupSpendAnalysis from "../../components/GroupSpendAnalysis/GroupSpendAnalysis";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import AddMemberModal from "../../components/AddMemberModal/AddMemberModal";
import CustomAccordion from "../../components/CustomAccordian/CustomAccordian";
import GroupSettingModal from "../../components/GroupSettingModal/GroupSettingModal";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import ChatModule from "../../components/ChatModule/ChatModule";
import ShareExpenseModal from "../../components/ChatModule/ShareExpenseModal";

export default function GroupDetails() {
  const location = useLocation();
  const GroupId = location.pathname.split("/")[2];
  const user = useSelector((state: RootState) => state.user);
  const expenseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const socketRef = useRef<Socket | null>(null);

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
  const { fetchData: fetchUnreadStatus, response: unreadRes } = useApiFetch(CONSTANTS.API_ROUTES.UNREAD_STATUS + "/" + GroupId);

  const [groupData, setGroupData] = useState<GroupDataType | null>(null);
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);
  const [tempExpenseList, setTempExpenseList] = useState<ExpenseType[]>([]);
  const [pairsData, setPairsData] = useState<GroupPairsData>({
    send: [],
    receive: [],
  });
  const [isAddExpModal, setAddExpModal] = useState<boolean>(false);
  const [isDeleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ExpenseType | null>(null);
  const [logModal, setLogModal] = useState<boolean>(false);
  const [spendAnalysisModal, setSpendAnalysisModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>("-1");
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false);
  const [groupSettingModal, setGroupSettingModal] = useState<boolean>(false);
  const [chatModal, setChatModal] = useState<boolean>(false);
  const [isClone, setIsClone] = useState(false);
  const [isShareModal, setShareModal] = useState<boolean>(false);
  const [sharingExpense, setSharingExpense] = useState<ExpenseType | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false);
  const isChatOpenRef = useRef<boolean>(false);

  const groupMemberOptionsList = [
    { value: "-1", label: "All" },
    ...(groupData?.members?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || []),
  ];
  const handleExpModal = () => {
    if (isAddExpModal && selectedRow) {
      setSelectedRow(null);
    }
    setAddExpModal(!isAddExpModal);
  };
  const handleAddMemModal = () => {
    setAddMemberModal(!addMemberModal);
  };

  const handleDeleteModal = () => {
    if (isDeleteModal && selectedRow) {
      setSelectedRow(null);
    }
    setDeleteModal(!isDeleteModal);
  };

  const handleGroupSettingModal = () => {
    setGroupSettingModal(!groupSettingModal);
  };

  const handleDelete = async () => {
    await deleteExpense(CONSTANTS.API_ROUTES.DELETE_EXPENSE + `/${GroupId}/${selectedRow?.expense_id}`, {
      method: "DELETE",
    });
  };

  const handleLogModal = () => {
    setLogModal(!logModal);
  };
  const handleSpendAnalysisModal = () => {
    setSpendAnalysisModal(!spendAnalysisModal);
  };

  const handleChatModal = () => {
    const nextState = !chatModal;
    setChatModal(nextState);
    isChatOpenRef.current = nextState;
    if (nextState) {
      setHasUnreadMessages(false);
    }
  };

  const handleShareInChat = (expense: ExpenseType) => {
    setSharingExpense(expense);
    setShareModal(true);
  };

  const onConfirmShare = (message: string) => {
    if (!sharingExpense) return;

    if (!socketRef.current) {
      socketRef.current = io(ENVConfig.baseURL, { withCredentials: true });
    }

    const payload = {
      groupId: GroupId,
      userId: user.id,
      message: message.trim() || `Check out this expense: ${sharingExpense.expense_name}`,
      expenseId: sharingExpense.expense_id,
    };

    socketRef.current.emit("send_message", payload);
    showToast("Expense shared in chat!", "success");
    setSharingExpense(null);
  };

  useEffect(() => {
    if (unreadRes?.success === 1) {
      setHasUnreadMessages(unreadRes.hasUnread);
    }
  }, [unreadRes]);

  const handleScrollToExpense = (id: any) => {
    const element = expenseRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    fetchAllExpenses();
    fetchMyPairs();

    fetchUnreadStatus();

    const socket = io(ENVConfig.baseURL, { withCredentials: true });
    socketRef.current = socket;
    socket.emit("join_group", GroupId);

    socket.on("receive_message", (message) => {
      // If modal is closed AND not me, show unread indicator
      if (!isChatOpenRef.current && String(message.user_id) !== String(user.id)) {
        setHasUnreadMessages(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [GroupId]);

  useEffect(() => {
    if (groupRes?.success == 1) {
      setGroupData(groupRes.data);
    }
  }, [groupRes]);

  useEffect(() => {
    if (expenseRes?.success == 1) {
      setExpenseList(expenseRes.data);
      setTempExpenseList(expenseRes.data);
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
        setTempExpenseList((prevExpenses) => prevExpenses.filter((expense) => expense.expense_id !== selectedRow?.expense_id));
        showToast("Expense deleted Succesfully", "success");
      }
      handleDeleteModal();
    }
  }, [deleteExpRes]);

  useEffect(() => {
    if (selectedUser == "-1") {
      setTempExpenseList(expenseList);
    } else {
      setTempExpenseList(expenseList.filter((expense) => expense.paid_by == selectedUser));
    }
  }, [selectedUser]);

  return (
    <div className={styles.container}>
      <div className={styles.detailsCon}>
        <Card className="bg-white p-0 h-full">
          <CardHeader className={styles.cardHeader}>
            <CustomAccordion header="Group Details" padding="1rem">
              {groupDetailsLoading ? (
                <CircularLoader />
              ) : groupData ? (
                <GroupDetailsContent
                  {...groupData}
                  GroupId={GroupId}
                  setGroupData={setGroupData}
                  handleAddMemModal={handleAddMemModal}
                  handleGroupSettingModal={handleGroupSettingModal}
                  handleLogs={handleLogModal}
                  handleAnalysis={handleSpendAnalysisModal}
                />
              ) : null}
            </CustomAccordion>
          </CardHeader>
        </Card>
      </div>
      <div className={styles.pairsCon}>
        <Card className="bg-white p-0 h-full">
          <CardHeader className={styles.cardHeader}>
            <CustomAccordion header="Your Expense Summary" padding="1rem">
              {pairsLoading ? (
                <CircularLoader />
              ) : groupData ? (
                <GroupPairs isSettled={groupData.is_settled} pairsData={pairsData} GroupId={GroupId} groupData={groupData} />
              ) : null}
            </CustomAccordion>
          </CardHeader>
        </Card>
      </div>

      <div className={styles.expCon}>
        <Card className="bg-white h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <div className={styles.selectWrapper}>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className={styles.customSelect}>
                  {groupMemberOptionsList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 relative">
                {hasUnreadMessages && (
                  <div className={styles.unreadIndicator}>
                    <span className={styles.unreadText}>New messages</span>
                    <div className={styles.unreadBlinkBorder}></div>
                  </div>
                )}
                <MessageSquare onClick={handleChatModal} size={28} className="cursor-pointer text-blue-600" />
              </div>
            </div>
          </CardHeader>
          {expenseListLoading ? (
            <CircularLoader />
          ) : (
            <CardContent className={styles.expBox}>
              {/* <ScrollArea className="h-[400px] lg:h-[400px]"> */}
              {tempExpenseList.map((expense, index) => (
                <ExpenseCard
                  key={expense.expense_id}
                  {...expense}
                  allMembersList={groupData?.members ?? []}
                  index={index}
                  totalItemsCount={expenseList.length}
                  setAddExpModal={() => {
                    handleExpModal();
                    setSelectedRow(expense);
                    setIsClone(false);
                  }}
                  setDeleteModal={() => {
                    handleDeleteModal();
                    setSelectedRow(expense);
                  }}
                  ref={(el) => {
                    expenseRefs.current[expense.expense_id] = el;
                  }}
                  isSettled={groupData?.is_settled ?? false}
                  onCloneClick={() => {
                    handleExpModal();
                    setSelectedRow(expense);
                    setIsClone(true);
                  }}
                  onShareClick={() => handleShareInChat(expense)}
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
          setExpenseList={setTempExpenseList}
          selectedRow={selectedRow}
          callback={() => {
            fetchMyPairs();
            fetchGroupDetails();
            setSuccessModal(true);
          }}
          isClone={isClone}
        />
      ) : null}
      <CustomAlert
        isOpen={isDeleteModal}
        onClose={handleDeleteModal}
        onSubmit={handleDelete}
        description={Messages.EXPENSE.DELETE_ALERT(selectedRow?.expense_name ?? "")}
        isLoading={deleteExpLoading}
      />
      {logModal ? (
        <GroupLogs groupId={GroupId} isOpen={logModal} setIsOpen={handleLogModal} onExpenseClick={(id) => handleScrollToExpense(id)} />
      ) : null}
      {spendAnalysisModal ? (
        <GroupSpendAnalysis
          groupId={GroupId}
          isOpen={spendAnalysisModal}
          setIsOpen={handleSpendAnalysisModal}
          groupMembers={groupData?.members ?? []}
        />
      ) : null}
      {successModal ? <SuccessModal open={successModal} setOpen={setSuccessModal} /> : null}
      {addMemberModal ? (
        <AddMemberModal
          isOpen={addMemberModal}
          onClose={handleAddMemModal}
          callBackFunc={() => {
            handleAddMemModal();
            fetchGroupDetails();
          }}
          groupId={GroupId}
        />
      ) : null}
      {groupSettingModal && groupData ? (
        <GroupSettingModal
          isOpen={groupSettingModal}
          setIsOpen={setGroupSettingModal}
          data={groupData}
          groupId={GroupId}
          callbackFunc={() => fetchGroupDetails()}
        />
      ) : null}

      {chatModal ? (
        <ModalComponent isOpen={chatModal} setIsOpen={handleChatModal} customStyle={{ padding: 0, width: "auto" }} hideCloseBtn={true}>
          <ChatModule groupId={GroupId} onClose={() => setChatModal(false)} />
        </ModalComponent>
      ) : null}

      <ShareExpenseModal isOpen={isShareModal} setIsOpen={setShareModal} expense={sharingExpense} onShare={onConfirmShare} />
    </div>
  );
}
