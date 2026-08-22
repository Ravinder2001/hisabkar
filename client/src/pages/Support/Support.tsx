import type React from "react";

import { useState } from "react";
import { LifeBuoy, MessageSquare, Bug, ArrowRight } from "lucide-react";
import SupportModal from "../../components/SupportModal/SupportModal";
import { SupportType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styles from "./style.module.css";

interface SupportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SupportCard({ title, description, icon, onClick }: SupportCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconBox}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <button className={`hk-btn-primary ${styles.cardButton}`} onClick={onClick}>
        Get Started
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
function Support() {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [supportType, setSupportType] = useState<SupportType>(null);

  const openModal = (type: SupportType) => {
    setSupportType(type);
    setModalOpen(!modalOpen);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>How can we help you?</h1>
          <p className={styles.subtitle}>Choose an option below to get assistance, provide feedback, or report an issue with Hisabkar.</p>
        </div>

        <div className={styles.cardGrid}>
          <SupportCard
            title="Customer Support"
            description="Get help with your account, payments, or general questions"
            icon={<LifeBuoy size={22} />}
            onClick={() => openModal("SUPPORT")}
          />

          {isUserLoggedIn ? (
            <SupportCard
              title="Feedback"
              description="Share your thoughts and suggestions to help us improve"
              icon={<MessageSquare size={22} />}
              onClick={() => openModal("FEEDBACK")}
            />
          ) : null}
          {isUserLoggedIn ? (
            <SupportCard
              title="Report a Bug"
              description="Let us know if something isn't working correctly"
              icon={<Bug size={22} />}
              onClick={() => openModal("BUG")}
            />
          ) : null}
        </div>
      </div>
      {modalOpen ? <SupportModal isOpen={modalOpen} setIsOpen={openModal} supportType={supportType} /> : null}
    </div>
  );
}

export default Support;
