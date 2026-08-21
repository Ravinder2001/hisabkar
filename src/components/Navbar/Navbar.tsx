import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { useDispatch } from "react-redux";
import { setUserLoggedOut } from "../../store/features/userSlice";
import CONSTANTS from "../../utils/constant/Constant";
import useApiFetch from "../../hooks/useAPIFetch";
import logo from "../../assets/images/logo.png";

const dropdownStyle: React.CSSProperties = {
  background: "var(--hk-surface)",
  color: "var(--hk-ink)",
  border: "1px solid var(--hk-border)",
};

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { fetchData: postLogout } = useApiFetch("");

  // Group Detail pages render their own GroupDetailHeader (back button, group
  // name/avatars, admin menu) in place of this app-wide navbar.
  const isGroupDetailPage = location.pathname.includes("/group/") && !location.pathname.includes("/join-group");

  const handleLogout = () => {
    // Fire-and-forget: revokes the session server-side (so the refresh
    // cookie can't mint new access tokens anymore) but doesn't block the
    // local sign-out on it succeeding.
    postLogout(CONSTANTS.API_ROUTES.LOGOUT, { method: "POST" });
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

  const MobileUserMenu = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar />
        </DropdownMenuTrigger>
        <DropdownMenuContent style={dropdownStyle} align="end">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={CONSTANTS.PROJECT_ROUTES.PROFILE}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES}>Open Expenses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/support">Support</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator style={{ background: "var(--hk-border)" }} />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Helper function to determine active class
  const getLinkClass = () => "font-semibold px-3 py-2 rounded-md text-sm";

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
              <img src={logo} alt="hisabkar" className={styles.mark} />
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
            <MobileUserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
