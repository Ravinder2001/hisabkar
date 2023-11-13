import React, { useState } from "react";
import HomeNav from "../../components/Home/HomeNav/HomeNav";
import styles from "./style.module.scss";
import DetailContainer from "../../components/Home/DetailContainer/DetailContainer";
import ImageContainer from "../../components/Home/ImageContainer/ImageContainer";
import SignUpContainer from "../../components/Home/SignUpContainer/SignUpContainer";
import LoginContainer from "../../components/Home/LoginContainer/LoginContainer";
function Home() {
  const [selectedOptions, setSelectedOptions] = useState<string>("sign");
  return (
    <div className={styles.container}>
      <HomeNav setSelectedOptions={setSelectedOptions} />
      <div className={styles.body}>
        <div className={styles.leftBox}>
          <DetailContainer setSelectedOptions={setSelectedOptions} />
        </div>
        <div className={styles.rightBox}>
          {selectedOptions == "sign" ? (
            <SignUpContainer setSelectedOptions={setSelectedOptions} />
          ) : selectedOptions == "login" ? (
            <LoginContainer setSelectedOptions={setSelectedOptions} />
          ) : (
            <ImageContainer />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
