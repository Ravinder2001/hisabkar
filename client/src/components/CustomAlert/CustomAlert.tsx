import React from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  description: string;
  isLoading: boolean;
};

function CustomAlert(props: PropsType) {
  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.onClose} className={styles.container}>
      <div className={styles.modalBody}>
        <p className={styles.modalDescription}>{props.description}</p>
      </div>

      <div className={styles.modalFooter}>
        <button type="button" className="hk-btn-secondary" onClick={props.onClose}>
          Cancel
        </button>
        <button type="button" className="hk-btn-primary" disabled={props.isLoading} onClick={() => props.onSubmit()}>
          {props.isLoading ? <CustomCircularLoading /> : "Submit"}
        </button>
      </div>
    </ModalComponent>
  );
}

export default CustomAlert;
