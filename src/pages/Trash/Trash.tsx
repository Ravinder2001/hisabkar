import React, { useState } from "react";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LucideIcons from "../../assets/Icons/Icons";
import AccordionBox from "../../components/Accordian/Accordian";
import PairContainer from "../../components/PairContainer/PairContainer";
import DeleteConfirm from "../../components/DeleteConfirm/DeleteConfirm";
import { AddTrashGroup, DeleteGroup } from "../../store/slices/TrashExpenseSlice";
import { HandleRecover } from "../../store/slices/ExpenseSlice";
import { ExpenseRoute, NanoIdLength } from "../../utils/Constants";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

function TrashContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Trash = useSelector((state: RootState) => state.TrashExpenseSlice.List);
  const Current_Group = useSelector((state: RootState) => state.ExpenseSlice);

  const [modalStatus, setModalStatus] = useState(false);
  const [modalId, setModalId] = useState("");
  const handleModal = () => {
    setModalStatus(!modalStatus);
  };

  const handleDelete = (id: string) => {
    dispatch(DeleteGroup(id));
  };
  const handleEdit = (id: string) => {
    let data = Trash.find((item) => item.id == id);
    if (data) {
      if (Current_Group.group_name.length) {
        let trash_id = nanoid(NanoIdLength);
        let object = { ...Current_Group, id: trash_id, createdAt: Date() };
        dispatch(AddTrashGroup(object));
      }

      dispatch(HandleRecover(data));
      dispatch(DeleteGroup(id));
      navigate(ExpenseRoute);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Name</div>
        <div>Type</div>
        <div>Total Amount</div>
        <div>Members</div>
        <div>Edit</div>
        <div>Remove</div>
      </div>
      {Trash.map((item) => {
        let total = item.expenses.reduce((acc, expenseItem) => acc + expenseItem.amount, 0);
        return (
          <div className={styles.main_container}>
            <div
              className={styles.box}
              onClick={() => {
                if (modalId == item.id) {
                  setModalId("");
                } else {
                  setModalId(item.id);
                }
              }}
            >
              <div>{item.group_name}</div>
              <div>{item.group_type}</div>
              <div>{total}</div>
              <div>{item.group_members.length}</div>
              <div onClick={() => handleEdit(item.id)}>
                <LucideIcons name="Edit" />
              </div>
              <div onClick={handleModal}>
                <LucideIcons name="Trash" />
              </div>
            </div>
            {modalId == item.id ? (
              <div className={styles.sub_box}>
                <div className={styles.pairBox}>
                  <div className={styles.boxHead}>Bills</div>
                  {item.pairs.map(
                    (pair) =>
                      pair.amount > 0 && (
                        <PairContainer
                          trash={true}
                          group_id={item.id}
                          id={pair.id}
                          sender={pair.sender}
                          receiver={pair.receiver}
                          amount={pair.amount}
                        />
                      )
                  )}
                </div>

                <div className={styles.expenseContainer}>
                  <div className={styles.exboxHead}>Expenses</div>
                  {item?.expenses?.map((Expense) => (
                    <AccordionBox
                      key={Expense.id}
                      id={Expense.id}
                      amount={Expense.amount}
                      paidById={Expense.paidById}
                      paidByName={Expense.paidByName}
                      members={Expense.members}
                      delete={false}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <DeleteConfirm
              status={modalStatus}
              handleModal={handleModal}
              handleOK={() => {
                handleDelete(item.id);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default TrashContainer;
