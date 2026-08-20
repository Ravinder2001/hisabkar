import React from "react";
import skeletonStyles from "./skeleton.module.css";

const ExpenseSkeleton = () => {
  return (
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
  );
};

export default ExpenseSkeleton;
