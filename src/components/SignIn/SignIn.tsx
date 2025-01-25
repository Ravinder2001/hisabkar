import React, { Dispatch, SetStateAction, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./style.module.css";
import Logo from "../Logo/Logo";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";
import OTPComponent from "../OTPComponent/OTPComponent";

type PropsType = {
  setPageType: Dispatch<SetStateAction<string>>;
};

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

function SignIn(props: PropsType) {
  const [showOTP, setShowOTP] = useState(false);

  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.heading1}>Sign in to your account</div>
      {showOTP ? (
        <OTPComponent />
      ) : (
        <Formik
          initialValues={{ name: "", upiAddress: "", email: "" }}
          validationSchema={SignUpSchema}
          onSubmit={() => {
            setShowOTP(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <div className={styles.box}>
                  <label className={styles.label}>Email</label>
                  <Field type="email" name="email" className={styles.input} placeholder="Enter your email" />
                  <ErrorMessage name="email" component="div" className={styles.error} />
                </div>
                <ButtonComponent
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  // onClick={}
                  // type="submit"
                  // disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
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
