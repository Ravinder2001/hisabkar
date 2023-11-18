import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./style.module.scss";
import CheckBox from "../CheckBox/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { nanoid } from "nanoid";
import { NanoIdLength } from "../../utils/Constants";
import { AddExpense, TooglePairs } from "../../store/slices/ExpenseSlice";
function Splitor() {
  const dispatch = useDispatch();
  const GroupMembersInfo = useSelector((state: RootState) => state.ExpenseSlice.group_members);
  const pairs = useSelector((state: RootState) => state.ExpenseSlice.pairs);

  const [MembersCheck, setMembersCheck] = useState<{ id: string; name: string; avatar: string; checked: boolean }[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [error, setError] = useState<{ amount: boolean; members: boolean }>({ amount: false, members: false });
  const [activeMembers, setActiveMembers] = useState<{ id: string; name: string; avatar: string; checked: boolean; amount: number }[]>([]);

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
    if (amount.length == 0) {
      setError((prev) => ({ ...prev, amount: true }));
      return;
    }
    if (!error.amount && !error.members) {
      let expense_id = nanoid(NanoIdLength);

      let amountPerPerson = Number(amount) / activeMembers.length;

      // Store activeMembers in a new variable
      const updatedActiveMembers = activeMembers.map((member) => ({
        ...member,
        amount: amountPerPerson,
      }));

      setActiveMembers(updatedActiveMembers);

      let paidByName = MembersCheck.find((member) => member.id == paidBy);

      dispatch(
        AddExpense({
          id: expense_id,
          amount: Number(amount),
          paidByName: paidByName?.name ?? "",
          paidById: paidBy,
          members: updatedActiveMembers, // Use the new variable here
        })
      );

      let stacks: { id: string; amount: number }[] = [];
      pairs.map((pair) => {
        if (
          (pair.sender === paidBy && activeMembers.find((member: any) => member.id === pair.receiver)) ||
          (pair.receiver === paidBy && activeMembers.find((member: any) => member.id === pair.sender))
        ) {
          stacks.push({ id: pair.id, amount: amountPerPerson });
        }
      });
      dispatch(TooglePairs({ ids: stacks, paidby: paidBy }));
    }
  };

  useEffect(() => {
    if (GroupMembersInfo.length) {
      GroupMembersInfo.map((member, index) => {
        setMembersCheck((prev) => [...prev, { ...member, checked: true }]);
      });
      setPaidBy(GroupMembersInfo[0].id);
    }
  }, [GroupMembersInfo]);

  useEffect(() => {
    if (amount.length) {
      setError((prev) => ({ ...prev, amount: false }));
    }
  }, [amount]);
  useEffect(() => {
    let stack: any = [];

    MembersCheck.map((member) => {
      if (member.checked) {
        stack.push(member);
      }
    });
    setActiveMembers(stack);
  }, [MembersCheck]);

  useEffect(() => {
    if (activeMembers.length > 1) {
      setError((prev) => ({ ...prev, members: false }));
    }
    if (activeMembers.length < 2) {
      setError((prev) => ({ ...prev, members: true }));
      return;
    }
  }, [activeMembers]);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Add Expense</div>

      <input type="text" className={styles.input} value={amount} onChange={handleAmount} placeholder="Enter Amount (₹1 - ₹100000)" />
      {error.amount ? <div className={styles.error}>Please add the amount!</div> : null}
      <div className={styles.label}>Paid by</div>
      <select name="" id="" className={styles.select} onChange={handlePaidBy} value={paidBy}>
        {MembersCheck.map((member) => (
          <option value={member.id} key={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <div className={styles.label}>Members</div>
      {error.members ? <div className={styles.error}>Please select atleast two people!</div> : null}
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
