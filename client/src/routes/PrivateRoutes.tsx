import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import CONSTANTS from "../utils/constant/Constant";
import styles from "../App.module.css";
import Navbar from "../components/Navbar/Navbar";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!isUserLoggedIn) {
    return <Navigate to={CONSTANTS.PROJECT_ROUTES.AUTHTICATION} />;
  }

  // Group Detail pages render their own GroupDetailHeader instead of this
  // app-wide navbar — skip the wrapper too so it doesn't leave a stray gap.
  const isGroupDetailPage = location.pathname.includes("/group/") && !location.pathname.includes("/join-group");

  return (
    <div className={styles.privateCon}>
      {!isGroupDetailPage && (
        <div className={styles.navBar}>
          <Navbar />
        </div>
      )}
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default PrivateRoute;
