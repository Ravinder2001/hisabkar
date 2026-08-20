import React from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { useDispatch } from "react-redux";
import { setUserLoggedOut } from "../../store/features/userSlice";
import CONSTANTS from "../../utils/constant/Constant";

const dropdownStyle: React.CSSProperties = {
  background: "var(--hk-surface)",
  color: "var(--hk-ink)",
  border: "1px solid var(--hk-border)",
};

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Group Detail pages render their own GroupDetailHeader (back button, group
  // name/avatars, admin menu) in place of this app-wide navbar.
  const isGroupDetailPage = location.pathname.includes("/group/") && !location.pathname.includes("/join-group");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(setUserLoggedOut());
  };

  const UserMenu = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar />
        </DropdownMenuTrigger>
        <DropdownMenuContent style={dropdownStyle}>
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Helper function to determine active class
  const getLinkClass = () => "font-semibold px-3 py-2 rounded-md text-sm";

  // Helper function for mobile menu active class
  const getMobileLinkClass = () => "font-semibold block px-3 py-2 rounded-md text-base";

  const linkStyle = (path: string): React.CSSProperties => ({
    color: location.pathname === path ? "var(--hk-accent-strong)" : "var(--hk-ink-soft)",
  });

  if (isGroupDetailPage) return null;

  return (
    <nav className={styles.container}>
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className={styles.mark}>₹</span>
              <span className={styles.wordmark}>hisabkar</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4 justify-items-end">
              <Link to="/" className={getLinkClass()} style={linkStyle("/")}>
                Home
              </Link>
              <Link to={CONSTANTS.PROJECT_ROUTES.PROFILE} className={getLinkClass()} style={linkStyle(CONSTANTS.PROJECT_ROUTES.PROFILE)}>
                Profile
              </Link>
              <Link to={CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES} className={getLinkClass()} style={linkStyle(CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES)}>
                Open Expenses
              </Link>
              <Link to="/support" className={getLinkClass()} style={linkStyle("/support")}>
                Support
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <UserMenu />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleMenu} className="hk-icon-btn">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" style={{ borderTop: "1px solid var(--hk-border)" }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-center gap-2">
            <Link to="/" className={getMobileLinkClass()} style={linkStyle("/")}>
              Home
            </Link>
            <Link
              to={CONSTANTS.PROJECT_ROUTES.PROFILE}
              onClick={toggleMenu}
              className={getMobileLinkClass()}
              style={linkStyle(CONSTANTS.PROJECT_ROUTES.PROFILE)}
            >
              Profile
            </Link>
            <Link
              to={CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES}
              onClick={toggleMenu}
              className={getMobileLinkClass()}
              style={linkStyle(CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES)}
            >
              Open Expenses
            </Link>
            <Link to="/support" className={getMobileLinkClass()} style={linkStyle("/support")}>
              Support
            </Link>
          </div>
          <div className="pt-4 pb-3" style={{ borderTop: "1px solid var(--hk-border)" }}>
            <div className="flex items-center px-5">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
