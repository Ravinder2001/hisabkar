import React from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import styles from "./style.module.css";
import skeletonStyles from "../ExpenseCard/skeleton.module.css";

function GroupDetailHeaderSkeleton() {
  return (
    <div className={styles.header}>
      <button className={styles.backBtn} disabled aria-hidden="true">
        <ChevronLeft size={20} />
      </button>

      <div className={styles.titleBlock}>
        <div className={`${skeletonStyles.skeletonBase}`} style={{ width: 140, height: 18, marginBottom: 6 }} />
        <div className={`${skeletonStyles.skeletonBase}`} style={{ width: 90, height: 12 }} />
      </div>

      <div className={`${skeletonStyles.skeletonBase}`} style={{ width: 28, height: 28, borderRadius: "50%", flex: "none" }} />

      <button className={styles.menuBtn} disabled aria-hidden="true">
        <MoreVertical size={18} />
      </button>
    </div>
  );
}

export default GroupDetailHeaderSkeleton;
