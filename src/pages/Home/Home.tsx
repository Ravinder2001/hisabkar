import React from "react";
import HomeNav from "../../components/Home/HomeNav/HomeNav";
import styles from "./style.module.scss";
import DetailContainer from "../../components/Home/DetailContainer/DetailContainer";
import ImageContainer from "../../components/Home/ImageContainer/ImageContainer";
function Home() {
  return (
    <div className={styles.container}>
      <HomeNav />
      <div className={styles.body}>
        <div className={styles.leftBox}>
          <DetailContainer />
        </div>
        <div className={styles.rightBox}>
          <ImageContainer />
        </div>
      </div>
    </div>
  );
}

export default Home;
