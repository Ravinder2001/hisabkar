import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import AccordionBox from "../../components/Accordian/Accordian";
import Splitor from "../../components/Splitor/Splitor";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import PairContainer from "../../components/PairContainer/PairContainer";
function AddExpense() {
 

  const ExpenseList = useSelector((state: RootState) => state.ExpenseSlice.expenses);
  const PairsList = useSelector((state: RootState) => state.ExpenseSlice.pairs.filter((pair) => pair.amount > 0));



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
      <div className={styles.rightContainer}>
        {PairsList.map((pair:any) => (
          <PairContainer key={pair.id} id={pair.id} sender={pair.sender} receiver={pair.receiver} amount={pair.amount} />
        ))}
      </div>
    </div>
  );
}

export default AddExpense;
