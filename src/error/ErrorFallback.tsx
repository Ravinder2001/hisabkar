import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import somethingWrongImage from "../assets/images/somethingwrongScreen.png";
import CONSTANTS from "../utils/constant/Constant";

const ErrorFallback = () => {
  const navigate = useNavigate();

  return (
    <div role="alert" className={styles.container}>
      <img src={somethingWrongImage} alt="Something went wrong" className={styles.img} />
      <p className={styles.text}>Oops! Something went wrong.</p>

      <div className={styles.submitBtn}>
        <div onClick={() => navigate(CONSTANTS.PROJECT_ROUTES.HOME)}>Go to Home</div>
      </div>
    </div>
  );
};

export default ErrorFallback;
