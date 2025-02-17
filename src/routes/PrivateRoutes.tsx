import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { RootState } from "../store/store";
import CONSTANTS from "../utils/constant/Constant";
import styles from "../App.module.css";
import Navbar from "../components/Navbar/Navbar";
import useApiFetch from "../hooks/useAPIFetch";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);
  const { group_code } = useParams<{ group_code?: string }>();
  const { fetchData: joinGroup, response: joinRes } = useApiFetch("");

  React.useEffect(() => {
    if (isUserLoggedIn && group_code) {
      // Call backend API to join the group
      joinGroup(`${CONSTANTS.API_ROUTES.JOIN_GROUP}${group_code}`, { method: "GET" });
    }
  }, [isUserLoggedIn, group_code]);

  React.useEffect(() => {
    if (joinRes?.success) {
      // Redirect user to the group page after joining
      window.location.href = `${CONSTANTS.PROJECT_ROUTES.GROUP}/${joinRes.data.group_id}`;
    }
  }, [joinRes]);

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
