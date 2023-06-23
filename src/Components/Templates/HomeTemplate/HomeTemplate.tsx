import { useState } from "react";
import List from "../../Organisms/Home/List/List";
import Footer from "../../Organisms/Home/Footer/Footer";
import Header from "../../Organisms/Home/Header/Header";
import styles from "./styles.module.css";
import { ChangeEvent } from "react";

function HomeTemplate() {
  return (
    <div className={styles.container}>
      <Header />
      <List />
      <Footer />
    </div>
  );
}

export default HomeTemplate;
