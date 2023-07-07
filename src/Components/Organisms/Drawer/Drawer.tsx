import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import { localStorageKey } from "../../../utils/Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../../../store/slices/UserSlice";
function Drawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const User = useSelector((state: RootState) => state.UserSlice);

  const [open, setOpen] = useState<boolean>(true);

  const handleLogout = () => {
    localStorage.removeItem(localStorageKey);
    navigate("/login");
    dispatch(Logout());
  };
  const handleBack = () => {
    navigate("/");
  };
  const handleProfile = () => {
    if (User.guestUser) {
      navigate("/login");
    }
  };

  return (
    <Sidebar
      collapsed={open}
      backgroundColor="#2b2a2a"
      // breakPoint="sm"
      className={styles.container}
      onMouseOver={() => setOpen(false)}
      onMouseOut={() => setOpen(true)}
    >
      <Menu>
        {!User.guestUser && (
          <>
            {location.pathname !== "/" && (
              <MenuItem
                icon={
                  <ReactIcons name="BiArrowBack" size={30} color="#545353" />
                }
                className={styles.menuItem}
                onClick={handleBack}
              >
                <div className={styles.box}>Back</div>
              </MenuItem>
            )}
          </>
        )}

        <MenuItem
          icon={
            <img
              src={User.image}
              alt="img"
              className={styles.img}
              onError={({ currentTarget }) => {
                currentTarget.src =
                  "https://img.icons8.com/?size=512&id=zXd7HOdmWPxf&format=png";
              }}
            />
          }
          className={styles.menuItem}
        >
          <div className={styles.box} onClick={handleProfile}>
            <div>{User.name}</div>
            {!User.guestUser ? (
              <div className={styles.id}>id_{User.id}</div>
            ) : (
              <div className={styles.id}>Login & Sign Up</div>
            )}
          </div>
        </MenuItem>
        {!User.guestUser && (
          <MenuItem
            icon={
              <ReactIcons name="RiLogoutBoxFill" size={30} color="#545353" />
            }
            onClick={handleLogout}
            className={styles.menuItem}
          >
            <div className={styles.box}>Logout</div>
          </MenuItem>
        )}
      </Menu>
    </Sidebar>
  );
}

export default Drawer;
