import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router";
import { HomeRoute } from "../utils/Constants";
function PrivateRoutes({ children }: any) {
  const User = useSelector((state: RootState) => state.UserSlice.status);
  return User ? <div>{children}</div> : <Navigate to={HomeRoute} />;
}

export default PrivateRoutes;
