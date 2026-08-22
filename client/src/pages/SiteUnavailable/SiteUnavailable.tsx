import React from "react";
import { Wrench } from "lucide-react";
import styles from "./style.module.css";

export default function SiteUnavailable() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <Wrench size={40} />
        </div>

        <h1 className={styles.title}>Site Currently Unavailable</h1>

        <p className={styles.desc}>We&apos;re performing some maintenance on our servers. Please check back soon.</p>

        <div className={styles.statusRow}>
          <div className={styles.pulseDotWrap}>
            <div className={styles.pulseDot} />
            <div className={styles.pulseRing} />
          </div>
          <span>Our team is working on it</span>
        </div>

        <button className="hk-btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>

        <p className={styles.downtime}>Estimated downtime: 30 minutes</p>
      </div>

      <div className={styles.footer}>
        <p>© {currentYear} Hisabkar. All rights reserved.</p>
      </div>
    </div>
  );
}
