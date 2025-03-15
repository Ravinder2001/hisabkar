import React, { lazy, useEffect } from "react";
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
import { setExpenseTypeList, setGroupTypeList } from "./store/features/dataSlice";
import Loader from "./components/Loader/Loader";
import { subscribeUser } from "./utils/helpers/serviceWorkerHelper";
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
  const { fetchData: fetchExpenseTypeList, response: expenseTypeRes } = useApiFetch(CONSTANTS.API_ROUTES.EXPENSE_TYPE_LIST);
  const { fetchData: fetchGroupTypeList, response: groupTypeRes } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_TYPE_LIST);

  // Fetch server health only once on mount
  useEffect(() => {
    fetchServerHealth();
  }, [fetchServerHealth]);

  // Fetch expense and group types only when server is healthy and token is valid
  useEffect(() => {
    if (serverHealthRes?.success === 1 && token && !isTokenExpired(token)) {
      fetchExpenseTypeList();
      fetchGroupTypeList();
      subscribeUser();
      if (window.NREUM) {
        window.NREUM.setCustomAttribute("userId", id);
      }
    } else if (token && isTokenExpired(token)) {
      dispatch(setUserLoggedOut());
      dispatch(setExpenseTypeList([]));
    }
  }, [serverHealthRes, token, id, fetchExpenseTypeList, fetchGroupTypeList, dispatch]);

  // Update Redux store with expense type list
  useEffect(() => {
    if (expenseTypeRes?.success === 1) {
      dispatch(setExpenseTypeList(expenseTypeRes.data));
    }
  }, [expenseTypeRes, dispatch]);

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
