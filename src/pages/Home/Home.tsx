/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import GroupCard from "../../components/GroupCard/GroupCard";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { GroupType } from "../../utils/comman/CommanTypes";
import styles from "./style.module.css";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import CreateGroupModal from "../../components/CreateGroup/CreateGroup";
import GroupSharingModal from "../../components/ShareGroup/ShareGroup";
import { useDispatch } from "react-redux";
import { setReDirectURL } from "../../store/features/userSlice";
import CircularLoader from "../../components/CircularLoader/CircularLoader";

function Home() {
  const dispatch = useDispatch();
  const { fetchData, response, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.ALL_GROUPS);

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
  return isLoading ? (
    <CircularLoader />
  ) : (
    <div className={styles.container}>
      <div className={styles.cardCon}>
        {groupList.map((group) => (
          <GroupCard
            key={group.group_id}
            {...group}
            setGroupList={setGroupList}
            handleLinkShare={() => {
              setIsShareGroupModal({ status: true, groupCode: group.code });
            }}
          />
        ))}
      </div>
      <FloatingActionButton
        onCreateGroup={() => {
          setIsCreateModal(true);
        }}
      />
      <CreateGroupModal
        isOpen={isCreateModal}
        setIsOpen={setIsCreateModal}
        setIsShareGroupModal={setIsShareGroupModal}
        callbackFunc={(data: any) => {
          setGroupList((prev) => [data, ...prev]);
        }}
      />
      <GroupSharingModal
        isOpen={isShareGroupModal.status}
        setIsOpen={() => {
          setIsShareGroupModal({ status: false, groupCode: "" });
        }}
        groupCode={isShareGroupModal.groupCode}
      />
    </div>
  );
  console.log("🚀  isLoading:", isLoading);
}

export default Home;
