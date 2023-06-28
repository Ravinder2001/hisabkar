import React from "react";
import styles from "./styles.module.css";
import moment from "moment";
import ReactIcons from "../ReactIcons/ReactIcons";
import { formatTime } from "../../../utils/Function";

type GroupCardType = {
  name: string;
  des: string;
  members: { image: string; name: string }[];
  amount: number;
  time: string;
};

function GroupCard(props: GroupCardType) {
  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardWrapperAccounts}>
          {props.members.length > 2 && (
            <div className={styles.cardScore}>+{props.members.length - 2}</div>
          )}

          {props.members.slice(0, 2).map((item) => (
            <div className={styles.cardAccounts}>
              <img
                src={item.image}
                width="100%"
                height="100%"
                onError={({ currentTarget }) => {
                  currentTarget.src =
                    "https://img.icons8.com/?size=512&id=zXd7HOdmWPxf&format=png";
                }}
                alt="dp"
              />
            </div>
          ))}
        </div>
        <div className={styles.cardMenu}>
          <ReactIcons name="AiFillDelete" size={25} />
        </div>
      </div>
      <div className={styles.cardTitle}>{props.name}</div>
      <div className={styles.cardSubtitle}>{props.des}</div>
      <div>
        <div className={styles.heading}>Members</div>
        <ul>
          {props.members.map((item) => (
            <li>{item.name}</li>
          ))}
        </ul>
      </div>
      <div className={styles.cardIndicatorTime}>
        {formatTime(props.time)}
      </div>
      {/* <div className={styles.cardIndicator}>
        <span className={styles.cardIndicatorAmount}>135</span> Works /{" "}
        <span className={styles.cardIndicatorPercentage}>45%</span>
      </div>
      <div className={styles.cardProgress}>
        <progress max="100" value="40"></progress>
      </div> */}
    </div>
  );
}

export default GroupCard;
