import { ChangeEvent, useState } from "react";
import styles from "./styles.module.css";
import Heading from "../../../Atoms/Headings/Heading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import FilterBox from "../../../Molecules/FilterBox/FilterBox";
import ReactIcons from "../../../Atoms/ReactIcons/ReactIcons";
import {
  handleReceiver,
  handleReset,
  handleSender,
} from "../../../../store/slices/FilterSlice";

import AccessModal from "../../../Molecules/AccessModal/AccessModal";
import GroupModalBox from "../../../Molecules/GroupModalBox/GroupModalBox";
import BillModalBox from "../../../Molecules/BillModalBox/BillModalBox";
import BarChartModal from "../../../Molecules/BarChartModal/BarChartModal";

type HeaderProps = {
  name: string;
  members: number;
  group_id: string;
};

function Header(props: HeaderProps) {
  const dispatch = useDispatch();
  const GroupName = props.name;

  const MembersLength = props.members;
  const Amount = useSelector((state: RootState) => state.OtherSlice.amount);
  const GuestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );
  const User = useSelector((state: RootState) => state.UserSlice.id);

  const [GroupOpen, setGroupOpen] = useState(false);
  const [BillOpen, setBillOpen] = useState(false);
  const [AccessOpen, setAccessOpen] = useState(false);
  const [url, setURL] = useState("");
  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    const url = window.location.href;
    setURL(`${url}?id=${User}&sharing`);
  };

  const handleGroupOpen = () => {
    handleClick();
    setGroupOpen(true);
  };

  const handleGroupClose = () => setGroupOpen(false);

  const handleBillOpen = () => {
    handleClick();
    setBillOpen(true);
  };

  const handleBillClose = () => setBillOpen(false);

  const handleAccessOpen = () => {
    setAccessOpen(true);
  };

  const handleAccessClose = () => setAccessOpen(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftBox}>
        <div className={styles.text}>{GroupName}</div>
        <div className={styles.text}>{MembersLength} Members</div>
        <div className={styles.text}>Total Expense: ₹{Amount}</div>
      </div>

      <div className={styles.rightBox}>
        <div onClick={handleModal} className={styles.graph}>
          <ReactIcons name="SiGoogleanalytics" />
        </div>
        {!GuestUser && (
          <div>
            <div className={styles.share} onClick={handleGroupOpen}>
              Share Group with friends
            </div>
            <GroupModalBox
              url={url}
              open={GroupOpen}
              handleClose={handleGroupClose}
              name={GroupName}
            />
          </div>
        )}
        {!GuestUser && (
          <div>
            <div className={styles.share} onClick={handleBillOpen}>
              Send Bills to friends
            </div>
            <BillModalBox
              group_id={props.group_id}
              url={url}
              open={BillOpen}
              handleClose={handleBillClose}
            />
          </div>
        )}
        {!GuestUser && (
          <div>
            <div className={styles.share} onClick={handleAccessOpen}>
              Group Access
            </div>
            <AccessModal
              group_id={props.group_id}
              open={AccessOpen}
              handleClose={handleAccessClose}
            />
          </div>
        )}
      </div>

      <BarChartModal
        group_id={props.group_id}
        name={props.name}
        open={open}
        handleModal={handleModal}
      />
    </div>
  );
}

export default Header;
