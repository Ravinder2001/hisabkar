/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import styles from "./style.module.css";
import AddExpenseModal from "../../components/AddExpense/AddExpense";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useLocation } from "react-router-dom";
import GroupDetailsContent from "../../components/GroupDetailsContent/GroupDetailsContent";
import { LayoutDashboard, Users, TrendingUp, PlusCircle, MessageSquare } from "lucide-react";
import { ExpenseType, GroupDataType, GroupPairsData, MemberType } from "../../utils/comman/CommanTypes";
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
import GroupSettingModal from "../../components/GroupSettingModal/GroupSettingModal";
import ChatModule from "../../components/ChatModule/ChatModule";
import ShareExpenseModal from "../../components/ChatModule/ShareExpenseModal";
import BudgetSetter from "../../components/BudgetSetter/BudgetSetter";
import ChatAssistant from "../../components/ChatBotAssistant/ChatAssistant";
import ExpenseSkeleton from "../../components/ExpenseCard/ExpenseSkeleton";
import GroupDetailsSkeleton from "../../components/GroupDetailsContent/GroupDetailsSkeleton";

type TabId = "timeline" | "details" | "addExpense" | "summary" | "chat";

export default function GroupDetails() {
  const location = useLocation();
  const GroupId = location.pathname.split("/")[2];
  const user = useSelector((state: RootState) => state.user);
  const expenseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  // Track which tabs have been visited to lazy-load APIs
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(new Set<TabId>(["timeline"]));

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

  const { fetchData: fetchGroupMembers, response: membersRes } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_MEMBERS + "/" + GroupId);

  const [groupData, setGroupData] = useState<GroupDataType | null>(null);
  const [groupMembers, setGroupMembers] = useState<MemberType>([]);
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);
  const [tempExpenseList, setTempExpenseList] = useState<ExpenseType[]>([]);
  const [pairsData, setPairsData] = useState<GroupPairsData>({
    send: [],
    receive: [],
  });
  // const [isAddExpModal, setAddExpModal] = useState<boolean>(false);
  const [isDeleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ExpenseType | null>(null);
  const [logModal, setLogModal] = useState<boolean>(false);
  const [spendAnalysisModal, setSpendAnalysisModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false);
  const [groupSettingModal, setGroupSettingModal] = useState<boolean>(false);
  const [isClone, setIsClone] = useState(false);
  const [isShareModal, setShareModal] = useState<boolean>(false);
  const [sharingExpense, setSharingExpense] = useState<ExpenseType | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false);

  // Chat is now a tab — track if it's active to clear unread
  const isChatTabActiveRef = useRef<boolean>(false);

  const loadMoreExpenses = useCallback(() => {
    if (expenseListLoading || isFetchingMore || !hasMore || expenseList.length === 0) return;
    const lastId = expenseList[expenseList.length - 1].expense_id;
    setIsFetchingMore(true);
    fetchAllExpenses(CONSTANTS.API_ROUTES.ALL_EXPENSES + "/" + GroupId + `?lastId=${lastId}`);
  }, [expenseListLoading, isFetchingMore, hasMore, expenseList, GroupId, fetchAllExpenses]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastExpenseElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (expenseListLoading || isFetchingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreExpenses();
        }
      });
      if (node) observer.current.observe(node);
    },
    [expenseListLoading, isFetchingMore, hasMore, loadMoreExpenses]
  );

  // ── Tab switching with lazy loading ──────────────────────────────────────
  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);

      // When chat tab opened, clear unread indicator
      if (tab === "chat") {
        isChatTabActiveRef.current = true;
        setHasUnreadMessages(false);
      } else {
        isChatTabActiveRef.current = false;
      }

      if (tab !== "addExpense" && activeTab === "addExpense") {
        setSelectedRow(null);
        setIsClone(false);
      }

      if (!visitedTabs.has(tab)) {
        setVisitedTabs((prev) => new Set<TabId>(Array.from(prev).concat(tab)));
        // Trigger API fetch on first visit
        if (tab === "details") {
          fetchGroupDetails();
        } else if (tab === "summary") {
          fetchMyPairs();
          if (!groupData) fetchGroupDetails();
        } else if (tab === "addExpense") {
          if (!groupData) fetchGroupDetails();
        }
      }
    },
    [activeTab, visitedTabs, groupData, fetchGroupDetails, fetchMyPairs]
  );

  const handleAddExpenseClose = useCallback(() => {
    handleTabChange("timeline");
  }, [handleTabChange]);

  const handleAddExpenseSuccess = useCallback(() => {
    fetchMyPairs();
    fetchGroupDetails();
    setSuccessModal(true);
    handleTabChange("timeline");
  }, [fetchMyPairs, fetchGroupDetails, handleTabChange]);

  // const handleExpModal = () => {
  //   if (isAddExpModal && selectedRow) {
  //     setSelectedRow(null);
  //   }
  //   setAddExpModal(!isAddExpModal);
  // };
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

  const handleScrollToExpense = (id: any) => {
    const element = expenseRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    setExpenseList([]);
    setTempExpenseList([]);
    setHasMore(true);
    setIsFetchingMore(false);
  }, [GroupId]);

  // Fetch members and group details first, which then triggers expenses in a separate useEffect
  useEffect(() => {
    fetchGroupMembers();
    fetchGroupDetails();
    fetchAllExpenses();
    fetchUnreadStatus();

    const socket = io(ENVConfig.baseURL, { withCredentials: true });
    socketRef.current = socket;
    socket.emit("join_group", GroupId);

    socket.on("receive_message", (message) => {
      // Only show unread indicator when chat tab is NOT active
      if (!isChatTabActiveRef.current && String(message.user_id) !== String(user.id)) {
        setHasUnreadMessages(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [GroupId]);

  useEffect(() => {
    const handleOpenSpendAnalysis = () => setSpendAnalysisModal(true);
    window.addEventListener("openSpendAnalysis", handleOpenSpendAnalysis);
    return () => window.removeEventListener("openSpendAnalysis", handleOpenSpendAnalysis);
  }, []);

  useEffect(() => {
    if (unreadRes?.success === 1) {
      setHasUnreadMessages(unreadRes.hasUnread);
    }
  }, [unreadRes]);

  useEffect(() => {
    if (groupRes?.success == 1) {
      setGroupData(groupRes.data);
    }
  }, [groupRes]);

  useEffect(() => {
    if (membersRes?.success === 1) {
      setGroupMembers(membersRes.data);
    }
  }, [membersRes]);

  useEffect(() => {
    if (expenseRes?.success === 1) {
      if (isFetchingMore) {
        setExpenseList((prev) => [...prev, ...expenseRes.data]);
        setTempExpenseList((prev) => [...prev, ...expenseRes.data]);
        if (expenseRes.data.length < 10) {
          setHasMore(false);
        }
        setIsFetchingMore(false);
      } else {
        setExpenseList(expenseRes.data);
        setTempExpenseList(expenseRes.data);
        setHasMore(expenseRes.data.length >= 10);
      }
    } else if (expenseRes?.success === 0) {
      setIsFetchingMore(false);
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
        const updatedList = (prev: ExpenseType[]) => prev.filter((expense) => expense.expense_id !== selectedRow?.expense_id);
        setExpenseList(updatedList);
        setTempExpenseList(updatedList);
        showToast("Expense deleted Succesfully", "success");
      }
      handleDeleteModal();
    }
  }, [deleteExpRes]);

  // Nav tab definitions (built here so hasUnreadMessages is in scope)
  const NAV_TABS = React.useMemo<{ id: TabId; label: string; icon: React.ReactNode; isAdd?: boolean }[]>(
    () => [
      { id: "timeline", label: "Timeline", icon: <TrendingUp size={20} /> },
      { id: "details", label: "Details", icon: <LayoutDashboard size={20} /> },
      { id: "addExpense", label: "Add", icon: <PlusCircle size={28} />, isAdd: true },
      { id: "summary", label: "Summary", icon: <Users size={20} /> },
      {
        id: "chat",
        label: "Chat",
        icon: (
          <span className={styles.chatIconWrap}>
            <MessageSquare size={20} />
            {hasUnreadMessages && <span className={styles.unreadDot} />}
          </span>
        ),
      },
    ],
    [hasUnreadMessages]
  );

  return (
    <div className={styles.pageWrapper}>
      {/* ── Tab Content Area ────────────────────────────────────────────── */}
      <div className={styles.contentArea}>
        {/* TIMELINE TAB — no header, no filter */}
        <div className={`${styles.tabPane} ${activeTab === "timeline" ? styles.tabPaneActive : ""}`}>
          <Card className="bg-white h-full">
            {(expenseListLoading && !isFetchingMore) || !expenseRes ? (
              <CardContent className={styles.expBox}>
                {[1, 2, 3].map((i) => (
                  <ExpenseSkeleton key={i} />
                ))}
              </CardContent>
            ) : (
              <CardContent className={styles.expBox}>
                {tempExpenseList.length > 0 ? (
                  tempExpenseList.map((expense, index) => (
                    <ExpenseCard
                      key={`${expense.expense_id}-${index}`}
                      {...expense}
                      allMembersList={groupMembers}
                      index={index}
                      totalItemsCount={expenseList.length}
                      setAddExpModal={() => {
                        setSelectedRow(expense);
                        setIsClone(false);
                        handleTabChange("addExpense");
                      }}
                      setDeleteModal={() => {
                        handleDeleteModal();
                        setSelectedRow(expense);
                      }}
                      ref={(el: any) => {
                        expenseRefs.current[expense.expense_id] = el;
                      }}
                      isSettled={groupData?.is_settled ?? false}
                      onCloneClick={() => {
                        setSelectedRow(expense);
                        setIsClone(true);
                        handleTabChange("addExpense");
                      }}
                      onShareClick={() => handleShareInChat(expense)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="relative mb-8">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-full shadow-inner"
                      >
                        <TrendingUp className="w-16 h-16 text-purple-400 opacity-80" />
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 bg-white p-2 rounded-lg shadow-md"
                      >
                        <PlusCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    </div>

                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      Ready to start tracking?
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 max-w-[280px] mx-auto leading-relaxed">
                      This timeline is waiting for your first group expense. Add one now to see the magic happen!
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange("addExpense")}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 flex items-center gap-2 hover:shadow-xl transition-all"
                    >
                      <PlusCircle size={18} />
                      Add First Expense
                    </motion.button>
                  </motion.div>
                )}
                <div ref={lastExpenseElementRef} style={{ height: "10px" }} />
                {isFetchingMore && (
                  <div className="py-4">
                    <CircularLoader />
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* GROUP DETAILS TAB */}
        <div className={`${styles.tabPane} ${activeTab === "details" ? styles.tabPaneActive : ""}`}>
          <Card className="bg-white h-full">
            <CardContent className={styles.expBox}>
              {visitedTabs.has("details") ? (
                groupDetailsLoading ? (
                  <GroupDetailsSkeleton />
                ) : groupData ? (
                  <GroupDetailsContent
                    {...groupData}
                    membersList={groupMembers}
                    GroupId={GroupId}
                    setGroupData={setGroupData}
                    handleAddMemModal={handleAddMemModal}
                    handleGroupSettingModal={handleGroupSettingModal}
                    handleLogs={handleLogModal}
                    handleAnalysis={handleSpendAnalysisModal}
                  />
                ) : null
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* ADD EXPENSE TAB — inline form */}
        <div className={`${styles.tabPane} ${activeTab === "addExpense" ? styles.tabPaneActive : ""}`}>
          {groupDetailsLoading && !groupData ? (
            <div className="flex w-full h-full pt-4">
              <GroupDetailsSkeleton />
            </div>
          ) : !groupData?.is_settled ? (
            <AddExpenseModal
              isOpen={true}
              setIsOpen={handleAddExpenseClose}
              groupId={GroupId}
              memberList={groupMembers}
              setExpenseList={setTempExpenseList}
              selectedRow={selectedRow}
              callback={handleAddExpenseSuccess}
              isClone={isClone}
              inPage
            />
          ) : (
            <div className={styles.emptySettings}>
              <p className="text-sm text-gray-400">This group is settled — no new expenses can be added.</p>
            </div>
          )}
        </div>

        {/* EXPENSE SUMMARY TAB */}
        <div className={`${styles.tabPane} ${activeTab === "summary" ? styles.tabPaneActive : ""}`}>
          <Card className="bg-white h-full">
            <CardContent className={styles.expBox}>
              {visitedTabs.has("summary") ? (
                pairsLoading || groupDetailsLoading ? (
                  <GroupDetailsSkeleton />
                ) : (
                  <GroupPairs isSettled={groupData?.is_settled ?? false} pairsData={pairsData} GroupId={GroupId} groupMembers={groupMembers} />
                )
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* CHAT TAB — inline page, not a modal */}
        <div className={`${styles.tabPane} ${styles.chatTabPane} ${activeTab === "chat" ? styles.tabPaneActive : ""}`}>
          {/* Always mount ChatModule once chat tab is first visited so socket stays alive */}
          {visitedTabs.has("chat") && <ChatModule groupId={GroupId} groupName={groupData?.group_name || "Group Chat"} />}
        </div>
      </div>

      {/* ── Floating / Mobile Bottom Nav ────────────────────────────────── */}
      <nav className={styles.bottomNav}>
        <div className={styles.navInner}>
          {NAV_TABS.filter((tab) => !tab.isAdd || !groupData?.is_settled).map((tab) => (
            <button
              key={tab.id}
              className={`${tab.isAdd ? styles.navItemAdd : styles.navItem} ${
                activeTab === tab.id && !tab.isAdd ? styles.navItemActive : ""
              } ${activeTab === tab.id && tab.isAdd ? styles.navItemAddActive : ""}`}
              onClick={() => handleTabChange(tab.id)}
              aria-label={tab.label}
            >
              <span className={tab.isAdd ? styles.navAddCircle : styles.navIcon}>{tab.icon}</span>
              {!tab.isAdd && <span className={styles.navLabel}>{tab.label}</span>}
              {activeTab === tab.id && !tab.isAdd && <span className={styles.navActivePill} />}
            </button>
          ))}
        </div>
      </nav>

      {/* ── FAB Stack — timeline tab only (Budget + ChatBot) ─────────── */}
      {activeTab === "timeline" && !groupData?.is_settled && (
        <div className={styles.fabStack}>
          {/* Budget — top */}
          <BudgetSetter groupId={GroupId} onBudgetSet={() => fetchGroupDetails()} inStack />
          {/* ChatBot — bottom */}
          <ChatAssistant groupId={GroupId} inStack />
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {/* Edit/Clone is now handled inline via the 'Add' tab */}

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
        <GroupSpendAnalysis groupId={GroupId} isOpen={spendAnalysisModal} setIsOpen={handleSpendAnalysisModal} groupMembers={groupMembers} />
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
          membersList={groupMembers}
          groupId={GroupId}
          callbackFunc={() => fetchGroupDetails()}
        />
      ) : null}

      <ShareExpenseModal isOpen={isShareModal} setIsOpen={setShareModal} expense={sharingExpense} onShare={onConfirmShare} />
    </div>
  );
}
