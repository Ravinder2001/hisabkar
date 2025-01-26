import React, { lazy, useEffect } from "react";
import { withSuspense } from "./hoc/withSuspense";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useDispatch } from "react-redux";
import ErrorFallback from "./error/ErrorFallback";
import { setUserLoggedOut } from "./store/features/userSlice";
import { isTokenExpired } from "./utils/helpers/authHelper";

// Lazy load the component
const ProjectRoutes = withSuspense(
  lazy(() => import("./routes/ProjectRoutes")),
  <div>...Loading</div>
);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      dispatch(setUserLoggedOut());
    }
  }, [token, dispatch]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProjectRoutes />
    </ErrorBoundary>
  );
};

export default App;
