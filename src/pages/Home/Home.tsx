import React, { useEffect, useState } from "react";
import ExpenseCard from "../../components/GroupCard/GroupCard";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { GroupType } from "../../utils/comman/CommanTypes";
import styles from "./style.module.css";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import CreateGroupModal from "../../components/CreateGroup/CreateGroup";
import GroupSharingModal from "../../components/ShareGroup/ShareGroup";
import { useDispatch } from "react-redux";
import { setReDirectURL } from "../../store/features/userSlice";

function Home() {
  const dispatch = useDispatch();
  const { fetchData, response } = useApiFetch(CONSTANTS.API_ROUTES.ALL_GROUPS);

  const [groupList, setGroupList] = useState<GroupType[]>([]);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isShareGroupModal, setIsShareGroupModal] = useState<{ status: boolean; groupCode: string }>({
    status: false,
    groupCode: "",
  });

  useEffect(() => {
    fetchData();
    dispatch(setReDirectURL(CONSTANTS.PROJECT_ROUTES.HOME));
  }, []);

  useEffect(() => {
    if (response?.success == 1) {
      setGroupList(response.data);
    }
  }, [response]);
  return (
    <div className={styles.container}>
      <div className={styles.cardCon}>
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
      </div>
      <FloatingActionButton
        onCreateGroup={() => {
          setIsCreateModal(true);
        }}
      />
      <CreateGroupModal isOpen={isCreateModal} setIsOpen={setIsCreateModal} setIsShareGroupModal={setIsShareGroupModal} callbackFunc={fetchData} />
      <GroupSharingModal
        isOpen={isShareGroupModal.status}
        setIsOpen={() => {
          setIsShareGroupModal({ status: false, groupCode: "" });
        }}
        groupCode={isShareGroupModal.groupCode}
      />
    </div>
  );
}

export default Home;
