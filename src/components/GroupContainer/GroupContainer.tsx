import React from "react";
import styles from "./style.module.scss";
import LucideIcons from "../../assets/Icons/Icons";
import TableBody from "./TableBody";
import Btn1 from "../Buttons/Btn1/Btn1";

type props = {
  handleModal: () => void;
};
function GroupContainer(props: props) {
  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <div className={styles.header}>
          <div className={styles.heading}>Group List</div>
          <div className={styles.groupCount}>10 groups</div>
        </div>
        <div>
          <div className={styles.createBtn} onClick={props.handleModal}>
            <Btn1 text="Create New Expense" />
          </div>
        </div>
      </div>
      <div className={styles.tableHeader}>
        <div className={styles.col_1}>Group Name</div>
        <div className={styles.col_3}>Status</div>
        <div className={styles.col_2}>Owner</div>
        <div className={styles.col_4}>Type</div>
        <div className={styles.col_5}>Members</div>
        <div className={styles.col_6}>Time</div>
        <div className={styles.col_7}></div>
      </div>
      <div className={styles.tableBody}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <TableBody />
        ))}
      </div>
    </div>
  );
}

export default GroupContainer;
