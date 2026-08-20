import React from "react";
import skeletonStyles from "./skeleton.module.css";

const ExpenseSkeleton = () => {
  return (
    <div>
      <div className={skeletonStyles.row}>
        <div className={skeletonStyles.icon} />
        <div className={skeletonStyles.body}>
          <div className={skeletonStyles.title} />
          <div className={skeletonStyles.meta} />
        </div>
        <div className={skeletonStyles.right}>
          <div className={skeletonStyles.amt} />
          <div className={skeletonStyles.share} />
        </div>
      </div>
      <div className={skeletonStyles.splitWrap}>
        <div className={skeletonStyles.splitPill} />
      </div>
    </div>
  );
};

export default ExpenseSkeleton;
