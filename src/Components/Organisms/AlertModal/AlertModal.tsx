import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import DeleteExpense from "../../../APIs/DeleteExpense";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { useDispatch } from "react-redux";
import { Logout } from "../../../store/slices/UserSlice";
import { useNavigate } from "react-router-dom";

type ModalPropsType = {
  open: boolean;
  handleModal: () => void;
  id: number;
  text: string;
};

const AlertModal = (props: ModalPropsType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { open, handleModal, id, text } = props;
  const handleDelete = async () => {
    handleModal();
    const res = await DeleteExpense(id);
    if (res.status === request_succesfully) {

      message.success(res?.message);
    } else if (res?.response?.data?.status === Unauthorized) {
      localStorage.removeItem(localStorageKey);
      dispatch(Logout());
      navigate("/login");
      message.error(res?.response?.data?.message ?? "Something went wrong");
    } else {
      message.error(res?.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <>
      <Modal
        title="Confirmation"
        open={open}
        onOk={handleDelete}
        onCancel={handleModal}
      >
        <p>{text}</p>
      </Modal>
    </>
  );
};

export default AlertModal;
