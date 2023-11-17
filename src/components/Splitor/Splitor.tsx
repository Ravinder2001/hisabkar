import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./style.module.scss";
import CheckBox from "../CheckBox/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { nanoid } from "nanoid";
import { NanoIdLength } from "../../utils/Constants";
import { AddExpense } from "../../store/slices/StoreExpenseSlice";
function Splitor() {
  const dispatch = useDispatch();
  const GroupMembersInfo = useSelector((state: RootState) => state.StoreExpenseSlice.group_members);
  const [MembersCheck, setMembersCheck] = useState<{ id: string; name: string; avatar: string; checked: boolean }[]>([]);
 
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("");

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setAmount(inputValue);
    }
  };

  const handlePaidBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaidBy(e.target.value);
  };

  const handleCheck = (id: string) => {
    setMembersCheck((prevMembersCheck) => {
      return prevMembersCheck.map((member) => (member.id === id ? { ...member, checked: !member.checked } : member));
    });
  };

  const handleSubmit = () => {
    let expense_id = nanoid(NanoIdLength);
    let stack: any = [];

    MembersCheck.map((member) => {
      if (member.checked) {
        stack.push(member);
      }
    });
    let amountPerPerson = Number(amount) / stack.length;
    let paidByName = MembersCheck.find((member) => member.id == paidBy);
    dispatch(
      AddExpense({
        id: expense_id,
        amount: Number(amount),
        paidByName: paidByName?.name ?? "",
        paidById: paidBy,
        amountPerPerson,
        members: stack,
      })
    );
  };

  useEffect(() => {
    if (GroupMembersInfo.length) {
      GroupMembersInfo.map((member, index) => {
        setMembersCheck((prev) => [...prev, { ...member, checked: true }]);
      });
      setPaidBy(GroupMembersInfo[0].id);
    }
  }, [GroupMembersInfo]);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Add Expense</div>

      <input type="text" className={styles.input} value={amount} onChange={handleAmount} placeholder="Enter Amount" />
      <div className={styles.label}>Paid by</div>
      <select name="" id="" className={styles.select} onChange={handlePaidBy} value={paidBy}>
        {MembersCheck.map((member) => (
          <option value={member.id} key={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <div className={styles.label}>Members</div>
      <div className={styles.memberList}>
        {MembersCheck?.map((member) => (
          <div
            className={styles.member}
            key={member.id}
            onClick={() => {
              handleCheck(member.id);
            }}
          >
            <CheckBox checked={member.checked} />
            <div className={styles.name}>{member.name}</div>
          </div>
        ))}
      </div>
      <div className={styles.btn} onClick={handleSubmit}>
        Hisabkar
      </div>
    </div>
  );
}

export default Splitor;
