import React from "react";
import styles from "./style.module.scss";
import LucideIcons from "../../assets/Icons/Icons";
import Base64Images from "../../assets/base64Images/Base64Images";
function TableBody() {
  const ActiveBox = () => {
    return (
      <div className={styles.activeBox}>
        <LucideIcons name="Dot" color="#027A48" />
        <div className={styles.activeText}>Completed</div>
      </div>
    );
  };
  return (
    <div className={styles.row}>
      <div className={styles.col_1}>
        <Base64Images name="Monthly" />
        <div>Expense of June</div>
      </div>
      <div className={styles.col_3}>
        <ActiveBox />
      </div>
      <div className={styles.col_2}>Ravi</div>
      <div className={styles.col_4}>Monthly Expense</div>
      <div className={styles.col_5}>
        <div className={styles.cardWrapperAccounts}>
          <div className={styles.cardAccounts}>
            <img
              src="https://api.multiavatar.com/223.png"
              width="100%"
              height="100%"
              
              alt="dp"
            />
          </div>
          <div className={styles.cardAccounts}>
            <img
              src="https://api.multiavatar.com/34.png"
              width="100%"
              height="100%"
              onError={({ currentTarget }) => {
                currentTarget.src = "https://img.icons8.com/?size=512&id=zXd7HOdmWPxf&format=png";
              }}
              alt="dp"
            />
          </div>
          <div className={styles.cardAccounts}>
            <img
              src="https://api.multiavatar.com/54.png"
              width="100%"
              height="100%"
              onError={({ currentTarget }) => {
                currentTarget.src = "https://img.icons8.com/?size=512&id=zXd7HOdmWPxf&format=png";
              }}
              alt="dp"
            />
          </div>
        </div>
      </div>
      <div className={styles.col_6}>4d</div>
      <div className={styles.col_7}>
        <div>
          <LucideIcons name="Trash" color="#0aa485" />
        </div>
        <div>
          <LucideIcons name="Edit" color="#51068e" />
        </div>
      </div>
    </div>
  );
}

export default TableBody;
