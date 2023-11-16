import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import ErrorFallback from "../Error/ErrorFallback";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import Home from "../pages/Home/Home";
import { DashboardRoute, HomeRoute } from "../utils/Constants";
import Dashboard from "../pages/Dashboard/Dashboard";

function ProjectRoutes() {
  return (
    <Fragment>
      <Routes>
        <Route
          path={HomeRoute}
          element={
            <PublicRoutes>
              <Home />
            </PublicRoutes>
          }
        />
        <Route
          path={DashboardRoute}
          element={
            <PrivateRoutes>
              <Dashboard />
            </PrivateRoutes>
          }
        />

        <Route path="*" element={<ErrorFallback />} />
      </Routes>
    </Fragment>
  );
}

export default ProjectRoutes;
