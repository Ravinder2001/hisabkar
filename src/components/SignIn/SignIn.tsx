/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";

import Logo from "../Logo/Logo";
import OTPComponent from "../OTPComponent/OTPComponent";
import FormikWrapper from "../FormikWrapper/FormikWrapper";
import showToast from "../../utils/helpers/toastHelper";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import Messages from "../../utils/constant/Messages";
import { setUserLoggedIn } from "../../store/features/userSlice";
import { decodeJWT } from "../../utils/helpers/authHelper";

import styles from "./style.module.css";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};
type InitialValuesType = {
  email: string;
};

type LoginOTPType = {
  email: string;
};
type ValuesType = {
  email: string;
};

const initialValues: InitialValuesType = {
  email: "",
};

function SignIn(props: PropsType) {
  const dispatch = useDispatch();

  const { fetchData: postGoogleSignIn, response: googleSignInRes } = useApiFetch("");
  const { fetchData: getSendLoginOTP, response: loginOTPRes, isLoading } = useApiFetch("");
  const { fetchData: postLogin, response: loginRes, isLoading: isLoginLoading } = useApiFetch("");

  const [showOTP, setShowOTP] = useState(false);
  const [animate, setAnimate] = useState("animateIn");
  const [values, setValues] = useState<ValuesType>({
    email: "",
  });

  const fields = [{ name: "email", label: "Email address", type: "email", placeholder: "Enter your email" }];

  const handleSubmit = async (values: LoginOTPType) => {
    await getSendLoginOTP(CONSTANTS.API_ROUTES.SEND_LOGIN_OTP + `/${values.email}`, {
      method: "GET",
    });
    setValues((prev) => ({
      ...prev,
      email: values.email,
    }));
  };

  const handleClose = () => {
    setAnimate("animateOut");
    setTimeout(() => {
      props.setPageType("SIGN_UP");
    }, 500); // Match animation duration
  };

  const handleGoogleSignIn = async (token: string) => {
    await postGoogleSignIn(CONSTANTS.API_ROUTES.GOOGLE_SIGN_IN, {
      method: "POST",
      data: { token },
    });
  };

  const handleGoogleError = () => {
    showToast(Messages.GENERAL.SERVER_ERROR, "error");
  };

  const handleLogin = (values: any) => {
    const decode = decodeJWT(values.data.token);
    if (typeof decode === "object" && decode !== null) {
      dispatch(setUserLoggedIn({ ...decode, token: values.data.token }));
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    await postLogin(CONSTANTS.API_ROUTES.LOGIN, {
      method: "POST",
      data: {
        email: values.email,
        otp: otp,
      },
    });
  };

  useEffect(() => {
    if (loginOTPRes?.success === 1) {
      setShowOTP(true);
    }
  }, [loginOTPRes]);

  useEffect(() => {
    if (googleSignInRes?.success === 1) {
      handleLogin(googleSignInRes);
    }
  }, [googleSignInRes]);

  useEffect(() => {
    if (loginRes?.success === 1) {
      handleLogin(loginRes);
    }
  }, [loginRes]);

  return (
    <div className={`${styles.container} ${styles[animate]}`}>
      <Logo />
      <div className={styles.heading1}>Sign in to your account</div>
      {showOTP ? (
        <OTPComponent animateClassName={animate} handleSubmit={handleOTPSubmit} isLoading={isLoginLoading} />
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
