import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
        {groupList.length > 0 ? (
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-gray-100 rounded-3xl shadow-sm w-full"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-full shadow-inner"
              >
                <Users className="h-10 w-10 text-blue-500 opacity-80" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active groups</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-[240px] leading-relaxed">
              Managing expenses is better together. Create your first group and start splitting!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              Get Started
            </motion.button>
          </motion.div>
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
        callbackFunc={(data: GroupType) => {
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
