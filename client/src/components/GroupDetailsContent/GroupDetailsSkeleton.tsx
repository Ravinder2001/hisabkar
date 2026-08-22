import React from "react";
import styles from "./style.module.css";
import skeletonStyles from "../ExpenseCard/skeleton.module.css";

const GroupDetailsSkeleton = () => {
  return (
    <div className={`${styles.container} space-y-6 pt-6`}>
      {/* Title + Menu */}
      <div className="flex items-center justify-between">
        <div className={`${skeletonStyles.skeletonBase} w-32 h-8`} />
        <div className={`${skeletonStyles.skeletonBase} w-8 h-8 rounded-full`} />
      </div>

      {/* Row 1: Type */}
      <div className="flex items-center gap-2">
        <div className={`${skeletonStyles.skeletonBase} w-5 h-5`} />
        <div className={`${skeletonStyles.skeletonBase} w-24 h-5`} />
      </div>

      {/* Row 2: Members Count */}
      <div className="flex items-center gap-2">
        <div className={`${skeletonStyles.skeletonBase} w-5 h-5`} />
        <div className={`${skeletonStyles.skeletonBase} w-20 h-5`} />
        <div className={`${skeletonStyles.skeletonBase} ml-auto w-24 h-6 rounded-full`} />
      </div>

      {/* Row 3: Total Amount */}
      <div className="flex items-center gap-2">
        <div className={`${skeletonStyles.skeletonBase} w-5 h-5`} />
        <div className={`${skeletonStyles.skeletonBase} w-16 h-5 font-semibold text-green-500`} />
      </div>

      <div className="border-b border-gray-100" />

      {/* Members Label */}
      <div className="space-y-4">
        <div className={`${skeletonStyles.skeletonBase} w-20 h-5 mb-4`} />
        {/* Members List */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className={`${skeletonStyles.skeletonBase} w-10 h-10 rounded-full`} />
            <div className="flex-1 space-y-2">
              <div className={`${skeletonStyles.skeletonBase} w-32 h-4`} />
              <div className={`${skeletonStyles.skeletonBase} w-24 h-3`} />
            </div>
            {i <= 3 && <div className={`${skeletonStyles.skeletonBase} w-6 h-6 rounded-full`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupDetailsSkeleton;
