import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal } from "antd";

import styles from "./style.module.scss";

type props = {
  status: boolean;
  handleModal: () => void;
  handleOK: () => void;
};
const DeleteConfirm = (props: props) => {
  return (
    <Modal
      className={styles.modal}
      centered
      width={400}
      closeIcon={false}
      title=""
      onOk={props.handleOK}
      open={props.status}
      onCancel={props.handleModal}
    >
      <div style={{ fontSize: "20px" }}>Are you sure you want to delete?</div>
    </Modal>
  );
};

export default DeleteConfirm;
