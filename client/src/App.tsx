import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useDispatch } from "react-redux";
import ErrorFallback from "./error/ErrorFallback";
import useApiFetch from "./hooks/useAPIFetch";
import CONSTANTS from "./utils/constant/Constant";
import { setGroupTypeList } from "./store/features/dataSlice";
import Loader from "./components/Loader/Loader";
// import { subscribeUser } from "./utils/helpers/serviceWorkerHelper";
import SiteUnavailable from "./pages/SiteUnavailable/SiteUnavailable";
import ProjectRoutes from "./routes/ProjectRoutes";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { token, id } = useSelector((state: RootState) => state.user);

  const { fetchData: fetchServerHealth, response: serverHealthRes, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.SERVER_HEALTH);
  const { fetchData: fetchGroupTypeList, response: groupTypeRes } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_TYPE_LIST);

  // Fetch server health only once on mount
  useEffect(() => {
    fetchServerHealth();
  }, [fetchServerHealth]);

  // Fetch group types once the server's healthy and we have a token. Don't
  // gate on expiry here — the access token is short-lived by design, and
  // axiosInstance.ts's response interceptor silently refreshes it via the
  // httpOnly cookie on the first 401 rather than forcing a logout up front.
  useEffect(() => {
    if (serverHealthRes?.success === 1 && token) {
      fetchGroupTypeList();
      if (window.NREUM) {
        window.NREUM.setCustomAttribute("userId", id);
      }
    }
  }, [serverHealthRes, token, id, fetchGroupTypeList]);

  // Update Redux store with group type list
  useEffect(() => {
    if (groupTypeRes?.success === 1) {
      dispatch(setGroupTypeList(groupTypeRes.data));
    }
  }, [groupTypeRes, dispatch]);

  // Render logic
  if (isLoading || !serverHealthRes) {
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
