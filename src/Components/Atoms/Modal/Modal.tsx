import * as React from "react";
import { Button, Modal, message } from "antd";

import styles from "./styles.module.css";
import ReactIcons from "../ReactIcons/ReactIcons";
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
  const handleWhats = () => {
    handleCopy();
    const Newurl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
      url
    )}`;
    window.open(Newurl, "_blank");
  };

  return (
    <div>
      <Modal
        title="Share this link with your friends"
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <p>{url}</p>
        <Button className={styles.copyBtn} onClick={handleCopy}>
          Copy
        </Button>
        <Button className={styles.btn} onClick={handleWhats}>
          <span style={{ marginRight: "5px" }}>
            <ReactIcons name="BsWhatsapp" size={13} color="white" />
          </span>
          WhatsApp
        </Button>
      </Modal>
    </div>
  );
}
