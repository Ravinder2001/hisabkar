import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";

type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
};
function HomeNav(props: props) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div className={styles.options}>Start Spliting</div>,
    },
    {
      key: "2",
      label: (
        <div
          className={styles.options}
          onClick={() => {
            props.setSelectedOptions("login");
          }}
        >
          Login
        </div>
      ),
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.title}>Hisabkar</div>
      <div className={styles.centerBox}>
        <div className={styles.label}>Features</div>
        <div className={styles.label}>Support</div>
        <div className={styles.label}>Ratings</div>
      </div>

      <Dropdown menu={{ items }} placement="bottomLeft">
        <div className={styles.btn}>Hisabkar</div>
      </Dropdown>
    </div>
  );
}

export default HomeNav;
