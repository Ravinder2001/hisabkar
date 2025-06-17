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

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Add this to get current URL
  const [isOpen, setIsOpen] = useState(false);

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
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Helper function to determine active class
  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "text-blue-600 font-semibold px-3 py-2 rounded-md text-sm" // Active styles
      : "text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"; // Default styles
  };

  // Helper function for mobile menu active class
  const getMobileLinkClass = (path: string) => {
    return location.pathname === path
      ? "text-blue-600 font-semibold block px-3 py-2 rounded-md text-base"
      : "text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium";
  };

  return (
    <nav className={`${styles.container} border shadow`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Hisabkar<span className="text-black">.</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4 justify-items-end">
              <Link to="/" className={getLinkClass("/")}>
                Home
              </Link>
              <Link to={CONSTANTS.PROJECT_ROUTES.PROFILE} className={getLinkClass(CONSTANTS.PROJECT_ROUTES.PROFILE)}>
                Profile
              </Link>
              <Link to={CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES} className={getLinkClass(CONSTANTS.PROJECT_ROUTES.OPEN_EXPENSES)}>
                Open Expenses
              </Link>
              <Link to="/support" className={getLinkClass("/support")}>
                Support
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-center">
            <Link to="/" className={getMobileLinkClass("/")}>
              Home
            </Link>
            <Link to={CONSTANTS.PROJECT_ROUTES.PROFILE} onClick={toggleMenu} className={getMobileLinkClass(CONSTANTS.PROJECT_ROUTES.PROFILE)}>
              Profile
            </Link>
            <Link to="/support" className={getMobileLinkClass("/support")}>
              Support
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
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
