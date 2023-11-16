import React from "react";
import AddExpenseContainer from "../../components/AddExpenseContainer/AddExpenseContainer";
import styles from "./style.module.scss"
function AddExpense() {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <AddExpenseContainer />
      </div>
    </div>
  );
}

export default AddExpense;
