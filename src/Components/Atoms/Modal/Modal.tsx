import * as React from "react";
import { Button, Modal, message } from "antd";

import styles from "./styles.module.css";
type ModalBoxProps = {
  url: string;
  open: boolean;
  handleClose: () => void;
};

export default function ModalBox(props: ModalBoxProps) {
  const { open, handleClose, url } = props;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success("Url is copied");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
    handleClose();
  };

  return (
    <div>
      <Modal
        title="Share this link with your friends"
        open={open}
        onOk={handleCopy}
        onCancel={handleClose}
        okText="Copy"
        centered
      >
        <p>{url}</p>
      </Modal>
    </div>
  );
}
