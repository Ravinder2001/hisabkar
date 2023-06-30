import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import styles from "./styles.module.css";
import { toast } from "react-toastify";
import { SuccessToast } from "../../../utils/ToastStyle";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};
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
       toast.success("Url is copied",SuccessToast)
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className={styles.heading}>
              Share this link with your friends
            </div>
            <div className={styles.container}>
              <div className={styles.urlBox}>{url}</div>
              <div className={styles.copyBox} onClick={handleCopy}>
                Copy
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
