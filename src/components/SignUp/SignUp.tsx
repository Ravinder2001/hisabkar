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
  name: Yup.string().required("Name is required"),
  upiAddress: Yup.string()
    .required("UPI Address is required")
    .matches(/^[\w.-]+@[\w]+$/, "Invalid UPI address"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

function SignUp(props: PropsType) {
  const [showOTP, setShowOTP] = useState(false);

  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.heading1}>Create New Account</div>
      {showOTP ? (
        <OTPComponent />
      ) : (
        <Formik
          initialValues={{ name: "", upiAddress: "", email: "" }}
          validationSchema={SignUpSchema}
          onSubmit={() => {
            // console.log("Form Submitted: ", values);
            setShowOTP(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <div className={styles.box}>
                  <label className={styles.label}>Name</label>
                  <Field type="text" name="name" className={styles.input} placeholder="Enter your name" />
                  <ErrorMessage name="name" component="div" className={styles.error} />
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>UPI Address</label>
                  <Field type="text" name="upiAddress" className={styles.input} placeholder="Enter your UPI address" />
                  <ErrorMessage name="upiAddress" component="div" className={styles.error} />
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Email</label>
                  <Field type="email" name="email" className={styles.input} placeholder="Enter your email" />
                  <ErrorMessage name="email" component="div" className={styles.error} />
                </div>
                <ButtonComponent
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  // onClick={() => {}}
                  // type="submit"
                  // disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      )}
      <div className={styles.signBtn}>
        Already have an account?{" "}
        <span
          onClick={() => {
            props.setPageType("SIGN_IN");
          }}
        >
          Sign in
        </span>
      </div>
    </div>
  );
}

export default SignUp;
