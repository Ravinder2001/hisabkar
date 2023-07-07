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
  const GroupMembers = useSelector(
    (state: RootState) => state.FilterSlice.groupMembers
  );
  const SenderFilter = useSelector(
    (state: RootState) => state.FilterSlice.senderFilter
  );
  const ReceiverFilter = useSelector(
    (state: RootState) => state.FilterSlice.receiverFilter
  );

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

  const handleSenderFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(handleSender(e.target.value));
  };
  const handleReceiverFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(handleReceiver(e.target.value));
  };
  const Reset = () => {
    dispatch(handleReset());
  };

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
      <div className={styles.filterCon}>
        <FilterBox
          title="Sender"
          options={GroupMembers}
          handleChange={handleSenderFilter}
          value={SenderFilter}
        />
        <FilterBox
          title="Receiver"
          options={GroupMembers}
          handleChange={handleReceiverFilter}
          value={ReceiverFilter}
        />
        {(SenderFilter != "All" || ReceiverFilter != "All") && (
          <div onClick={Reset} style={{ cursor: "pointer" }}>
            <ReactIcons name="CiCircleRemove" color="white" size={25} />
          </div>
        )}
      </div>
      <div className={styles.share}>
        <div onClick={handleOpen}>Share with friends</div>
      </div>
      <ModalBox url={url} open={open} handleClose={handleClose} />
    </div>
  );
}

export default Header;
