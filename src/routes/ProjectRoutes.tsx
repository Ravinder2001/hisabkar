import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import ErrorFallback from "../Error/ErrorFallback";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import Home from "../pages/Home/Home";

function ProjectRoutes() {
  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Home />
            </PublicRoutes>
          }
        />

        <Route path="*" element={<ErrorFallback />} />
      </Routes>
    </Fragment>
  );
}

export default ProjectRoutes;
