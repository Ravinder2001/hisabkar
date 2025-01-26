import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./style.module.css";
import Logo from "../Logo/Logo";
import OTPComponent from "../OTPComponent/OTPComponent";
import FormikWrapper from "../FormikWrapper/FormikWrapper";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};
type InitialValuesType = {
  email: string;
};

function SignIn(props: PropsType) {
  const initialValues: InitialValuesType = {
    email: "",
  };

  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fields = [{ name: "email", label: "Email address", type: "email", placeholder: "Enter your email" }];

  const handleSubmit = () => {
    setShowOTP(true);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.heading1}>Sign in to your account</div>
      {showOTP ? (
        <OTPComponent />
      ) : (
        <FormikWrapper
          initialValues={initialValues}
          onSubmit={handleSubmit}
          fields={fields}
          submitButtonText="Sign In"
          schemaName="userLoginSchema"
          isLoading={isLoading}
        />
      )}
      <div
        className={styles.signBtn}
        onClick={() => {
          props.setPageType("SIGN_UP");
        }}
      >
        Create an account?
      </div>
    </div>
  );
}

export default SignIn;
