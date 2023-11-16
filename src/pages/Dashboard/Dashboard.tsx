import React, { useState } from "react";
import GroupContainer from "../../components/GroupContainer/GroupContainer";
import AddGroupModal from "../../components/AddGroupModal/AddGroupModal";

function Dashboard() {
  const [modalStatus, setModalStatus] = useState(false);
  const handleModal = () => {
    setModalStatus(!modalStatus);
  };
  return (
    <div>
      <GroupContainer handleModal={handleModal} />
      <AddGroupModal status={modalStatus} handleModal={handleModal} />
    </div>
  );
}

export default Dashboard;
