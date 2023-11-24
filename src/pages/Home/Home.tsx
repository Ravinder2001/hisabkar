import React, { useState } from "react";
import HomeNav from "../../components/Home/HomeNav/HomeNav";
import styles from "./style.module.scss";
import DetailContainer from "../../components/Home/DetailContainer/DetailContainer";
import ImageContainer from "../../components/Home/ImageContainer/ImageContainer";
import AddGroupModal from "../../components/AddGroupModal/AddGroupModal";
import video from "../../assets/intro.mp4";
function Home() {
  const [modalStatus, setModalStatus] = useState(false);
  const handleModal = () => {
    setModalStatus(!modalStatus);
  };
  const [flag, setFlag] = useState(true);
  return flag ? (
    <div style={{ width: "100%", height: "100vh", background: "#E8E8E8" }}>
      <video width="100%" height="100%" autoPlay muted>
        <source src={video} type="video/mp4" width="100%" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <div className={styles.container}>
      <HomeNav handleModal={handleModal} />
      <div className={styles.body}>
        <div className={styles.leftBox}>
          <DetailContainer handleModal={handleModal} />
        </div>
        <div className={styles.rightBox}>
          <ImageContainer />
        </div>
      </div>
      <AddGroupModal status={modalStatus} handleModal={handleModal} />{" "}
    </div>
  );
}

export default Home;
