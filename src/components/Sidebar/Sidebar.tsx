import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import styles from "./style.module.css";
import LucideIcon from "../../utils/helpers/iconHelper";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoggedOut } from "../../store/features/userSlice";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import CONSTANTS from "../../utils/constant/Constant";
// import { useLocation } from "react-router-dom";

function SidebarComponent() {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user);
  // const location = useLocation(); // Get the current route

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    dispatch(setUserLoggedOut());
  };

  // Function to check if the current route matches a menu item
  // const isActive = (path: string) => {
  //   console.log(location.pathname);
  //   return location.pathname === path;
  // };

  return (
    <Sidebar className={styles.container} collapsed={isCollapsed} toggled={!isCollapsed}>
      <Menu className={styles.menu}>
        <div className={styles.header}>
          <MenuItem icon={<LucideIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} />} onClick={toggleSidebar}>
            {isCollapsed ? null : (
              <div className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Hisabkar<span className="text-black">.</span>
              </div>
            )}
          </MenuItem>
          <MenuItem active icon={<LucideIcon name="Home" />} component={<Link to={CONSTANTS.PROJECT_ROUTES.HOME} />}>
            Home
          </MenuItem>
        </div>
        <div className={styles.footer}>
          <MenuItem icon={<LucideIcon name="LogOut" />} onClick={handleLogout}>
            Logout
          </MenuItem>
          <MenuItem icon={<UserAvatar />} className="iconAvatarCon">
            {userData.name}
          </MenuItem>
        </div>
      </Menu>
    </Sidebar>
  );
}

export default SidebarComponent;
