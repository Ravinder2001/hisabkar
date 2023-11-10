import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import ErrorFallback from "../Error/ErrorFallback";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

function ProjectRoutes() {
  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <div>Hi</div>
            </PublicRoutes>
          }
        />

        <Route path="*" element={<ErrorFallback />} />
      </Routes>
    </Fragment>
  );
}

export default ProjectRoutes;
