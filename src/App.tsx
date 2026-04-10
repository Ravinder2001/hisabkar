import React, { lazy, useEffect, useState } from "react";
import { withSuspense } from "./hoc/withSuspense";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useDispatch } from "react-redux";
import ErrorFallback from "./error/ErrorFallback";
import { setUserLoggedOut } from "./store/features/userSlice";
import { isTokenExpired } from "./utils/helpers/authHelper";
import useApiFetch from "./hooks/useAPIFetch";
import CONSTANTS from "./utils/constant/Constant";
import { setGroupTypeList } from "./store/features/dataSlice";
import Loader from "./components/Loader/Loader";
// import { subscribeUser } from "./utils/helpers/serviceWorkerHelper";
import SiteUnavailable from "./pages/SiteUnavailable/SiteUnavailable";

// Lazy load the component
const ProjectRoutes = withSuspense(
  lazy(() => import("./routes/ProjectRoutes")),
  <Loader />
);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { token, id } = useSelector((state: RootState) => state.user);

  const { fetchData: fetchServerHealth, response: serverHealthRes, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.SERVER_HEALTH);
  const { fetchData: fetchGroupTypeList, response: groupTypeRes } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_TYPE_LIST);

  const [showStartup, setShowStartup] = useState(true);

  // Fetch server health only once on mount
  useEffect(() => {
    fetchServerHealth();

    // Ensure startup screen shows for at least 3.5 seconds
    const timer = setTimeout(() => {
      setShowStartup(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [fetchServerHealth]);

  // Fetch group types only when server is healthy and token is valid
  useEffect(() => {
    if (!showStartup && serverHealthRes?.success === 1 && token && !isTokenExpired(token)) {
      fetchGroupTypeList();
      if (window.NREUM) {
        window.NREUM.setCustomAttribute("userId", id);
      }
    } else if (token && isTokenExpired(token)) {
      dispatch(setUserLoggedOut());
    }
  }, [serverHealthRes, token, id, fetchGroupTypeList, dispatch, showStartup]);

  // Update Redux store with group type list
  useEffect(() => {
    if (groupTypeRes?.success === 1) {
      dispatch(setGroupTypeList(groupTypeRes.data));
    }
  }, [groupTypeRes, dispatch]);

  // Render logic
  if (isLoading || !serverHealthRes || showStartup) {
    return <Loader />;
  }

  if (serverHealthRes?.success !== 1) {
    return <SiteUnavailable />; // Show maintenance page if server/db is down
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProjectRoutes />
    </ErrorBoundary>
  );
};

export default App;
