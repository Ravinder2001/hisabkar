import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
import PinBox from "../../PinBox/PinBox";
type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
};
function LoginContainer(props: props) {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Login</div>

      <div className={styles.mainContainer}>
        <div className={styles.label}>Username</div>
        <input className={styles.input} type="text" placeholder="Username" />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.label}>Pin</div>
        <PinBox />
      </div>
      <div className={styles.btn}>Submit</div>

      <div
        className={styles.footer}
        onClick={() => {
          props.setSelectedOptions("sign");
        }}
      >
        Create an account
      </div>
      <div className={styles.footer}>
        Forgot Pin? <span>Contact Admin</span>
      </div>
    </div>
  );
}

export default LoginContainer;
