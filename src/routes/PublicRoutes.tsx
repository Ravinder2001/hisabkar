import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router";
import { DashboardRoute, HomeRoute } from "../utils/Constants";

function PublicRoutes({ children }: any) {
  const User = useSelector((state: RootState) => state.UserSlice.status);
  return !User ? <div>{children}</div> : <Navigate to={DashboardRoute} />;
}

export default PublicRoutes;
