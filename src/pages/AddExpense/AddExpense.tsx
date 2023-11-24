import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import AccordionBox from "../../components/Accordian/Accordian";
import Splitor from "../../components/Splitor/Splitor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import PairContainer from "../../components/PairContainer/PairContainer";
import LucideIcons from "../../assets/Icons/Icons";
import { HandleDelete } from "../../store/slices/ExpenseSlice";
import { useNavigate } from "react-router-dom";
import { HomeRoute } from "../../utils/Constants";
import ExpensesImages from "../../components/ExpensesImages/ExpensesImages";
import FriendModal from "../../components/FriendModal/FriendModal";
function AddExpense() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GroupInfo = useSelector((state: RootState) => state.ExpenseSlice);
  const ExpenseList = useSelector((state: RootState) => state.ExpenseSlice.expenses);
  const PairsList = useSelector((state: RootState) => state.ExpenseSlice.pairs.filter((pair) => pair.amount > 0));
  const sortedPairsList = PairsList.slice().sort((a, b) => b.amount - a.amount);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const handleDelete = () => {
    dispatch(HandleDelete());
  };

  useEffect(() => {
    if (GroupInfo.group_name.length == 0) {
      navigate(HomeRoute);
    }
  }, [GroupInfo]);
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.leftBox}>
          <div className={styles.icon}>
            <ExpensesImages name={GroupInfo.group_type} />
          </div>
          <div
            className={styles.heading}
            onClick={() => {
              navigate(HomeRoute);
            }}
          >
            {GroupInfo.group_name}
          </div>
        </div>
        <div className={styles.rightBox}>
          <div className={styles.btn} onClick={handleOpen}>
            Share on Whatsapp
          </div>
          <div className={styles.deleteIcon} onClick={handleDelete}>
            <LucideIcons name="Trash" color="red" />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.leftContainer}>
          <div className={styles.boxHead}>Add Your Amount</div>
          <Splitor />
        </div>
        {sortedPairsList.length ? (
          <div className={styles.rightContainer}>
             <div className={styles.boxHead}>Bills</div>
            <div className={styles.pairContainer}>
              <div className={styles.sender}>Sender</div>
              <div className={styles.arrow}></div>
              <div className={styles.receiver}>Receiver</div>
              <div className={styles.amount}>Amount</div>
            </div>
            <div className={styles.pairList}>
              {sortedPairsList.map((pair: any) => (
                <PairContainer key={pair.id} id={pair.id} sender={pair.sender} receiver={pair.receiver} amount={pair.amount} />
              ))}
            </div>
          </div>
        ) : null}
        <div className={styles.centerContainer}>
        <div className={styles.boxHead}>Expenses</div>
          {ExpenseList.map((Expense) => (
            <AccordionBox
              key={Expense.id}
              id={Expense.id}
              amount={Expense.amount}
              paidById={Expense.paidById}
              paidByName={Expense.paidByName}
              members={Expense.members}
            />
          ))}
        </div>
      </div>
      <FriendModal status={open} handleModal={handleOpen} />
    </div>
  );
}

export default AddExpense;
