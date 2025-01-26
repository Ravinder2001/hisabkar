import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import CONSTANTS from "../utils/constant/Constant";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);

  return isUserLoggedIn ? <>{children}</> : <Navigate to={CONSTANTS.PROJECT_ROUTES.AUTHTICATION} />;
};

export default PrivateRoute;
