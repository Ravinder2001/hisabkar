import { useState, useEffect } from "react";
import Spliter from "../../../Molecules/Spliter/Spliter";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import SimpleAccordion from "../../../Molecules/Accordian/Accordian";
import BillBox from "../../../Molecules/BillBox/BillBox";

function Main() {
  const ExpensesListFetch = useSelector(
    (state: RootState) => state.SplitSlice.expenses
  );
  const BillListFetch = useSelector(
    (state: RootState) => state.SplitSlice.billList
  );

  return (
    <div className={styles.container}>
      <div className={styles.spliter}>
        <Spliter />
      </div>
      <div className={styles.accordian}>
        {ExpensesListFetch.map((item, index) => (
          <div key={index} className={styles.accordianBox}>
            <SimpleAccordion
              amount={item.amount}
              paidBy={item.paidBy}
              memberList={item.memberList}
            />
          </div>
        ))}
      </div>
      <div className={styles.splitCon}>
        {BillListFetch.map((item, index) => (
          <>
            {item.amount != 0 && (
              <BillBox
                key={index}
                receiver={item.receiver}
                sender={item.sender}
                amount={item.amount}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default Main;
