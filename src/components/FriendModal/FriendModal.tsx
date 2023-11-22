import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal } from "antd";

import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
type props = {
  status: boolean;
  handleModal: () => void;
};
const FriendModal = (props: props) => {
  const Users = useSelector((state: RootState) => state.ExpenseSlice.group_members);
  const Pairs = useSelector((state: RootState) => state.ExpenseSlice.pairs);

  const handleWhatsApp = (id: string, name: string) => {
    let receiverStack: any = [];
    let senderStack: any = [];
    let ReceiverPair = Pairs.filter((item) => item.receiver == id && item.amount > 0);
    ReceiverPair?.map((item) => {
      let data = Users.find((user) => user.id == item.sender);

      receiverStack.push({ name: data?.name, amount: item.amount });
    });
    let SenderPair = Pairs.filter((item) => item.sender == id && item.amount > 0);
    SenderPair?.map((item) => {
      let data = Users.find((user) => user.id == item.receiver);

      senderStack.push({ name: data?.name, amount: item.amount });
    });

    let totalReceivingAmount = receiverStack.reduce((total: any, item: any) => total + item.amount, 0);
    let totalSendingAmount = senderStack.reduce((total: any, item: any) => total + item.amount, 0);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let message = "";

    // Formatting the receiving list
    const receivingList = receiverStack?.map((item: any, index: any) => `${index + 1}) ${item.name}-₹${item.amount}`)?.join("\n");

    // Formatting the sending list
    const sendingList = senderStack?.map((item: any, index: any) => `${index + 1}) ${item.name}-₹${item.amount}`)?.join("\n");

    // Constructing the final message
    message = `Hi ${name}\n\nYou are going to receive ₹${totalReceivingAmount} ${
      receiverStack?.length ? `from ${receiverStack?.length ?? 0} people:\n${receivingList}` : ""
    }\n\nAnd you have to send ₹${totalSendingAmount} ${senderStack?.length ? `to ${senderStack?.length} people:\n${sendingList}` : ""}
      \n\nThanks & Regards\nhisabkar.vercel.app`;

    let Newurl = "";

    if (isMobile) {
      // Open WhatsApp if installed on mobile
      Newurl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else {
      // Open WhatsApp Web on desktop
      Newurl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    }

    window.open(Newurl, "_blank");
  };
  return (
    <Modal className={styles.modal} width={400} title="Share on Whatsapp!" open={props.status} closeIcon footer={null} onCancel={props.handleModal}>
      {Users.map((user) => (
        <div
          className={styles.container}
          onClick={() => {
            handleWhatsApp(user.id, user.name);
          }}
        >
          <img src={user.avatar} alt="" className={styles.img} />
          <div className={styles.name}>{user.name}</div>
        </div>
      ))}
    </Modal>
  );
};

export default FriendModal;
