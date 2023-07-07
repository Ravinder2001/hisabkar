import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import Drawer from "../Components/Organisms/Drawer/Drawer";
import styles from "../App.module.css";
function PrivateRoutes({ children }: any) {
  const user = useSelector((state: RootState) => state.UserSlice.user);
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );

  return user || guestUser ? (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Drawer />
      </div>

      <div className={styles.children}>{children}</div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoutes;
