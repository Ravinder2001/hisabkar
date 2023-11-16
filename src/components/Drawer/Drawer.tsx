import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DrawerItems from "../DrawerItems/DrawerItems";

import styles from "./styles.module.scss";
import { Logout } from "../../store/slices/UserSlice";
import { localStorageKey } from "../../utils/Constants";
import { setIndex } from "../../store/slices/DrawerSlice";

function Drawer() {
  const dispatch = useDispatch();

  return (
    <div className={styles.drawer}>
      <div className={styles.header_items}>
        <DrawerItems
          label="Home"
          IconColor="#df3096"
          IconName="Home"
          IconSize={20}
          index={0}
          handleClick={() => {
            dispatch(setIndex(0));
          }}
        />
      </div>
      <div className={styles.footer_items}>
        <DrawerItems
          label="Logout"
          IconColor="#ee301b"
          IconName="LogOut"
          IconSize={20}
          handleClick={() => {
            localStorage.removeItem(localStorageKey);
            dispatch(Logout());
            dispatch(setIndex(0));
          }}
          index={-1}
        />
      </div>
    </div>
  );
}

export default Drawer;
