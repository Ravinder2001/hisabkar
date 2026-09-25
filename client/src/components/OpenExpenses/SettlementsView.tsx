import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Check, Share2, Mail, Loader2 } from "lucide-react";
import type { Group } from "../../pages/OpenExpenses/OpenExpenses";
import { calculateSettlements } from "../../pages/OpenExpenses/OpenExpenses";
import type { RootState } from "../../store/store";
import ModalComponent from "../ModalComponent/ModalComponent";
import CONSTANTS from "../../utils/constant/Constant";
import axiosInstance from "../../utils/helpers/axiosInstance";
import showToast from "../../utils/helpers/toastHelper";
import styles from "./SettlementsView.module.css";

interface SettlementsViewProps {
  group: Group;
  getMemberName: (memberId: string) => string;
}

export default function SettlementsView({ group, getMemberName }: SettlementsViewProps) {
  const settlements = calculateSettlements(group);
  const isUserLoggedIn = useSelector((state: RootState) => state.user.isUserLoggedIn);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const expensesOnly = group.expenses.filter((exp) => exp.type !== "advance");
  const advancesOnly = group.expenses.filter((exp) => exp.type === "advance");
  const totalExpenses = expensesOnly.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAdvances = advancesOnly.reduce((sum, exp) => sum + exp.amount, 0);

  // Helper to generate WhatsApp message for each member
  const getWhatsAppMessage = (memberId: string) => {
    const member = group.members.find((m) => m.id === memberId);
    if (!member) return "";

    const owes = settlements.filter((s) => s.from === memberId);
    const receives = settlements.filter((s) => s.to === memberId);

    const messageLines: string[] = [];
    messageLines.push(`Hi ${member.name},`);

    if (owes.length > 0) {
      messageLines.push(`You need to pay:`);
      owes.forEach((s) => {
        messageLines.push(`• ₹${s.amount.toFixed(2)} to ${getMemberName(s.to)}`);
      });
    }

    if (receives.length > 0) {
      messageLines.push(`You will receive:`);
      receives.forEach((s) => {
        messageLines.push(`• ₹${s.amount.toFixed(2)} from ${getMemberName(s.from)}`);
      });
    }

    // Add group context
    messageLines.push(`\n(Settlements for group: ${group.name})`);

    return messageLines.join("\n");
  };

  const getWhatsAppUrl = (memberId: string) => {
    const message = encodeURIComponent(getWhatsAppMessage(memberId));
    return `whatsapp://send?text=${message}`;
  };

  const handleSendEmail = async () => {
    if (!isUserLoggedIn) {
      showToast("Please sign in to send the expense report to your email", "info");
      return;
    }

    setIsSendingEmail(true);

    try {
      const payload = {
        groupName: group.name,
        totalExpenses,
        totalAdvances,
        members: group.members.map((m) => {
          let net = 0;
          group.expenses.forEach((e) => {
            if (e.paidBy === m.id) net += e.amount;
            e.shares?.forEach((s) => {
              if (s.memberId === m.id) net -= s.amount;
            });
          });
          return {
            name: m.name,
            netBalance: net,
          };
        }),
        expenses: group.expenses.map((exp) => {
          const isAdvance = exp.type === "advance";
          const receiverId = exp.toMemberId || (exp.shares && exp.shares.length > 0 ? exp.shares[0].memberId : "");
          return {
            description: exp.description,
            amount: exp.amount,
            paidByName: getMemberName(exp.paidBy),
            type: exp.type || "expense",
            receiverName: isAdvance ? getMemberName(receiverId) : undefined,
            date: exp.date,
            shares: exp.shares?.map((s) => ({
              memberName: getMemberName(s.memberId),
              amount: s.amount,
            })),
          };
        }),
        settlements: settlements.map((s) => ({
          from: getMemberName(s.from),
          to: getMemberName(s.to),
          amount: s.amount,
        })),
      };

      await axiosInstance.post(CONSTANTS.API_ROUTES.SEND_OPEN_EXPENSE_EMAIL, payload);
      showToast("Settlement report sent to your email successfully!", "success");
    } catch (err) {
      const error = err as { data?: { message?: string }; response?: { data?: { message?: string } }; message?: string };
      const errorMsg = error?.data?.message || error?.response?.data?.message || error?.message || "Failed to send email. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        {group.expenses.length > 0 && (
          <button
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className={`hk-btn-secondary ${styles.actionBtn}`}
            aria-label="Email Report to Logged-in User"
            title="Send Report to your email"
          >
            {isSendingEmail ? <Loader2 size={14} className={styles.spinner} /> : <Mail size={14} />}
            {isSendingEmail ? "Sending..." : "Email Report"}
          </button>
        )}
        {settlements.length > 0 && (
          <button onClick={openModal} className={`hk-btn-secondary ${styles.actionBtn}`} aria-label="Share via WhatsApp">
            <Share2 size={14} />
            Share
          </button>
        )}
      </div>

      <div className={`hk-card ${styles.card}`}>
        <h3 className={styles.cardTitle}>Settlement Summary</h3>

        {settlements.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Check size={28} />
            </div>
            <h4 className={styles.emptyTitle}>All settled up!</h4>
            <p className={styles.emptyDescription}>No payments needed between group members.</p>

            {group.expenses.length > 0 && (
              <div className={styles.settledEmailBox}>
                <div className={styles.settledEmailInfo}>
                  <p className={styles.settledEmailHeading}>Keep a permanent record</p>
                  <p className={styles.settledEmailSub}>Send the entire group expense breakdown and settlement summary to your email.</p>
                </div>
                <button type="button" className={`hk-btn-primary ${styles.emailSummaryBtn}`} onClick={handleSendEmail} disabled={isSendingEmail}>
                  {isSendingEmail ? <Loader2 size={15} className={styles.spinner} /> : <Mail size={15} />}
                  {isSendingEmail ? "Sending..." : "Send to My Email"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className={styles.intro}>To settle all expenses & advances with minimal transactions, the following payments need to be made:</p>
            <div className={styles.settlementList}>
              {settlements.map((settlement, index) => (
                <div key={index} className={styles.settlementRow}>
                  <div className={styles.person}>
                    <p className={styles.personName}>{getMemberName(settlement.from)}</p>
                    <p className={styles.personLabel}>owes</p>
                  </div>

                  <div className={styles.amountBlock}>
                    <div className={`hk-money ${styles.amount}`}>₹{settlement.amount.toFixed(2)}</div>
                    <div className={styles.amountLabel}>to pay</div>
                  </div>

                  <div className={`${styles.person} ${styles.personEnd}`}>
                    <p className={styles.personName}>{getMemberName(settlement.to)}</p>
                    <p className={styles.personLabel}>receives</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* WhatsApp Share Modal */}
      <ModalComponent isOpen={modalIsOpen} setIsOpen={closeModal}>
        <div className={styles.shareModal}>
          <div className={styles.shareModalTitle}>Share via WhatsApp</div>
          {group.members.map((member) => (
            <div key={member.id} className={styles.shareMemberRow}>
              <span className={styles.shareMemberName}>{member.name}</span>
              <a
                href={getWhatsAppUrl(member.id)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waBtn}
                aria-label={`Share with ${member.name}`}
              >
                <Share2 size={15} />
              </a>
            </div>
          ))}
        </div>
      </ModalComponent>
    </div>
  );
}
