import { useState } from "react";
import styles from "./styles.module.css";
import Heading from "../../../Atoms/Headings/Heading";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import ModalBox from "../../../Atoms/Modal/Modal";

type HeaderProps = {
  name: string;
  members: number;
};

function Header(props: HeaderProps) {
  const GroupName = props.name;
  const [open, setOpen] = useState(false);
  const [url, setURL] = useState("");

  const handleClick = () => {
    const url = window.location.href;
    setURL(`${url}?sharing=true`);
  };

  const handleOpen = () => {
    handleClick();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const MembersLength = props.members;
  const Amount = useSelector((state: RootState) => state.OtherSlice.amount);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.heading}>
          <Heading text="hisabkar.com" />
        </div>
        <div className={styles.subHeading}>
          <div>{GroupName}</div>
          <div>{MembersLength} Members</div>
        </div>
      </div>

      <div className={styles.amountHead}>Total Expense: ₹{Amount}</div>
      <div className={styles.share}>
        <div onClick={handleOpen}>Share with friends</div>
      </div>
      <ModalBox url={url} open={open} handleClose={handleClose} />
    </div>
  );
}

export default Header;
