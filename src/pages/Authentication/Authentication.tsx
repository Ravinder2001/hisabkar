import React, { useState } from "react";
import styles from "./style.module.css";
import SignUp from "../../components/SignUp/SignUp";
import SignIn from "../../components/SignIn/SignIn";
import { Link } from "react-router-dom";

function Authentication() {
  const [pageType, setPageType] = useState<string>("SIGN_IN");
  return (
    <div className={styles.container}>
      {pageType == "SIGN_IN" ? <SignIn setPageType={setPageType} /> : <SignUp setPageType={setPageType} />}
      <div className={styles.bottomBox}>
        <Link to="/legal/terms">Terms & Conditions</Link>
        <Link to="/legal/privacy">Privacy Policy</Link>
        <Link to="/legal/disclaimer">Disclaimer</Link>
        <Link to="/legal/about">About Us</Link>
      </div>
    </div>
  );
}

export default Authentication;
