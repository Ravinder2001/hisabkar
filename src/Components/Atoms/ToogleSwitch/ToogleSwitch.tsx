import React from "react";
import styles from "./styles.module.css";

type toogleType = {
  value: boolean;
  handleChange: () => void;
};
function ToogleSwitch(props: toogleType) {
  return (
    <div>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={props.value}
          onChange={props.handleChange}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
}

export default ToogleSwitch;
