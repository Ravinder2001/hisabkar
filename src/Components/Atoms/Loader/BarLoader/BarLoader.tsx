import React from "react";
import styles from "./styles.module.css";
function BarLoader() {
  return (
    <div className={styles.loadingWave}>
      <div className={styles.loadingBar}></div>
      <div className={styles.loadingBar}></div>
      <div className={styles.loadingBar}></div>
      <div className={styles.loadingBar}></div>
    </div>
  );
}

export default BarLoader;
