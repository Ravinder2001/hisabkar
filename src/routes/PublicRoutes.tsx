import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import CONSTANTS from "../utils/constant/Constant";

type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isUserLoggedIn } = useSelector((state: RootState) => state.user);

  return !isUserLoggedIn ? children : <Navigate to={CONSTANTS.PROJECT_ROUTES.HOME} />;
};

export default PublicRoute;
