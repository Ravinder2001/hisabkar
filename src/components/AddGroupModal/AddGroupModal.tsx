import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal } from "antd";

import styles from "./style.module.scss";
import ExpensesImages from "../ExpensesImages/ExpensesImages";
import { useNavigate } from "react-router-dom";
import { ExpenseRoute, NanoIdLength, avatarURL } from "../../utils/Constants";
import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { AddGroupMembers, AddPairs, CreateGroup, HandleDelete } from "../../store/slices/ExpenseSlice";
type props = {
  status: boolean;
  handleModal: () => void;
};
const AddGroupModal = (props: props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [membersName, setMemberName] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState<{ name: boolean; type: boolean; members: boolean }>({ name: false, type: false, members: false });

  const handleMemberName = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberName(e.target.value);
  };
  const handleGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleAdd = () => {
    if (membersName.length) {
      setMembers((prev) => [...prev, membersName]);
      setMemberName("");
    }
  };
  const handleMemberRemove = (index: number) => {
    setMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers.splice(index, 1);
      return updatedMembers;
    });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Call your function here
      handleAdd();
    }
  };
  const handleSubmit = () => {
    if (name.length == 0) {
      setError((prev) => ({ ...prev, name: true }));
      return;
    }
    if (type == "") {
      setError((prev) => ({ ...prev, type: true }));
      return;
    }
    if (members.length < 3) {
      setError((prev) => ({ ...prev, members: true }));
      return;
    }

    if (!error.members && !error.name && !error.type) {
      dispatch(HandleDelete());
      let stack: any = [];
      let pairStack: {
        id: string;
        sender: string;
        receiver: string;
        amount: number;
      }[] = [];
      members.map((item) => {
        const random = Math.floor(Math.random() * 100);
        const avatar = avatarURL + random + ".png";
        const member_id = nanoid(NanoIdLength);
        stack.push({ name: item, id: member_id, avatar, checked: true });
      });

      let object = {
        name,
        type,
      };
      dispatch(CreateGroup(object));
      dispatch(AddGroupMembers(stack));
      for (let i = 0; i < stack.length; i++) {
        for (let j = 0; j < stack.length; j++) {
          if (stack[i].id != stack[j].id) {
            const id = nanoid(NanoIdLength);
            let object = {
              id: id,
              sender: stack[i].id,
              receiver: stack[j].id,
              amount: 0,
            };
            pairStack.push(object);
          }
        }
      }

      dispatch(AddPairs(pairStack));
      navigate(ExpenseRoute);
    }
  };

  useEffect(() => {
    if (name.length) {
      setError((prev) => ({ ...prev, name: false }));
    }
    if (members.length > 2) {
      setError((prev) => ({ ...prev, members: false }));
    }
    if (type.length) {
      setError((prev) => ({ ...prev, type: false }));
    }
  }, [name, members, type]);

  return (
    <Modal className={styles.modal} width={700} title="Create Expense" open={props.status} closeIcon footer={null} onCancel={props.handleModal}>
      <div className={styles.label}>Name</div>
      <input type="text" className={styles.inputBox} value={name} maxLength={20} onChange={handleGroupName} placeholder="Your Expense Name" />
      {error.name ? <div className={styles.error}>Please fill the name!</div> : null}
      <div className={styles.label}>Expense Type</div>
      <div className={styles.iconBox}>
        <div
          className={`${styles.typeBox} ${type == "Monthly" && styles.selected}`}
          onClick={() => {
            setType("Monthly");
          }}
        >
          <ExpensesImages name="Monthly" />
          <div className={styles.typeLabel}>Monthly</div>
        </div>
        <div
          className={`${styles.typeBox} ${type == "Travel" && styles.selected}`}
          onClick={() => {
            setType("Travel");
          }}
        >
          <ExpensesImages name="Travel" />
          <div className={styles.typeLabel}>Travel</div>
        </div>
        <div
          className={`${styles.typeBox} ${type == "Personal" && styles.selected}`}
          onClick={() => {
            setType("Personal");
          }}
        >
          <ExpensesImages name="Personal" />
          <div className={styles.typeLabel}>Personal</div>
        </div>
        <div
          className={`${styles.typeBox} ${type == "Medical" && styles.selected}`}
          onClick={() => {
            setType("Medical");
          }}
        >
          <ExpensesImages name="Medical" />
          <div className={styles.typeLabel}>Medical</div>
        </div>
        <div
          className={`${styles.typeBox} ${type == "Utility" && styles.selected}`}
          onClick={() => {
            setType("Utility");
          }}
        >
          <ExpensesImages name="Utility" />
          <div className={styles.typeLabel}>Utility</div>
        </div>
        <div
          className={`${styles.typeBox} ${type == "Others" && styles.selected}`}
          onClick={() => {
            setType("Others");
          }}
        >
          <ExpensesImages name="Others" />
          <div className={styles.typeLabel}>Others</div>
        </div>
      </div>
      {error.type ? <div className={styles.error}>Please select any of the type!</div> : null}
      <div className={styles.label}>Add Members</div>
      <div className={styles.addBox}>
        <input
          type="text"
          onKeyPress={handleKeyPress}
          className={styles.inputBox}
          placeholder="Enter the member name"
          value={membersName}
          onChange={handleMemberName}
        />
        <div className={styles.addBtn} onClick={handleAdd}>
          Add
        </div>
      </div>
      {error.members ? <div className={styles.error}>Please add atleast three peoples!</div> : null}
      <div className={styles.memberList}>
        {members?.map((item, index) => (
          <div className={styles.memberBox}>
            <div className={styles.memberName}>{item}</div>
            <div
              className={styles.memberRemove}
              onClick={() => {
                handleMemberRemove(index);
              }}
            >
              X
            </div>
          </div>
        ))}
      </div>

      <div className={styles.createBtn} onClick={handleSubmit}>
        Create
      </div>
    </Modal>
  );
};

export default AddGroupModal;
