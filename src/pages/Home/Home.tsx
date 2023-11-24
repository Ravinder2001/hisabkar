import React, { useState } from "react";
import HomeNav from "../../components/Home/HomeNav/HomeNav";
import styles from "./style.module.scss";
import DetailContainer from "../../components/Home/DetailContainer/DetailContainer";
import ImageContainer from "../../components/Home/ImageContainer/ImageContainer";
import AddGroupModal from "../../components/AddGroupModal/AddGroupModal";
function Home() {
  const [modalStatus, setModalStatus] = useState(true);
  const handleModal = () => {
    setModalStatus(!modalStatus);
  };
  return (
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

      <AddGroupModal status={modalStatus} handleModal={handleModal} />
    </div>
  );
}

export default Home;
