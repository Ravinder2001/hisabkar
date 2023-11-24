// Create a new React component, e.g., App.js
import React from 'react';
import styles from './style.module.scss'; // Import the module CSS file

const Welcome = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <span className={styles.block}></span>
          <h1>hisabkar.com<span></span></h1>
        </div>

        <div className={styles.role}>
          <div className={styles.block}></div>
          <p>Divide, Conquer, Enjoy!</p>
        </div>
      </div>

    </div>
  );
}

export default Welcome;
