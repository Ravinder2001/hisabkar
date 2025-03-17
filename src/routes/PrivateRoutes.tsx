import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import CONSTANTS from "../utils/constant/Constant";
import styles from "../App.module.css";
import Navbar from "../components/Navbar/Navbar";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);

  if (!isUserLoggedIn) {
    return <Navigate to={CONSTANTS.PROJECT_ROUTES.AUTHTICATION} />;
  }

  return (
    <div className={styles.privateCon}>
      <div className={styles.navBar}>
        <Navbar />
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default PrivateRoute;
