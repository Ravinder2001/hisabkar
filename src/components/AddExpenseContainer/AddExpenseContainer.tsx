import React from "react";
import styles from "./style.module.scss";
import CheckBox from "../CheckBox/CheckBox";
function AddExpenseContainer() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Add Expense</div>

      <input type="number" className={styles.input} placeholder="Enter Amount" />
      <div className={styles.label}>Paid by</div>
      <select name="" id="" className={styles.select}>
        <option value="Ravi">Ravi</option>
        <option value="Vishal">Vishal</option>
      </select>
      <div className={styles.label}>Members</div>
      <div className={styles.memberList}>
        <div className={styles.member}>
          <CheckBox checked={true} />
          <div className={styles.name}>Ravi</div>
        </div>
        <div className={styles.member}>
          <CheckBox checked={true} />
          <div className={styles.name}>Vishal</div>
        </div>
      </div>
      <div className={styles.btn}>Hisabkar</div>
    </div>
  );
}

export default AddExpenseContainer;
