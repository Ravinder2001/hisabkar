import React, { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import GroupCard from "../../components/GroupCard/GroupCard";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { GroupType } from "../../utils/comman/CommanTypes";
import styles from "./style.module.css";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import CreateGroupModal from "../../components/CreateGroup/CreateGroup";
import GroupSharingModal from "../../components/ShareGroup/ShareGroup";
import { useSelector } from "react-redux";
import GroupCardSkeleton from "../../components/GroupCard/GroupCardSkeleton";
import WelcomeModal from "../../components/WelcomeModal/WelcomeModal";
import { RootState } from "../../store/store";
import NotificationPrompt from "../../components/NotificationPrompt/NotificationPrompt";

type FilterId = "all" | "owe" | "owed" | "settled";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "owe", label: "You owe" },
  { id: "owed", label: "You're owed" },
  { id: "settled", label: "Settled" },
];

const formatMoney = (amount: number) => `₹${Math.round(Math.abs(amount)).toLocaleString("en-IN")}`;

function Home() {
  const isNewUser = useSelector((state: RootState) => state.user.isNewUser);
  const { fetchData, response, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.ALL_GROUPS);

  const [groupList, setGroupList] = useState<GroupType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isShareGroupModal, setIsShareGroupModal] = useState<{ status: boolean; groupCode: string }>({
    status: false,
    groupCode: "",
  });
  const [isWelcomeModal, setIsWelcomeModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (response?.success == 1) {
      setGroupList(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (isNewUser) setIsWelcomeModal(true);
  }, [isNewUser]);

  const { totalOwe, totalOwed } = useMemo(() => {
    return groupList.reduce(
      (acc, group) => {
        if (group.net_balance < 0) acc.totalOwe += Math.abs(group.net_balance);
        if (group.net_balance > 0) acc.totalOwed += group.net_balance;
        return acc;
      },
      { totalOwe: 0, totalOwed: 0 }
    );
  }, [groupList]);

  const visibleGroups = useMemo(() => {
    return groupList.filter((group) => {
      if (search && !group.group_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "owe") return !group.is_settled && group.net_balance < 0;
      if (filter === "owed") return !group.is_settled && group.net_balance > 0;
      if (filter === "settled") return group.is_settled;
      return true;
    });
  }, [groupList, search, filter]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Your groups</h1>
          <div className={styles.headerSub}>
            You owe {formatMoney(totalOwe)} · You&apos;re owed {formatMoney(totalOwed)}
          </div>
        </div>
      </div>

      <div className={styles.searchBox}>
        <Search size={16} />
        <input placeholder="Search groups" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className={styles.filterRow}>
        {FILTERS.map((f) => (
          <div key={f.id} className={`${styles.filterChip} ${filter === f.id ? styles.filterChipActive : ""}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </div>
        ))}
      </div>

      <div className={styles.cardCon}>
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <GroupCardSkeleton key={i} />
            ))}
          </>
        ) : visibleGroups.length > 0 ? (
          visibleGroups.map((group) => (
            <GroupCard
              key={group.group_id}
              {...group}
              setGroupList={setGroupList}
              handleLinkShare={() => {
                setIsShareGroupModal({ status: true, groupCode: group.code });
              }}
            />
          ))
        ) : (
          <div className={`hk-card ${styles.emptyState}`}>
            <div className={styles.emptyIcon}>
              <Users size={28} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--hk-ink)" }}>
              {groupList.length === 0 ? "No active groups" : "No groups match this filter"}
            </h3>
            <p style={{ color: "var(--hk-ink-soft)", fontSize: "0.85rem", maxWidth: 260 }}>
              {groupList.length === 0
                ? "Managing expenses is better together. Create your first group and start splitting!"
                : "Try a different search term or filter."}
            </p>
            {groupList.length === 0 && (
              <button className="hk-btn-primary" onClick={() => setIsCreateModal(true)}>
                Get Started
              </button>
            )}
          </div>
        )}
      </div>

      <FloatingActionButton
        onCreateGroup={() => {
          setIsCreateModal(true);
        }}
      />
      <CreateGroupModal
        isOpen={isCreateModal}
        setIsOpen={setIsCreateModal}
        setIsShareGroupModal={setIsShareGroupModal}
        callbackFunc={(data: GroupType) => {
          setGroupList((prev) => [data, ...prev]);
        }}
      />
      <GroupSharingModal
        isOpen={isShareGroupModal.status}
        setIsOpen={() => {
          setIsShareGroupModal({ status: false, groupCode: "" });
        }}
        groupCode={isShareGroupModal.groupCode}
      />
      {isWelcomeModal ? <WelcomeModal isOpen={isWelcomeModal} setIsOpen={setIsWelcomeModal} /> : null}
      <NotificationPrompt />
    </div>
  );
}

export default Home;
