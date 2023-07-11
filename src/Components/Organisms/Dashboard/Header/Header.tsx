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
import GroupModalBox from "../../../Atoms/GroupModalBox/GroupModalBox";
import BillModalBox from "../../../Atoms/BillModalBox/BillModalBox";

type HeaderProps = {
  name: string;
  members: number;
  group_id:string
};

function Header(props: HeaderProps) {
  const dispatch = useDispatch();
  const GroupName = props.name;

  const MembersLength = props.members;
  const Amount = useSelector((state: RootState) => state.OtherSlice.amount);
  const GuestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );

  const [GroupOpen, setGroupOpen] = useState(false);
  const [BillOpen, setBillOpen] = useState(false);
  const [url, setURL] = useState("");

  const handleClick = () => {
    const url = window.location.href;
    console.log("re", url);
    setURL(`${url}?sharing`);
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

  return (
    <div className={styles.container}>
      <div className={styles.text}>{GroupName}</div>
      <div className={styles.text}>{MembersLength} Members</div>
      <div className={styles.text}>Total Expense: ₹{Amount}</div>
      {!GuestUser && (
        <>
          <div className={styles.share} onClick={handleGroupOpen}>
            Share Group with friends
          </div>
          <GroupModalBox
            url={url}
            open={GroupOpen}
            handleClose={handleGroupClose}
          />
        </>
      )}
      {!GuestUser && (
        <>
          <div className={styles.share} onClick={handleBillOpen}>
            Share Bills with friends
          </div>
          <BillModalBox group_id={props.group_id} url={url} open={BillOpen} handleClose={handleBillClose} />
        </>
      )}
    </div>
  );
}

export default Header;
