import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CONSTANTS from "../../../utils/constant/Constant";
import styles from "../style.module.css";

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
}

const NAV_ITEMS = [
  { label: "Terms", path: `${CONSTANTS.PROJECT_ROUTES.LEGAL}/terms` },
  { label: "Privacy Policy", path: `${CONSTANTS.PROJECT_ROUTES.LEGAL}/privacy` },
  { label: "Disclaimer", path: `${CONSTANTS.PROJECT_ROUTES.LEGAL}/disclaimer` },
  { label: "About Us", path: `${CONSTANTS.PROJECT_ROUTES.LEGAL}/about` },
];

export default function LegalLayout({ children, title }: LegalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate(CONSTANTS.PROJECT_ROUTES.AUTHTICATION);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <nav className={styles.tabRow}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.path} to={item.path} className={`${styles.tab} ${location.pathname === item.path ? styles.tabActive : ""}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
