import React from "react";
import styles from "./GroupCardSkeleton.module.css";

const GroupCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.header}>
        <div className={`${styles.skeleton} ${styles.title}`}></div>
        <div className={`${styles.skeleton} ${styles.moreBtn}`}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.item}>
            <div className={`${styles.skeleton} ${styles.icon}`}></div>
            <div className={`${styles.skeleton} ${styles.textShort}`}></div>
          </div>
          <div className={`${styles.item} ${styles.justifyEnd}`}>
            <div className={`${styles.skeleton} ${styles.iconSmall}`}></div>
            <div className={`${styles.skeleton} ${styles.textShort}`}></div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.item}>
            <div className={`${styles.skeleton} ${styles.icon}`}></div>
            <div className={`${styles.skeleton} ${styles.textMedium}`}></div>
          </div>
          <div className={`${styles.item} ${styles.justifyEnd}`}>
            <div className={`${styles.skeleton} ${styles.badge}`}></div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.avatarStack}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.skeleton} ${styles.avatar}`}></div>
          ))}
        </div>
        <div className={`${styles.skeleton} ${styles.badgeSmall}`}></div>
      </div>
    </div>
  );
};

export default GroupCardSkeleton;
