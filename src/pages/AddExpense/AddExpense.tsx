import React from "react";
import styles from "./style.module.scss";
import AccordionBox from "../../components/Accordian/Accordian";
import Splitor from "../../components/Splitor/Splitor";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
function AddExpense() {
  const ExpenseList = useSelector((state: RootState) => state.StoreExpenseSlice.expenses);
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <Splitor />
      </div>
      <div className={styles.centerContainer}>
        {ExpenseList.map((Expense) => (
          <AccordionBox
            key={Expense.id}
            id={Expense.id}
            amount={Expense.amount}
            amountPerPerson={Expense.amountPerPerson}
            paidById={Expense.paidById}
            paidByName={Expense.paidByName}
            members={Expense.members}
          />
        ))}
      </div>
    </div>
  );
}

export default AddExpense;
