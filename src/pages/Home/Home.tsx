import React, { useState } from "react";
import HomeNav from "../../components/Home/HomeNav/HomeNav";
import styles from "./style.module.scss";
import DetailContainer from "../../components/Home/DetailContainer/DetailContainer";
import ImageContainer from "../../components/Home/ImageContainer/ImageContainer";
import SignUpContainer from "../../components/Home/SignUpContainer/SignUpContainer";
import LoginContainer from "../../components/Home/LoginContainer/LoginContainer";
import AddGroupModal from "../../components/AddGroupModal/AddGroupModal";
function Home() {
  const [selectedOptions, setSelectedOptions] = useState<string>("");
  const [modalStatus, setModalStatus] = useState(false);
  const handleModal = () => {
    setModalStatus(!modalStatus);
  };
  return (
    <div className={styles.container}>
      <HomeNav setSelectedOptions={setSelectedOptions} handleModal={handleModal}/>
      <div className={styles.body}>
        <div className={styles.leftBox}>
          <DetailContainer setSelectedOptions={setSelectedOptions} handleModal={handleModal}/>
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
      <AddGroupModal status={modalStatus} handleModal={handleModal} />
    </div>
  );
}

export default Home;
