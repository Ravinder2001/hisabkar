import React from "react";
import styles from "./styles.module.css";
import moment from "moment";
import ReactIcons from "../ReactIcons/ReactIcons";
import { formatTime } from "../../../utils/Function";
import DeleteGroup from "../../../APIs/DeleteGroup";
import { request_succesfully } from "../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast, SuccessToast } from "../../../utils/ToastStyle";
import AlertBox from "../AlertBox/AlertBox";
import { useNavigate } from "react-router-dom";

type GroupCardType = {
  id: string;
  name: string;
  members: { image: string; name: string }[];
  amount: number;
  time: string;
  editable: boolean;
  toogleFlag:()=> void
};

function GroupCard(props: GroupCardType) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const openAlert = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    navigate(`/${props.id}`);
  };

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
        {props.editable && (
          <div className={styles.cardMenu} onClick={openAlert}>
            <ReactIcons name="AiFillDelete" size={25} />
          </div>
        )}
      </div>
      <div className={styles.cardTitle}>{props.name}</div>
      <div>
        <div className={styles.heading}>Members</div>
        <ul className={styles.main}>
          {props.members.map((item) => (
            <li className={styles.box}>{item.name}</li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <div className={styles.cardIndicatorTime}>{formatTime(props.time)}</div>
        <button onClick={handleClick} className={styles.btn}>
          Open
        </button>
      </div>
      {/* <div className={styles.cardIndicator}>
        <span className={styles.cardIndicatorAmount}>135</span> Works /{" "}
        <span className={styles.cardIndicatorPercentage}>45%</span>
      </div>
      <div className={styles.cardProgress}>
        <progress max="100" value="40"></progress>
      </div> */}
      <AlertBox open={open} openAlert={openAlert} id={props.id} toogleFlag={props.toogleFlag} />
    </div>
  );
}

export default GroupCard;
