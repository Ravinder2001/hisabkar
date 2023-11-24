import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { ExpenseRoute } from "../../../utils/Constants";
import RatingComponent from "../../RatingComponent/RatingComponent";
type props = {
  handleModal: () => void;
};
function DetailContainer(props: props) {
  const navigate = useNavigate();

  const GroupName = useSelector((state: RootState) => state.ExpenseSlice.group_name);

  const handleClick = () => {
    navigate(ExpenseRoute);
  };
  return (
    <div className={styles.container}>
      <RatingComponent />
      <div className={styles.subHeading}>
        Tired of those post-trip payment disputes with friends? Say goodbye to those headaches with Hisabkar! 🌟
      </div>
      <div className={styles.btn} onClick={props.handleModal}>
        Try Hisabkar
      </div>

      {GroupName.length ? (
        <div className={styles.recent}>
          <div className={styles.recentHead}>Recent Expense:</div>
          <div className={styles.recentName} onClick={handleClick}>
            {GroupName}
          </div>
        </div>
      ) : null}

      <div className={styles.footer}>
        <div className={styles.label}>Features</div>
        <div className={styles.label}>Support</div>
      </div>
    </div>
  );
}

export default DetailContainer;
