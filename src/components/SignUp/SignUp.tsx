import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./style.module.css";
import Logo from "../Logo/Logo";
import OTPComponent from "../OTPComponent/OTPComponent";
import FormikWrapper from "../FormikWrapper/FormikWrapper";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};

type InitialValuesType = {
  name: string;
  upiAddress: string;
  email: string;
};

function SignUp(props: PropsType) {
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState("animateIn");

  const initialValues: InitialValuesType = {
    name: "",
    upiAddress: "",
    email: "",
  };

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
    { name: "upiAddress", label: "UPI Address", type: "text", placeholder: "Enter your UPI address" },
    { name: "email", label: "Email address", type: "email", placeholder: "Enter your email" },
  ];

  const handleSubmit = () => {
    setShowOTP(true);
    setIsLoading(true);
  };

  const handleClose = () => {
    setAnimate("animateOut");
    setTimeout(() => {
      props.setPageType("SIGN_IN");
    }, 500); // Match animation duration
  };

  return (
    <div className={`${styles.container} ${styles[animate]}`}>
      <Logo />
      <div className={styles.heading1}>Create New Account</div>
      {showOTP ? (
        <OTPComponent animateClassName={animate} />
      ) : (
        <FormikWrapper
          initialValues={initialValues}
          onSubmit={handleSubmit}
          fields={fields}
          submitButtonText="Sign Up"
          schemaName="userRegistrationSchema"
          isLoading={isLoading}
        />
      )}
      <div className={styles.signBtn}>
        Already have an account? <span onClick={handleClose}>Sign in</span>
      </div>
    </div>
  );
}

export default SignUp;
