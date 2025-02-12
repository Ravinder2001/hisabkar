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

// Lazy load the component
const ProjectRoutes = withSuspense(
  lazy(() => import("./routes/ProjectRoutes")),
  <Loader />
);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.user);

  const { fetchData: fetchExpenseTypeList, response } = useApiFetch(CONSTANTS.API_ROUTES.EXPENSE_TYPE_LIST);
  const { fetchData: fetchGroupTypeList, response: groupTypeRes } = useApiFetch(CONSTANTS.API_ROUTES.GROUP_TYPE_LIST);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      dispatch(setUserLoggedOut());
      dispatch(setExpenseTypeList([]));
      return;
    }
    fetchExpenseTypeList();
    fetchGroupTypeList();
    subscribeUser();
  }, [token, dispatch]);

  useEffect(() => {
    if (response?.success == 1) {
      dispatch(setExpenseTypeList(response.data));
    }
  }, [response]);

  useEffect(() => {
    if (groupTypeRes?.success == 1) {
      dispatch(setGroupTypeList(groupTypeRes.data));
    }
  }, [groupTypeRes]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProjectRoutes />
    </ErrorBoundary>
  );
};

export default App;
