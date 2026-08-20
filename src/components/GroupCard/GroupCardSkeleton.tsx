import React from "react";
import styles from "./GroupCardSkeleton.module.css";

const GroupCardSkeleton = () => {
  return (
    <div className={`hk-card ${styles.skeletonCard}`}>
      <div className={`${styles.skeleton} ${styles.icon}`}></div>
      <div className={styles.body}>
        <div className={`${styles.skeleton} ${styles.title}`}></div>
        <div className={styles.metaRow}>
          <div className={`${styles.skeleton} ${styles.avatar}`}></div>
          <div className={`${styles.skeleton} ${styles.avatar}`}></div>
          <div className={`${styles.skeleton} ${styles.textShort}`}></div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={`${styles.skeleton} ${styles.amt}`}></div>
        <div className={`${styles.skeleton} ${styles.label}`}></div>
      </div>
    </div>
  );
};

export default GroupCardSkeleton;
