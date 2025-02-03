import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isUserLoggedIn, reDirectURL } = useSelector((state: RootState) => state.user);

  return !isUserLoggedIn ? <>{children}</> : <Navigate to={reDirectURL} />;
};

export default PublicRoute;
