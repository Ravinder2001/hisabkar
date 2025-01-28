import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import CONSTANTS from "../utils/constant/Constant";
import styles from "../App.module.css";
import SidebarComponent from "../components/Sidebar/Sidebar";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);

  return isUserLoggedIn ? (
    <div className={styles.privateCon}>
      <div className={styles.sideBar}>
        <SidebarComponent />
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  ) : (
    <Navigate to={CONSTANTS.PROJECT_ROUTES.AUTHTICATION} />
  );
};

export default PrivateRoute;
