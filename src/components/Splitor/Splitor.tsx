import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./style.module.scss";
import CheckBox from "../CheckBox/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { nanoid } from "nanoid";
import { NanoIdLength } from "../../utils/Constants";
import { AddExpense, ToogleCheck, TooglePairs } from "../../store/slices/ExpenseSlice";
import ToogleBox from "../ToogleBox/ToogleBox";
function Splitor() {
  const dispatch = useDispatch();
  const GroupMembersInfo = useSelector((state: RootState) => state.ExpenseSlice.group_members);
  const pairs = useSelector((state: RootState) => state.ExpenseSlice.pairs);

  const MembersCheck = useSelector((state: RootState) => state.ExpenseSlice.group_members);
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [error, setError] = useState<{ amount: boolean; members: boolean; paid: boolean }>({ amount: false, members: false, paid: false });
  const [activeMembers, setActiveMembers] = useState<{ id: string; name: string; avatar: string; checked: boolean; amount: number }[]>([]);
  const [customInput, setCustomInput] = useState<{ value: string; id: string; name: string }[]>([]);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);

  const handleCustomCheck = () => {
    setChecked(!checked);
  };

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
    dispatch(ToogleCheck(id));
  };

  const handleSubmit = () => {
    if (amount.length == 0) {
      setError((prev) => ({ ...prev, amount: true }));
      return;
    }
    if (!paidBy.length) {
      setError((prev) => ({ ...prev, paid: true }));
      return;
    }
    if (!error.amount && !error.members) {
      let expense_id = nanoid(NanoIdLength);

      let amountPerPerson = Math.ceil(Number(amount) / activeMembers.length);

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

  const handleCustomSubmit = () => {
    if (amount.length == 0) {
      setError((prev) => ({ ...prev, amount: true }));
      return;
    }
    const totalValue = customInput.reduce((accumulator, input) => {
      return accumulator + Number(input.value);
    }, 0);
    if (!error.amount && !error.members && totalValue == Number(amount)) {
      let expense_id = nanoid(NanoIdLength);

      // Store activeMembers in a new variable
      const updatedActiveMembers = activeMembers.map((member) => ({
        ...member,
        amount: Number(customInput.find((input) => input.id === member.id)?.value) || 0,
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
        const isSenderPaidBy = pair.sender === paidBy;
        const correspondingInputId = isSenderPaidBy ? pair.receiver : pair.sender;

        const correspondingInput = customInput.find((member: any) => member.id === correspondingInputId);

        if (correspondingInput) {
          stacks.push({
            id: pair.id,
            amount: Math.ceil(Number(correspondingInput.value)) || 0,
          });
        }
      });
      dispatch(TooglePairs({ ids: stacks, paidby: paidBy }));
    }
  };

  const handleCustom = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id, name } = e.target;

    // Check if the input is a valid number
    if (!isNaN(Number(value))) {
      // Check if the input with the given id already exists in the state
      const inputIndex = customInput.findIndex((input) => input.id === id);

      if (inputIndex !== -1) {
        // If the input exists, update its value
        setCustomInput((prev) => [...prev.slice(0, inputIndex), { ...prev[inputIndex], value }, ...prev.slice(inputIndex + 1)]);
      } else {
        // If the input doesn't exist, add a new entry to the state
        setCustomInput((prev) => [...prev, { value, id, name }]);
      }
    }
  };

  useEffect(() => {
    if (amount.length) {
      setError((prev) => ({ ...prev, amount: false }));
    } else {
      setChecked(false);
    }
  }, [amount]);
  useEffect(() => {
    if (paidBy.length) {
      setError((prev) => ({ ...prev, paid: false }));
    }
  }, [paidBy]);
  useEffect(() => {
    let stack: any = [];
    let customStack: any = [];

    MembersCheck.map((member) => {
      if (member.checked) {
        stack.push(member);
        customStack.push({ value: "", name: member.name, id: member.id });
      }
    });
    setActiveMembers(stack);

    setCustomInput(customStack);
  }, [MembersCheck]);

  useEffect(() => {
    if (activeMembers.length > 0) {
      setError((prev) => ({ ...prev, members: false }));
    }
    if (activeMembers.length < 1) {
      setError((prev) => ({ ...prev, members: true }));
      return;
    }
  }, [activeMembers]);

  useEffect(() => {
    const totalValue = customInput.reduce((accumulator, input) => {
      return accumulator + Number(input.value);
    }, 0);
    setRemainingAmount(totalValue);
  }, [customInput]);

  return (
    <div className={styles.container}>
      <div className={styles.inputBox}>
        <div className={styles.label}>Amount</div>
        <input
          type="text"
          autoComplete="off"
          maxLength={6}
          className={styles.input}
          value={amount}
          onChange={handleAmount}
          placeholder="Enter Amount (₹1 - ₹100000)"
        />
      </div>
      {error.amount ? <div className={styles.error}>Please add the amount!</div> : null}
      <div className={styles.label}>Paid by</div>
      <select name="" id="" className={styles.select} onChange={handlePaidBy} value={paidBy}>
        {GroupMembersInfo.map((member) => (
          <option value={member.id} key={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      {error.paid ? <div className={styles.error}>Please select person.</div> : null}
      <div className={styles.label}>Members</div>
      {error.members ? <div className={styles.error}>Please select atleast one people!</div> : null}
      <div className={styles.memberList}>
        {MembersCheck?.map((member) => (
          <div
            className={member.checked ? styles.member : styles.unChecked}
            key={member.id}
            onClick={() => {
              handleCheck(member.id);
            }}
          >
            <div className={styles.name}>{member.name}</div>
          </div>
        ))}
      </div>
      {amount.length ? (
        <div className={styles.toogleBox}>
          <div className={styles.customLabel}>Custom Amount</div>
          <div>
            <ToogleBox checked={checked} handleCustomCheck={handleCustomCheck} />
          </div>
        </div>
      ) : null}
      {checked && amount.length ? (
        <div className={styles.customBox}>
          <div className={styles.remaing}>Remaining Amount: {Number(amount) - remainingAmount}</div>
          <div>
            {customInput.map((member) => (
              <div>
                <div className={styles.customName}>{member.name}</div>
                <input
                  className={styles.customInput}
                  autoComplete="off"
                  type="text"
                  value={member.value}
                  name={member.id}
                  id={member.id}
                  onChange={handleCustom}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className={styles.btn} onClick={checked ? handleCustomSubmit : handleSubmit}>
        Hisabkar
      </div>
    </div>
  );
}

export default Splitor;
