/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.css";
import AddExpenseModal from "../../components/AddExpense/AddExpense";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useLocation, useNavigate } from "react-router-dom";
import GroupDetailHeader from "../../components/GroupDetailHeader/GroupDetailHeader";
import axiosInstance from "../../utils/helpers/axiosInstance";
import { AxiosError } from "axios";
import { Users, TrendingUp, PlusCircle, MessageSquare, Sparkles, BarChart3 } from "lucide-react";
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
import GroupDetailHeaderSkeleton from "../../components/GroupDetailHeader/GroupDetailHeaderSkeleton";
import { formatSectionLabel } from "../../utils/helpers/commanHelper";

type TabId = "timeline" | "addExpense" | "summary" | "assistant" | "chat";

const formatMoney = (amount: number) => `₹${Math.round(Math.abs(amount)).toLocaleString("en-IN")}`;

export default function GroupDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const GroupId = location.pathname.split("/")[2];
  const user = useSelector((state: RootState) => state.user);
  const groupTypeList = useSelector((state: RootState) => state.data.groupTypeList);
  const expenseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  // Track which tabs have been visited to lazy-load APIs
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(new Set<TabId>(["timeline"]));
  // Only one expense's "..." menu open at a time — lifted here so opening one closes any other
  const [openExpenseMenuId, setOpenExpenseMenuId] = useState<number | null>(null);

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
  const { fetchData: toggleSettlement, response: settlementRes, isLoading: settlementLoading } = useApiFetch("");

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
  const [successMessage, setSuccessMessage] = useState<string>("Your expense has been added successfully.");
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false);
  const [groupSettingModal, setGroupSettingModal] = useState<boolean>(false);
  const [settlementConfirmModal, setSettlementConfirmModal] = useState<boolean>(false);
  const [isClone, setIsClone] = useState(false);
  const [isShareModal, setShareModal] = useState<boolean>(false);
  const [sharingExpense, setSharingExpense] = useState<ExpenseType | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false);

  const isUserAvailable = React.useMemo(() => {
    if (!groupMembers || groupMembers.length === 0) return false; // Default to false while loading
    const currentUserMember = groupMembers.find((m: any) => String(m.id) === String(user.id));
    return currentUserMember ? currentUserMember.is_available : false;
  }, [groupMembers, user.id]);

  // net balance for the hero card: positive = you're owed, negative = you owe
  const netBalance = useMemo(() => {
    const totalSend = pairsData.send.reduce((acc, item) => acc + Number(item.amount), 0);
    const totalReceive = pairsData.receive.reduce((acc, item) => acc + Number(item.amount), 0);
    return totalReceive - totalSend;
  }, [pairsData]);

  const memberName = useCallback(
    (id: string) => (groupMembers.find((m) => String(m.id) === String(id))?.name ?? "Someone").split(" ")[0],
    [groupMembers]
  );

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
        if (tab === "summary") {
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
    setSuccessMessage(isClone ? "Expense cloned successfully." : selectedRow ? "Expense updated successfully." : "Expense added successfully.");
    fetchMyPairs();
    fetchGroupDetails();
    setSuccessModal(true);
    handleTabChange("timeline");
  }, [fetchMyPairs, fetchGroupDetails, handleTabChange, isClone, selectedRow]);

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

  const handleSettlementConfirmModal = () => {
    setSettlementConfirmModal(!settlementConfirmModal);
  };

  const handleSettlement = () => {
    toggleSettlement(CONSTANTS.API_ROUTES.GROUP_SETTLEMENT + "/" + GroupId);
  };

  const handleDownloadGroupData = async () => {
    try {
      const response = await axiosInstance({
        url: CONSTANTS.API_ROUTES.DOWNLOAD_GROUP_DATA + "/" + GroupId,
        method: "GET",
        responseType: "blob", // Important: This tells axios to handle the response as binary data
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      // Get filename from response headers if available
      const contentDisposition = response.headers["content-disposition"];
      let filename = "group_data.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    } catch (err) {
      let errorMessage = "Error downloading file";

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      showToast(errorMessage, "error");
    }
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
    fetchMyPairs();

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

  useEffect(() => {
    if (settlementRes?.success == 1) {
      showToast(settlementRes?.message ?? "", "success");
      setSettlementConfirmModal(false);
      setGroupData((prev) => (prev ? { ...prev, is_settled: !prev.is_settled } : prev));
    }
  }, [settlementRes]);

  // Nav tab definitions (built here so hasUnreadMessages is in scope)
  const NAV_TABS = React.useMemo<{ id: TabId; label: string; icon: React.ReactNode; isAdd?: boolean }[]>(
    () => [
      { id: "timeline", label: "Timeline", icon: <TrendingUp size={20} /> },
      { id: "summary", label: "Summary", icon: <Users size={20} /> },
      { id: "addExpense", label: "Add", icon: <PlusCircle size={28} />, isAdd: true },
      { id: "assistant", label: "Assistant", icon: <Sparkles size={20} /> },
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

  const isOwing = netBalance < 0;
  const isOwed = netBalance > 0;

  const groupTypeName = groupTypeList.find((type) => type.id === groupData?.group_type_id)?.name ?? "";

  return (
    <div className={styles.pageWrapper}>
      {groupData ? (
        <GroupDetailHeader
          groupName={groupData.group_name}
          memberCount={groupData.total_members_count}
          groupTypeName={groupTypeName}
          members={groupMembers}
          isYouAdmin={groupData.is_you_admin}
          isSettled={groupData.is_settled}
          onBack={() => navigate(CONSTANTS.PROJECT_ROUTES.HOME)}
          onAddMember={handleAddMemModal}
          onGroupSettings={handleGroupSettingModal}
          onLogs={handleLogModal}
          onToggleSettlement={handleSettlementConfirmModal}
          onDownload={handleDownloadGroupData}
        />
      ) : (
        <GroupDetailHeaderSkeleton />
      )}

      {/* ── Balance hero — timeline tab only, permanently visible (no scroll collapse) ── */}
      {activeTab === "timeline" && groupData && !groupData.is_settled && (pairsData.send.length > 0 || pairsData.receive.length > 0) && (
        <div className={styles.balanceHero}>
          <div className={styles.balanceHeroTop}>
            <div>
              <div className={styles.balanceHeroLabel}>Your balance</div>
              <div className={`hk-money ${styles.balanceHeroAmt} ${isOwing ? styles.neg : isOwed ? styles.pos : ""}`}>
                {isOwing ? "− " : isOwed ? "+ " : ""}
                {formatMoney(netBalance)}
              </div>
              <div className={styles.balanceHeroTotalSpend}>
                Total spend <span className="hk-money">{formatMoney(groupData.total_amount)}</span>
              </div>
            </div>
            <div className={styles.balanceHeroActions}>
              <BudgetSetter groupId={GroupId} onBudgetSet={() => fetchGroupDetails()} />
              <button
                className="hk-icon-btn"
                style={{ width: 30, height: 30, flex: "none" }}
                title="Spend Analysis"
                onClick={handleSpendAnalysisModal}
              >
                <BarChart3 size={16} />
              </button>
            </div>
          </div>
          <div className={styles.balanceHeroChips}>
            {pairsData.send.map((item) => (
              <div key={`send-${item.user_id}`} className={`${styles.balanceHeroChip} ${styles.chipNeg}`}>
                <span className={styles.chipName}>{memberName(item.user_id)}</span>
                <span className="hk-money">− {formatMoney(Number(item.amount))}</span>
              </div>
            ))}
            {pairsData.receive.map((item) => (
              <div key={`receive-${item.user_id}`} className={`${styles.balanceHeroChip} ${styles.chipPos}`}>
                <span className={styles.chipName}>{memberName(item.user_id)}</span>
                <span className="hk-money">+ {formatMoney(Number(item.amount))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab Content Area ────────────────────────────────────────────── */}
      <div className={styles.contentArea}>
        {/* TIMELINE TAB — no header, no filter */}
        <div className={`${styles.tabPane} ${activeTab === "timeline" ? styles.tabPaneActive : ""}`}>
          <div className="h-full" style={{ background: "var(--hk-bg)" }}>
            {(expenseListLoading && !isFetchingMore) || !expenseRes ? (
              <div className={`${styles.expBox} ${styles.expBoxTimeline}`}>
                {[1, 2, 3].map((i) => (
                  <ExpenseSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className={`${styles.expBox} ${styles.expBoxTimeline}`}>
                {tempExpenseList.length > 0 ? (
                  tempExpenseList.map((expense, index) => {
                    const label = formatSectionLabel(expense.created_at);
                    const prevLabel = index > 0 ? formatSectionLabel(tempExpenseList[index - 1].created_at) : null;
                    return (
                      <React.Fragment key={`${expense.expense_id}-${index}`}>
                        {label !== prevLabel && <div className="hk-section-label">{label}</div>}
                        <ExpenseCard
                          {...expense}
                          allMembersList={groupMembers}
                          currentUserId={user.id}
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
                          openMenuId={openExpenseMenuId}
                          onMenuOpenChange={setOpenExpenseMenuId}
                          onCloneClick={() => {
                            setSelectedRow(expense);
                            setIsClone(true);
                            handleTabChange("addExpense");
                          }}
                          onShareClick={() => handleShareInChat(expense)}
                        />
                      </React.Fragment>
                    );
                  })
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
                        className="p-8 rounded-full"
                        style={{ background: "var(--hk-accent-soft)" }}
                      >
                        <TrendingUp className="w-16 h-16" style={{ color: "var(--hk-accent-strong)" }} />
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 p-2 rounded-lg"
                        style={{ background: "var(--hk-surface)", border: "1px solid var(--hk-border)" }}
                      >
                        <PlusCircle className="w-6 h-6" style={{ color: "var(--hk-positive)" }} />
                      </motion.div>
                    </div>

                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--hk-ink)" }}>
                      Ready to start tracking?
                    </h3>
                    <p className="text-sm mb-8 max-w-[280px] mx-auto leading-relaxed" style={{ color: "var(--hk-ink-soft)" }}>
                      This timeline is waiting for your first group expense. Add one now to see the magic happen!
                    </p>

                    {isUserAvailable && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTabChange("addExpense")}
                        className="hk-btn-primary"
                      >
                        <PlusCircle size={18} />
                        Add First Expense
                      </motion.button>
                    )}
                  </motion.div>
                )}
                <div ref={lastExpenseElementRef} style={{ height: "10px" }} />
                {isFetchingMore && (
                  <div className="py-4">
                    <CircularLoader />
                  </div>
                )}
              </div>
            )}
          </div>
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
              <p className="text-sm" style={{ color: "var(--hk-ink-faint)" }}>
                This group is settled — no new expenses can be added.
              </p>
            </div>
          )}
        </div>

        {/* EXPENSE SUMMARY TAB */}
        <div className={`${styles.tabPane} ${activeTab === "summary" ? styles.tabPaneActive : ""}`}>
          <div className="h-full" style={{ background: "var(--hk-bg)" }}>
            <div className={styles.expBox}>
              {visitedTabs.has("summary") ? (
                pairsLoading || groupDetailsLoading ? (
                  <GroupDetailsSkeleton />
                ) : (
                  <GroupPairs isSettled={groupData?.is_settled ?? false} pairsData={pairsData} GroupId={GroupId} groupMembers={groupMembers} />
                )
              ) : null}
            </div>
          </div>
        </div>

        {/* AI ASSISTANT TAB — was a floating FAB + popup, now a proper tab */}
        <div className={`${styles.tabPane} ${styles.chatTabPane} ${activeTab === "assistant" ? styles.tabPaneActive : ""}`}>
          {visitedTabs.has("assistant") && <ChatAssistant groupId={GroupId} />}
        </div>

        {/* CHAT TAB — inline page, not a modal */}
        <div className={`${styles.tabPane} ${styles.chatTabPane} ${activeTab === "chat" ? styles.tabPaneActive : ""}`}>
          {/* Always mount ChatModule once chat tab is first visited so socket stays alive */}
          {visitedTabs.has("chat") && <ChatModule groupId={GroupId} />}
        </div>
      </div>

      {/* ── Floating / Mobile Bottom Nav ── */}
      <nav className={styles.bottomNav}>
        <div className={styles.navInner}>
          {NAV_TABS.filter((tab) => !tab.isAdd || (groupData?.is_settled === false && isUserAvailable)).map((tab) => (
            <button
              key={tab.id}
              className={`
          ${tab.isAdd ? styles.navItemAdd : styles.navItem}
          ${activeTab === tab.id && !tab.isAdd ? styles.navItemActive : ""}
          ${activeTab === tab.id && tab.isAdd ? styles.navItemAddActive : ""}
        `}
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

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {/* Edit/Clone is now handled inline via the 'Add' tab */}

      <CustomAlert
        isOpen={isDeleteModal}
        onClose={handleDeleteModal}
        onSubmit={handleDelete}
        description={Messages.EXPENSE.DELETE_ALERT(selectedRow?.expense_name ?? "")}
        isLoading={deleteExpLoading}
      />
      <CustomAlert
        isOpen={settlementConfirmModal}
        onClose={handleSettlementConfirmModal}
        onSubmit={handleSettlement}
        description={Messages.EXPENSE.SETTLEMENT_ALERT(groupData?.is_settled ?? false)}
        isLoading={settlementLoading}
      />
      {logModal ? (
        <GroupLogs groupId={GroupId} isOpen={logModal} setIsOpen={handleLogModal} onExpenseClick={(id) => handleScrollToExpense(id)} />
      ) : null}
      {spendAnalysisModal ? (
        <GroupSpendAnalysis groupId={GroupId} isOpen={spendAnalysisModal} setIsOpen={handleSpendAnalysisModal} groupMembers={groupMembers} />
      ) : null}
      {successModal ? <SuccessModal open={successModal} setOpen={setSuccessModal} message={successMessage} /> : null}
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
