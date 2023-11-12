import React from "react";
import styles from "./style.module.scss";
import PinBox from "../../PinBox/PinBox";
function SignUpContainer() {
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

      <div>
        Already have a account? <span>Login</span>
      </div>
      <div>
        Forgot Pin? <span>Contact Admin</span>
      </div>
    </div>
  );
}

export default SignUpContainer;
