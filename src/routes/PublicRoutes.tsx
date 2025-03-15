import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import Navbar from "../components/Navbar/Navbar";
import styles from "../App.module.css";

type PublicRouteProps = {
  children: React.ReactNode;
  allowedRoutes?: string[]; // Define allowed routes that are accessible to both public & private users
};

const PublicRoute = ({ children, allowedRoutes = [] }: PublicRouteProps) => {
  const { isUserLoggedIn, reDirectURL } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  const isAllowedRoute = allowedRoutes.includes(location.pathname);

  // If user is logged in and the route is not in the allowed list, redirect them
  if (isUserLoggedIn && !isAllowedRoute) {
    return <Navigate to={reDirectURL} />;
  }

  return isAllowedRoute && isUserLoggedIn ? (
    <div className={styles.privateCon}>
      <div className={styles.navBar}>
        <Navbar />
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default PublicRoute;
