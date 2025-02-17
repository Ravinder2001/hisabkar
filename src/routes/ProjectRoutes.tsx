import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoutes";
import ErrorFallback from "../error/ErrorFallback";
import CONSTANTS from "../utils/constant/Constant";
import Home from "../pages/Home/Home";
import PrivateRoute from "./PrivateRoutes";
import Authentication from "../pages/Authentication/Authentication";
import Group from "../pages/GroupDetails/GroupDetails";
import JoinGroup from "../pages/JoinGroup/JoinGroup";
import Profile from "../pages/Profile/Profile";
import LegalPage from "../pages/Legals/Legals";

// import StaffGroups from "../pages/Admin/StaffGroups/StaffGroups";

const ProjectRoutes = () => {
  return (
    <Routes>
      {/* Private Routes */}
      <Route
        path={CONSTANTS.PROJECT_ROUTES.HOME}
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path={CONSTANTS.PROJECT_ROUTES.GROUP + "/:group_id"}
        element={
          <PrivateRoute>
            <Group />
          </PrivateRoute>
        }
      />
      <Route
        path={CONSTANTS.PROJECT_ROUTES.JOIN_GROUP + "/:group_code"}
        element={
          <PrivateRoute>
            <JoinGroup />
          </PrivateRoute>
        }
      />
      <Route
        path={CONSTANTS.PROJECT_ROUTES.PROFILE}
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Public Routes */}
      <Route
        path={CONSTANTS.PROJECT_ROUTES.AUTHTICATION}
        element={
          <PublicRoute>
            <Authentication />
          </PublicRoute>
        }
      />
      <Route
        path={CONSTANTS.PROJECT_ROUTES.LEGAL + "/:pageType"}
        element={
          <PublicRoute>
            <LegalPage />
          </PublicRoute>
        }
      />

      <Route path="*" element={<ErrorFallback />} />
    </Routes>
  );
};

export default ProjectRoutes;
