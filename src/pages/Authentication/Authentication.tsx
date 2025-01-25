import React, { useState } from "react";
import styles from "./style.module.css";
import SignUp from "../../components/SignUp/SignUp";
import SignIn from "../../components/SignIn/SignIn";

function Authentication() {
  const [pageType, setPageType] = useState<string>("SIGN_IN");
  return (
    <div className={styles.container}>{pageType == "SIGN_IN" ? <SignIn setPageType={setPageType} /> : <SignUp setPageType={setPageType} />}</div>
  );
}

export default Authentication;
