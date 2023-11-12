import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
import PinBox from "../../PinBox/PinBox";
type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
};
function SignUpContainer(props: props) {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Create an Account</div>

      <div className={styles.mainContainer}>
        <div className={styles.label}>Username</div>
        <input className={styles.input} type="text" placeholder="Username" />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.label}>Pin</div>
        <PinBox />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.label}>Confirm Pin</div>
        <PinBox />
      </div>
      <div className={styles.btn}>Submit</div>

      <div className={styles.footer}>
        Already have a account?{" "}
        <span
          onClick={() => {
            props.setSelectedOptions("login");
          }}
        >
          Login
        </span>
      </div>
    </div>
  );
}

export default SignUpContainer;
