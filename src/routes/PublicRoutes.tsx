import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

function PublicRoutes({ children }: any) {
  const user = useSelector((state: RootState) => state.UserSlice.user);

  return user ? <Navigate to="/" /> : <div>{children}</div>;
}

export default PublicRoutes;
