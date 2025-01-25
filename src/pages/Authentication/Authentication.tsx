import React from "react";
import styles from "./style.module.css";
import SignUp from "../../components/SignUp/SignUp";

function Authentication() {
  return (
    <div className={styles.container}>
      <SignUp />
    </div>
  );
}

export default Authentication;
