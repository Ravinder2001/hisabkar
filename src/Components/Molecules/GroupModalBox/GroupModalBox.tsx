import { Button, Modal, message } from "antd";

import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";

import styles from "./styles.module.css";

type ModalBoxProps = {
  url: string;
  open: boolean;
  handleClose: () => void;
  name: string;
};

export default function GroupModalBox(props: ModalBoxProps) {
  const { open, handleClose, url, name } = props;
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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let message = `Hi All\n${name} has been created at hisabkar.\nYou all can check-out it here\n${url}
    \nThanks & Regards\nhisabkar.vercel.app`;

    let Newurl = "";

    if (isMobile) {
      // Open WhatsApp if installed on mobile
      Newurl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else {
      // Open WhatsApp Web on desktop
      Newurl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
        message
      )}`;
    }

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
        wrapClassName={styles.modal}
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
