import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import LucideIcons from "../../assets/Icons/Icons";

type props = {
  id: string;
  amount: number;
  amountPerPerson: number;
  paidById: string;
  paidByName: string;
  members: { id: string; name: string; avatar: string }[];
};
export default function BasicAccordion(props: props) {
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<LucideIcons name="ChevronDown" />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Amount : {props.amount}</Typography>
          <Typography>Paid By : {props.paidByName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {props.members.map((member) => (
            <div>
              <div>
                <img src={member.avatar} alt="" width="30px" height="30px" />
                <div>{member.name}</div>
              </div>
              <div>{props.amountPerPerson}</div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
