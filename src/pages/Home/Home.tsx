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
import { useSelector } from "react-redux";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import WelcomeModal from "../../components/WelcomeModal/WelcomeModal";
import { RootState } from "../../store/store";
import { Users } from "lucide-react";
import NotificationPrompt from "../../components/NotificationPrompt/NotificationPrompt";

function Home() {
  const isNewUser = useSelector((state: RootState) => state.user.isNewUser);
  const { fetchData, response, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.ALL_GROUPS);

  const [groupList, setGroupList] = useState<GroupType[]>([]);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isShareGroupModal, setIsShareGroupModal] = useState<{ status: boolean; groupCode: string }>({
    status: false,
    groupCode: "",
  });
  const [isWelcomeModal, setIsWelcomeModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (response?.success == 1) {
      setGroupList(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (isNewUser) setIsWelcomeModal(true);
  }, [isNewUser]);
  return isLoading ? (
    <CircularLoader />
  ) : (
    <div className={styles.container}>
      <div className={styles.cardCon}>
        {groupList.length ? (
          groupList.map((group) => (
            <GroupCard
              key={group.group_id}
              {...group}
              setGroupList={setGroupList}
              handleLinkShare={() => {
                setIsShareGroupModal({ status: true, groupCode: group.code });
              }}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" /> {/* Replace IndianRupee with Users */}
            </div>
            <p className="text-sm sm:text-base font-medium">No groups yet!</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Get started by creating your first group.</p>
          </div>
        )}
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
      {isWelcomeModal ? <WelcomeModal isOpen={isWelcomeModal} setIsOpen={setIsWelcomeModal} /> : null}
      <NotificationPrompt />
    </div>
  );
}

export default Home;
