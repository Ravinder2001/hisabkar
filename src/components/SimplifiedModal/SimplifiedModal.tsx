import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { ArrowRight, IndianRupee, Bell } from "lucide-react";
import CustomAccordion from "../CustomAccordian/CustomAccordian";
import showToast from "../../utils/helpers/toastHelper";

type PropsType = {
  groupId: string;
  groupMembers: {
    id: string;
    name: string;
    avatar: string;
    total_spent: number;
    is_available: boolean;
  }[];
  isSettled?: boolean;
};

type SimplifiedDataType = {
  from: string;
  to: string;
  amount: number;
}[];

function SimplifiedComponent(props: PropsType) {
  const LoggedInUser = useSelector((state: RootState) => state.user.id);
  const [simplifiedData, setSimplifiedData] = useState<SimplifiedDataType>([]);

  const { fetchData, response, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.GET_SIMPLIFIED + "/" + props.groupId);
  const { fetchData: sendReminder, response: reminderRes, isLoading: isReminding } = useApiFetch("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (response?.success == 1) {
      setSimplifiedData(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (reminderRes?.success === 1) {
      showToast("Reminder sent successfully", "success");
    }
  }, [reminderRes]);

  // Helper function to get member name by ID
  const getMemberName = (id: string) => {
    const member = props.groupMembers.find((member) => {
      return member.id == String(id);
    });
    return member?.name.split(" ")[0] || "Unknown";
  };

  // Helper function to get member avatar by ID
  const getMemberAvatar = (id: string) => {
    const member = props.groupMembers.find((member) => {
      return member.id == String(id);
    });
    return member?.avatar || "";
  };

  // Filter user's transactions
  const userTransactions = simplifiedData.filter((transaction) => transaction.from === LoggedInUser || transaction.to === LoggedInUser);

  const handleSendReminder = (toUserId: string) => {
    sendReminder(CONSTANTS.API_ROUTES.SEND_REMINDER + "/" + props.groupId + "/" + toUserId, { method: "POST" });
  };

  return (
    <div className={styles.container}>
      {userTransactions.length > 0 && (
        <div className={styles.section}>
          <div className="hk-section-label">Your settlements</div>
          <div className={styles.personalRows}>
            {userTransactions.map((transaction, index) => {
              const youOwe = transaction.from === LoggedInUser;
              return (
                <div
                  key={index}
                  className={styles.personalRow}
                  style={{ background: youOwe ? "var(--hk-negative-soft)" : "var(--hk-positive-soft)" }}
                >
                  <div className={styles.personalWho}>
                    <div className={styles.personalAvatarWrap}>
                      <img src={youOwe ? getMemberAvatar(transaction.to) : getMemberAvatar(transaction.from)} alt="" />
                      <div
                        className={styles.personalAvatarBadge}
                        style={{ background: youOwe ? "var(--hk-negative)" : "var(--hk-positive)" }}
                      >
                        {youOwe ? "→" : "←"}
                      </div>
                    </div>
                    <div>
                      <div className={styles.personalLabel}>{youOwe ? "You need to send to" : "You will get from"}</div>
                      <div className={styles.personalName}>{youOwe ? getMemberName(transaction.to) : getMemberName(transaction.from)}</div>
                    </div>
                  </div>
                  <div className={styles.personalRight}>
                    <div className={`hk-money ${styles.personalAmt}`} style={{ color: youOwe ? "var(--hk-negative)" : "var(--hk-positive)" }}>
                      {youOwe ? "− " : "+ "}
                      {transaction.amount.toFixed(2)}
                    </div>
                    {transaction.to === LoggedInUser && props.isSettled && (
                      <button
                        type="button"
                        title="Send Reminder"
                        className={styles.reminderBtn}
                        onClick={() => handleSendReminder(transaction.from)}
                        disabled={isReminding}
                      >
                        <Bell size={16} style={{ color: "var(--hk-positive)", opacity: isReminding ? 0.5 : 1 }} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <CustomAccordion header="Group Simplification" expanded={true}>
          {isLoading ? (
            <div className={styles.spinnerWrap}>
              <div className={styles.spinner} />
            </div>
          ) : simplifiedData.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <IndianRupee size={22} />
              </div>
              <div className={styles.emptyTitle}>No settlements to display</div>
              <div className={styles.emptyDesc}>All expenses are already balanced</div>
            </div>
          ) : (
            <div>
              {simplifiedData.map((transaction, index) => (
                <div key={index} className={styles.row}>
                  <div className={styles.pairAvatars}>
                    <img src={getMemberAvatar(transaction.from) || "/placeholder.svg"} alt={`${getMemberName(transaction.from)}'s avatar`} />
                    <ArrowRight size={13} style={{ color: "var(--hk-ink-faint)" }} />
                    <img src={getMemberAvatar(transaction.to) || "/placeholder.svg"} alt={`${getMemberName(transaction.to)}'s avatar`} />
                  </div>
                  <div className={styles.rowBody}>
                    <div className={styles.rowName}>{getMemberName(transaction.from)}</div>
                    <div className={styles.rowMeta}>pays {getMemberName(transaction.to)}</div>
                  </div>
                  <div className={`hk-money ${styles.amountPill}`}>₹{transaction.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </CustomAccordion>
      </div>

      {!isLoading && simplifiedData.length > 0 && (
        <div className={styles.section}>
          <div className="hk-section-label">Transaction flow</div>
          <div className={styles.flowGrid}>
            {Array.from(new Set(simplifiedData.flatMap((transaction) => [transaction.from, transaction.to]))).map((memberId) => {
              const outgoing = simplifiedData.filter((t) => t.from === memberId).reduce((sum, t) => sum + t.amount, 0);
              const incoming = simplifiedData.filter((t) => t.to === memberId).reduce((sum, t) => sum + t.amount, 0);
              const net = incoming - outgoing;
              return (
                <div key={memberId} className={styles.flowTile}>
                  <img src={getMemberAvatar(memberId) || "/placeholder.svg"} alt={`${getMemberName(memberId)}'s avatar`} />
                  <div className={styles.flowName}>{getMemberName(memberId)}</div>
                  <div
                    className={`hk-money ${styles.flowNet}`}
                    style={{ color: net > 0 ? "var(--hk-positive)" : net < 0 ? "var(--hk-negative)" : "var(--hk-ink-faint)" }}
                  >
                    {net > 0 ? "+" : ""}
                    {net.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SimplifiedComponent;
