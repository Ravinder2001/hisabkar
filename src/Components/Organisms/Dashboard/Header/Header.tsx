import { ChangeEvent, useState } from "react";
import styles from "./styles.module.css";
import Heading from "../../../Atoms/Headings/Heading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import ModalBox from "../../../Atoms/Modal/Modal";
import FilterBox from "../../../Molecules/FilterBox/FilterBox";
import ReactIcons from "../../../Atoms/ReactIcons/ReactIcons";
import {
  handleReceiver,
  handleReset,
  handleSender,
} from "../../../../store/slices/FilterSlice";

type HeaderProps = {
  name: string;
  members: number;
};

function Header(props: HeaderProps) {
  const dispatch = useDispatch();
  const GroupName = props.name;

  const MembersLength = props.members;
  const Amount = useSelector((state: RootState) => state.OtherSlice.amount);

  const [open, setOpen] = useState(false);
  const [url, setURL] = useState("");

  const handleClick = () => {
    const url = window.location.href;
    setURL(`${url}?sharing`);
  };

  const handleOpen = () => {
    handleClick();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.container}>
      <div className={styles.text}>{GroupName}</div>
      <div className={styles.text}>{MembersLength} Members</div>
      <div className={styles.text}>Total Expense: ₹{Amount}</div>
      <div className={styles.share} onClick={handleOpen}>
        Share with friends
      </div>
      <ModalBox url={url} open={open} handleClose={handleClose} />
    </div>
  );
}

export default Header;
