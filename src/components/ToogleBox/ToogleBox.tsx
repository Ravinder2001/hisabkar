import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
type props = {
  checked: boolean;
  handleCustomCheck: () => void;
};
function ToogleBox(props: props) {
  return (
    <label className={styles.switch}>
      <input type="checkbox" onChange={props.handleCustomCheck} checked={props.checked} />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
}

export default ToogleBox;
