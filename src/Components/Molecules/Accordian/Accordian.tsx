import { useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { MdExpandMore } from "react-icons/md";

import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import { RootState } from "../../../store/store";
import AlertModal from "../../Organisms/AlertModal/AlertModal";

import styles from "./styles.module.css";

type SimpleAccordionProps = {
  id: number;
  amount: number;
  paidBy: string;
  memberList: { amount: number; member_name: string; image: string }[];
};

export default function SimpleAccordion(props: SimpleAccordionProps) {
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );

  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.mainBox}>
      <Accordion>
        <AccordionSummary
          expandIcon={<MdExpandMore size={30} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={styles.container}
        >
          <div className={styles.header}>
            <div className={styles.amountBox}>Amount: ₹{props.amount}</div>
            <div className={styles.paidBox}>
              Paid By: <span className={styles.paid}>{props.paidBy}</span>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {props.memberList.map((item, index) => (
            <div key={index} className={styles.list}>
              <div className={styles.subBox}>
                <div className={styles.img}>
                  <img src={item.image} alt="logo" width="100%" height="100%" />
                </div>
                <div>{item.member_name}</div>
              </div>

              <div className={styles.amount}>₹{item.amount}</div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
      {!guestUser && (
        <div className={styles.deleteBox} onClick={handleModal}>
          <ReactIcons name="AiFillDelete" size={25} color="white" />
        </div>
      )}
      <AlertModal
        open={open}
        handleModal={handleModal}
        id={props.id}
        text="Are you sure! You want to delete this expense."
      />
    </div>
  );
}
