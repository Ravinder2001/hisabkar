import React from "react";
import styles from "./style.module.scss";
import logo from "../../../assets/images/Paying_Bills.png";
function ImageContainer() {
  return <img src={logo} alt="" className={styles.img} />;
}

export default ImageContainer;
