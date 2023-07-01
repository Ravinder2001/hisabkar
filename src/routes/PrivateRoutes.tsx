import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

function PrivateRoutes({ children }: any) {
  const user = useSelector((state: RootState) => state.UserSlice.user);
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );

  return user || guestUser ? <div>{children}</div> : <Navigate to="/login" />;
}

export default PrivateRoutes;
