/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./style.module.css";
import Logo from "../Logo/Logo";
import OTPComponent from "../OTPComponent/OTPComponent";
import FormikWrapper from "../FormikWrapper/FormikWrapper";
import CONSTANTS from "../../utils/constant/Constant";
import { useDispatch } from "react-redux";
import { setUserLoggedIn } from "../../store/features/userSlice";
import { decodeJWT } from "../../utils/helpers/authHelper";
import useApiFetch from "../../hooks/useAPIFetch";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};

type InitialValuesType = {
  name: string;
  upiAddress: string;
  email: string;
};

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

function SignUp(props: PropsType) {
  const dispatch = useDispatch();

  const { fetchData: getSendOTP, response: loginOTPRes, isLoading } = useApiFetch("");
  const { fetchData: postRegister, response: registerRes, isLoading: isRegisterLoading } = useApiFetch("");

  const [showOTP, setShowOTP] = useState(false);
  const [animate, setAnimate] = useState("animateIn");
  const [values, setValues] = useState<InitialValuesType>(initialValues);

  const handleSubmit = async (values: InitialValuesType) => {
    await getSendOTP(CONSTANTS.API_ROUTES.SEND_OTP + `${values.email}`, {
      method: "GET",
    });
    setValues(values);
  };

  const handleClose = () => {
    setAnimate("animateOut");
    setTimeout(() => {
      props.setPageType("SIGN_IN");
    }, 500);
  };

  const handleLogin = (values: any) => {
    const decode = decodeJWT(values.data.token);
    if (typeof decode === "object" && decode !== null) {
      dispatch(setUserLoggedIn({ ...decode, token: values.data.token }));
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    await postRegister(CONSTANTS.API_ROUTES.REGISTER, {
      method: "POST",
      data: {
        ...values,
        otp: otp,
      },
    });
  };

  useEffect(() => {
    if (loginOTPRes?.success == 1) {
      setShowOTP(true);
    }
  }, [loginOTPRes]);

  useEffect(() => {
    if (registerRes?.success == 1) {
      handleLogin(registerRes);
    }
  }, [registerRes]);

  return (
    <div className={`${styles.container} ${styles[animate]}`}>
      <Logo />
      <div className={styles.heading1}>Create New Account</div>
      {showOTP ? (
        <OTPComponent animateClassName={animate} handleSubmit={handleOTPSubmit} isLoading={isRegisterLoading} />
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
