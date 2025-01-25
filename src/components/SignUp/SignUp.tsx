import React from "react";
import styles from "./style.module.css";
import Logo from "../Logo/Logo";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

type fieldType = {
  label: string;
}[];

function SignUp() {
  const fields: fieldType = [
    {
      label: "Name",
    },
    {
      label: "UPI Address",
    },
    {
      label: "Email",
    },
  ];
  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.heading1}>Create new Account</div>
      <div className={styles.inputContainer}>
        {fields.map((field, index) => (
          <div key={index} className={styles.box}>
            <div className={styles.label}>{field.label}</div>
            <input type="text" className={styles.input} />
          </div>
        ))}
        <ButtonComponent text="Submit" />
      </div>
      <div className={styles.signBtn}>
        Already have an account? <span>Sign in</span>
      </div>
    </div>
  );
}

export default SignUp;
