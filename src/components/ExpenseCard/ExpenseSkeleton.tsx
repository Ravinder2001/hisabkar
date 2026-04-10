import React from "react";
import styles from "./style.module.css";
import skeletonStyles from "./skeleton.module.css";

const ExpenseSkeleton = ({ isLast = false }: { isLast?: boolean }) => {
  return (
    <div className={`${styles.expenseCon} w-full`}>
      <div className={styles.card}>
        {/* Header Skeleton */}
        <div className={`${styles.cardHeader} ${skeletonStyles.headerSkeleton}`}>
          <div className={skeletonStyles.amountSkeleton} />
          <div className={skeletonStyles.chipSkeleton} />
        </div>

        {/* Body Skeleton */}
        <div className={styles.cardBody}>
          <div className={skeletonStyles.tagSkeleton} />
          <div className={skeletonStyles.nameSkeleton} />
          <div className={skeletonStyles.dateSkeleton} />
        </div>
      </div>

      {/* Branch connector */}
      {!isLast && (
        <div className={styles.branchConnector}>
          <div className={styles.branchLine} />
        </div>
      )}
    </div>
  );
};

export default ExpenseSkeleton;
