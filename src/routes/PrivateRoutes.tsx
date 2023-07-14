import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import NavBar from "../Components/Organisms/Drawer/NavBar";
import { RootState } from "../store/store";

import styles from "../App.module.css";

function PrivateRoutes({ children }: any) {
  const user = useSelector((state: RootState) => state.UserSlice.user);
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );

  return user || guestUser ? (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.children}>{children}</div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoutes;
