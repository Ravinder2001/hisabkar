import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import Logo from "../Logo/Logo";
import styles from "./style.module.css";
import LucideIcon from "../../utils/helpers/iconHelper";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";

function SidebarComponent() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <Sidebar className={styles.container} collapsed={isCollapsed} breakPoint="sm" toggled={!isCollapsed}>
      <Menu className={styles.menu}>
        <div className={styles.header}>
          <MenuItem icon={<LucideIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} />} onClick={toggleSidebar}>
            {isCollapsed ? null : <Logo />}
          </MenuItem>
          <MenuItem active={true} icon={<LucideIcon name="Home" />}>
            Home
          </MenuItem>
        </div>
        <div className={styles.footer}>
          <MenuItem icon={<LucideIcon name="LogOut" />}>User Icon</MenuItem>
          <MenuItem icon={<UserAvatar />} className="iconAvatarCon">
            Ravinder Singh
          </MenuItem>
        </div>
      </Menu>
    </Sidebar>
  );
}

export default SidebarComponent;
