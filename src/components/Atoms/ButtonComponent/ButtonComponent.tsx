import React from "react";
import styles from "./style.module.css";

type PropsTyps = {
  text: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  isLoading?: boolean;
};

function ButtonComponent(props: PropsTyps) {
  return (
    <button type={props.type ?? "submit"} className={styles.btn} onClick={props.onClick}>
      {props.isLoading ? <span className={styles.loader}></span> : props.text}
    </button>
  );
}

export default ButtonComponent;
