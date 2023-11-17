import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import LucideIcons from "../../assets/Icons/Icons";
import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import { DeleteExpense, SubtractPairs } from "../../store/slices/StoreExpenseSlice";
type props = {
  id: string;
  amount: number;
  amountPerPerson: number;
  paidById: string;
  paidByName: string;
  members: { id: string; name: string; avatar: string }[];
};
export default function BasicAccordion(props: props) {
  const dispatch = useDispatch();
  const handleDelete = () => {
    let stack: any = [];
    props.members.map((member) => {
      stack.push(member.id);
    });
    console.log("🚀  file: Accordian.tsx:22  stack:", stack)
    dispatch(DeleteExpense(props.id));
    dispatch(
      SubtractPairs({
        ids: stack, // Change to an array of strings
        paidby: props.paidById,
        amount: props.amountPerPerson,
      })
    );
  };
  return (
    <Accordion>
      <AccordionSummary
        className={styles.container}
        expandIcon={<LucideIcons name="ChevronDown" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
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
        <div onClick={handleDelete}>Delete</div>
        {props.members.map((member) => (
          <div className={styles.body}>
            <div className={styles.userBox}>
              <img src={member.avatar} alt="" className={styles.img} />
              <div className={styles.name}>{member.name}</div>
            </div>
            <div className={styles.bodyAmount}>₹{props.amountPerPerson}</div>
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
