import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import LucideIcons from "../../assets/Icons/Icons";
import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import { DeleteExpense, SubtractPairs } from "../../store/slices/ExpenseSlice";
import DeleteConfirm from "../DeleteConfirm/DeleteConfirm";
type props = {
  id: string;
  amount: number;
  paidById: string;
  paidByName: string;
  members: { id: string; name: string; avatar: string; amount: number }[];
  delete?: boolean;
};
export default function BasicAccordion(props: props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(!open);
  };

  const handleDelete = () => {
    let stack: any = [];
    props.members.map((member) => {
      stack.push({ id: member.id, amount: member.amount });
    });
    console.log("🚀  file: Accordian.tsx:21  stack:", stack);
    dispatch(DeleteExpense(props.id));
    dispatch(
      SubtractPairs({
        ids: stack,
        paidby: props.paidById,
      })
    );
  };
  return (
    <Accordion style={{ marginTop: "10px", marginBottom: "10px" }}>
      <AccordionSummary
        className={styles.container}
        expandIcon={<LucideIcons name="ChevronDown" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {props.delete ?? true ? (
          <div onClick={handleConfirm} className={styles.deleteIcon}>
            <LucideIcons name="Trash" size={18} color="red" />
          </div>
        ) : null}
        <div className={styles.paidBox}>
          <div className={styles.paidHead}>Amount :</div>
          <div className={styles.paidName}>₹{props.amount}</div>
        </div>
        <div className={styles.paidBox}>
          <div className={styles.paidHead}>Paid By : </div>
          <div className={styles.paidName}>{props.paidByName}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {props.members.map((member) => (
          <div className={styles.body}>
            <div className={styles.userBox}>
              <img src={member.avatar} alt="" className={styles.img} />
              <div className={styles.name}>{member.name}</div>
            </div>
            <div className={styles.bodyAmount}>₹{member.amount}</div>
          </div>
        ))}
      </AccordionDetails>
      <DeleteConfirm status={open} handleModal={handleConfirm} handleOK={handleDelete} />
    </Accordion>
  );
}
