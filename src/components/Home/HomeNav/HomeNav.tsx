import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./style.module.scss";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import ContactModal from "../../ContactModal/ContactModal";

type props = {
  handleModal: () => void;
};
function HomeNav(props: props) {
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(!open);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>Hisabkar</div>
      <div className={styles.centerBox}>
        <div className={styles.label} onClick={handleModal}>Contact Us</div>
      </div>
      <div className={styles.btn} onClick={props.handleModal}>
        Hisabkar
      </div>
      <ContactModal status={open} handleModal={handleModal} />
    </div>
  );
}

export default HomeNav;
