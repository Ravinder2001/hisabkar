import React from "react";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CountUp from "react-countup";
import LucideIcons from "../../assets/Icons/Icons";
type props = {
  id: string;
  group_id?: string;
  sender: string;
  receiver: string;
  amount: number;
  trash?: boolean;
};
function PairContainer(props: props) {
  const Members = useSelector((state: RootState) => state.ExpenseSlice.group_members);

  let senderName = Members.find((member) => member.id == props.sender);
  let receiverName = Members.find((member) => member.id == props.receiver);

  return (
    <div className={styles.container}>
      <div className={styles.sender}>
        <div className={styles.imgBox}>
          <img src={senderName?.avatar} alt="" className={styles.avatar} />
        </div>
        <div className={styles.name}>{senderName?.name}</div>
      </div>
      <div className={styles.arrow}>
        <LucideIcons name="MoveRight" />
      </div>
      <div className={styles.receiver}>
        <div className={styles.imgBox}>
          <img src={receiverName?.avatar} alt="" className={styles.avatar} />
        </div>
        <div className={styles.name}>{receiverName?.name}</div>
      </div>
      <CountUp end={props.amount} prefix="₹" className={styles.amount} />
    </div>
  );
}

export default PairContainer;
