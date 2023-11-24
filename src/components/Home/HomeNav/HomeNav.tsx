import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";

type props = {
  handleModal: () => void;
};
function HomeNav(props: props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Hisabkar</div>
      <div className={styles.centerBox}>
        <div className={styles.label}>Features</div>
        <div className={styles.label}>Support</div>
      </div>

      <div className={styles.btn} onClick={props.handleModal}>Hisabkar</div>
    </div>
  );
}

export default HomeNav;
