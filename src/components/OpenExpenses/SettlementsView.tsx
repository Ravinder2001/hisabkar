import React, { useState } from "react";
import { Check, Share2 } from "lucide-react";
import type { Group } from "../../pages/OpenExpenses/OpenExpenses";
import { calculateSettlements } from "../../pages/OpenExpenses/OpenExpenses";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./SettlementsView.module.css";

export default function SettlementsView({ group, getMemberName }: { group: Group; getMemberName: (memberId: string) => string }) {
  const settlements = calculateSettlements(group);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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

  return (
    <div className={styles.container}>
      {settlements.length > 0 && (
        <div className={styles.headerRow}>
          <button onClick={openModal} className={`hk-btn-secondary ${styles.shareBtn}`}>
            <Share2 size={14} />
            Share
          </button>
        </div>
      )}

      <div className={`hk-card ${styles.card}`}>
        <h3 className={styles.cardTitle}>Settlement Summary</h3>

        {settlements.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Check size={28} />
            </div>
            <h4 className={styles.emptyTitle}>All settled up!</h4>
            <p className={styles.emptyDescription}>No payments needed between group members.</p>
          </div>
        ) : (
          <>
            <p className={styles.intro}>To settle all expenses, the following payments need to be made:</p>
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
