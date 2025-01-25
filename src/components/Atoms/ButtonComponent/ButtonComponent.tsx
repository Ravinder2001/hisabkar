import React from "react";
import styles from "./style.module.css";

type PropsTyps = {
  text: string;
};

function ButtonComponent(props: PropsTyps) {
  return <button className={styles.btn}>{props.text}</button>;
}

export default ButtonComponent;
