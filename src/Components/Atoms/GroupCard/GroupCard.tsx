import React from "react";
import styles from "./styles.module.css";
import moment from "moment";
import ReactIcons from "../ReactIcons/ReactIcons";
import { formatTime } from "../../../utils/Function";
import DeleteGroup from "../../../APIs/DeleteGroup";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { useNavigate } from "react-router-dom";
import ConfirmPop from "../../Molecules/ConfirmPop/ConfirmPop";
import { Popconfirm, message } from "antd";
import { useDispatch } from "react-redux";
import { Logout } from "../../../store/slices/UserSlice";
import DeleteRelation from "../../../APIs/DeleteRelation";

type GroupCardType = {
  id: string;
  name: string;
  members: { image: string; name: string }[];
  amount: number;
  time: string;
  editable: boolean;
  toogleFlag: () => void;
  relationid: number | null;
};

function GroupCard(props: GroupCardType) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleAlert = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    navigate(`/${props.id}`);
  };

  const RemoveGroup = async () => {
    if (props.editable && props.relationid == null) {
      const res = await DeleteGroup({ group_id: props.id, status: false });
      if (res.status == request_succesfully) {
        handleAlert();
        message.success(res.message);
        props.toogleFlag();
      } else if (res.response.data.status === Unauthorized) {
        localStorage.removeItem(localStorageKey);
        dispatch(Logout());
        navigate("/login");
        message.error(res.response.data.message ?? "Something went wrong");
      } else {
        message.error(res.response.data.message ?? "Something went wrong");
      }
    } else if (!props.editable && props.relationid !== null) {
      const res = await DeleteRelation(props.relationid);
      if (res.status == request_succesfully) {
        handleAlert();
        message.success("Group Deleted!");
        props.toogleFlag();
      } else if (res.response.data.status === Unauthorized) {
        localStorage.removeItem(localStorageKey);
        dispatch(Logout());
        navigate("/login");
        message.error(res.response.data.message ?? "Something went wrong");
      } else {
        message.error(res.response.data.message ?? "Something went wrong");
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardWrapperAccounts}>
          {props.members.length > 2 && (
            <div className={styles.cardScore}>+{props.members.length - 2}</div>
          )}

          {props.members.slice(0, 2).map((item, index) => (
            <div className={styles.cardAccounts} key={index}>
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
        <Popconfirm
          open={open}
          title="Are you sure you want to delete this group."
          // description={props.des}
          onConfirm={RemoveGroup}
          onCancel={handleAlert}
          okText="Yes"
          cancelText="No"
        >
          <div className={styles.cardMenu} onClick={handleAlert}>
            <ReactIcons name="AiFillDelete" size={25} />
          </div>
        </Popconfirm>
      </div>
      <div className={styles.cardTitle}>{props.name}</div>
      <div>
        <div className={styles.heading}>Members</div>
        <ul className={styles.main}>
          {props.members.map((item, index) => (
            <li key={index} className={styles.box}>
              {item.name}
            </li>
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
    </div>
  );
}

export default GroupCard;
