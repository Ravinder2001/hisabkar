import { Fragment } from "react";
import Header from "../../Organisms/Dashboard/Header/Header";
import Main from "../../Organisms/Dashboard/Main/Main";
import styles from "./styles.module.css"
function DashBoardTemplate() {
  return (
    <div className={styles.container}>
      <Header />
      <Main />
    </div>
  );
}

export default DashBoardTemplate;
