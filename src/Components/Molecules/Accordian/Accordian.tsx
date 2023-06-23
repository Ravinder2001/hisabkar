import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { MdExpandMore } from "react-icons/md";
import styles from "./styles.module.css";

type SimpleAccordionProps = {
  amount: number;
  paidBy: string;
  memberList: { id: string; amount: number; name?: string }[];
};

export default function SimpleAccordion(props: SimpleAccordionProps) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<MdExpandMore size={30} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={styles.header}>
            <div>Amount: ₹{props.amount}</div>
            <div>Paid By: {props.paidBy}</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>  
          {props.memberList.map((item) => (
            <div key={item.id} className={styles.list}>
              <div>{item.name}</div>
              <div>₹{item.amount}</div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
