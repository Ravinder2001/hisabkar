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
  const renderWhats = (jsonData: any) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let message = "";

    if (jsonData) {
      const { name, sending, receiving, sendingamount, receivingamount } = jsonData;

      // Formatting the receiving list
      const receivingList = receiving?.map((item: any, index: any) => `${index + 1}) ${item.name}-₹${item.amount}`)?.join("\n");

      // Formatting the sending list
      const sendingList = sending?.map((item: any, index: any) => `${index + 1}) ${item.name}-₹${item.amount}`)?.join("\n");

      // Constructing the final message
      message = `Hi ${name}\n\nYou are going to receive ₹${receivingamount} ${
        receiving?.length ? `from ${receiving?.length ?? 0} people:\n${receivingList}` : ""
      }\n\nAnd you have to send ₹${sendingamount} ${sending?.length ? `to ${sending?.length} people:\n${sendingList}` : ""}
      \nYou can check out the Expenses here\n${"url"}\n\nThanks & Regards\nhisabkar.vercel.app`;
    }

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
        <div className={styles.container} onClick={renderWhats}>
          <img src={user.avatar} alt="" className={styles.img} />

          <div className={styles.name}>{user.name}</div>
        </div>
      ))}
    </Modal>
  );
};

export default FriendModal;
