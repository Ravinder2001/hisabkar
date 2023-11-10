import React from "react";
import styles from "./style.module.scss";
function HomeNav() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Hisabkar</div>
      <div className={styles.centerBox}>
        <div className={styles.label}>Features</div>
        <div className={styles.label}>Support</div>
        <div className={styles.label}>Ratings</div>
      </div>
      <div className={styles.btn}>Hisabkar</div>
    </div>
  );
}

export default HomeNav;
