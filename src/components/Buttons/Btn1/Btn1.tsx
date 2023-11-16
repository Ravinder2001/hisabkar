import React from "react";
import styles from "./style.module.scss";

type props = {
  text: string;
};
function Btn1(props: props) {
  return <button className={styles.button}>{props.text}</button>;
}

export default Btn1;
