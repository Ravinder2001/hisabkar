import React from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import styles from "./style.module.css";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

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
        <button className={styles.cancelButton} onClick={props.onClose}>
          Cancel
        </button>
        <div>
          <ButtonComponent
            text="Submit"
            isLoading={props.isLoading}
            onClick={() => {
              props.onSubmit();
            }}
          />
        </div>
      </div>
    </ModalComponent>
  );
}

export default CustomAlert;
