import React from "react";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
type props = {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
};
function PairContainer(props: props) {
  const Members = useSelector((state: RootState) => state.StoreExpenseSlice.group_members);
  let senderName = Members.find((member) => member.id == props.sender);
  let receiverName = Members.find((member) => member.id == props.receiver);
  return (
    <div className={styles.container}>
      <div>{senderName?.name}</div>
      <div>{receiverName?.name}</div>
      <div>{props.amount}</div>
    </div>
  );
}

export default PairContainer;
