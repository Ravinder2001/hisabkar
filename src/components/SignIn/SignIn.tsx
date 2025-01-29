import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./style.module.css";
import Logo from "../Logo/Logo";
import OTPComponent from "../OTPComponent/OTPComponent";
import FormikWrapper from "../FormikWrapper/FormikWrapper";
import showToast from "../../utils/helpers/toastHelper";
import { GoogleLogin } from "@react-oauth/google";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import Messages from "../../utils/constant/Messages";

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

  const { fetchData } = useApiFetch("");

  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState("animateIn");

  const fields = [{ name: "email", label: "Email address", type: "email", placeholder: "Enter your email" }];

  const handleSubmit = () => {
    showToast("Hi there", "success");
    setShowOTP(true);
    setIsLoading(false);
  };

  const handleClose = () => {
    setAnimate("animateOut");
    setTimeout(() => {
      props.setPageType("SIGN_UP");
    }, 500); // Match animation duration
  };

  const handleGoogleSignIn = async (token: string) => {
    await fetchData(CONSTANTS.API_ROUTES.GOOGLE_SIGN_IN, {
      data: { token },
    });
  };

  const handleGoogleError = () => {
    showToast(Messages.GENERAL.SERVER_ERROR, "error");
  };

  return (
    <div className={`${styles.container} ${styles[animate]}`}>
      <Logo />
      <div className={styles.heading1}>Sign in to your account</div>
      {showOTP ? (
        <OTPComponent animateClassName={animate} />
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

      <div className={styles.line}></div>
      <GoogleLogin
        onSuccess={(response) => {
          handleGoogleSignIn(response.credential ?? "");
        }}
        onError={handleGoogleError}
      />
      <div className={styles.signBtn} onClick={handleClose}>
        Create an account?
      </div>
    </div>
  );
}

export default SignIn;
