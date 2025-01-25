import React from "react";
import styles from "./style.module.css";

type PropsTyps = {
  text: string;
  onClick?: () => void;
};

function ButtonComponent(props: PropsTyps) {
  return (
    <button className={styles.btn} onClick={props.onClick}>
      {props.text}
    </button>
  );
}

export default ButtonComponent;
