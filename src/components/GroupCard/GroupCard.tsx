import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Users, MoreVertical, Trash2, IndianRupee, Share } from "lucide-react";
import { GroupType } from "../../utils/comman/CommanTypes";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../utils/constant/Constant";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomCountUp from "../CustomCountUp/CustomCountUp";
import CustomAlert from "../CustomAlert/CustomAlert";
import useApiFetch from "../../hooks/useAPIFetch";
import showToast from "../../utils/helpers/toastHelper";
import Messages from "../../utils/constant/Messages";
import { motion } from "framer-motion";

export function GroupCard(
  props: GroupType & {
    setGroupList: Dispatch<SetStateAction<GroupType[]>>;
    handleLinkShare: () => void;
  }
) {
  const navigate = useNavigate();
  const groupTypeList = useSelector((state: RootState) => state.data.groupTypeList);
  const groupType = groupTypeList.find((type) => type.id === props.group_type_id);

  const { fetchData: toggleGroupVisibility, response: visibilityRes, isLoading: visibilityLoading } = useApiFetch("");

  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  const handleSettlement = () => {
    toggleGroupVisibility(
      props.is_you_admin ? CONSTANTS.API_ROUTES.GROUP_VISIBILITY + "/" + props.group_id : CONSTANTS.API_ROUTES.LEAVE_GROUP + "/" + props.group_id
    );
  };
  const handleConfirmModal = () => {
    setConfirmationModal(!confirmationModal);
  };

  useEffect(() => {
    if (visibilityRes?.success == 1) {
      showToast(props.is_you_admin ? "Group deleted successfully" : "Left the group successfully", "success");
      handleConfirmModal();
      props.setGroupList((prev) => prev.filter((group) => group.group_id !== props.group_id));
    }
  }, [visibilityRes]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={styles.card}
        onClick={() => navigate(CONSTANTS.PROJECT_ROUTES.GROUP + `/${props.group_id}`)}
      >
        {/* Header with Pattern and Name */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className="flex flex-col gap-1">
              <h3 className={styles.groupName}>{props.group_name}</h3>
              {props.is_you_admin && <Badge className={styles.adminBadge}>Admin</Badge>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0 text-white/80 hover:bg-white/10 hover:text-white rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    props.handleLinkShare();
                  }}
                  className="cursor-pointer"
                >
                  <Share className="mr-2 h-4 w-4" />
                  <span>Share Group</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmModal();
                  }}
                  className={`${props.is_you_admin ? "text-red-600" : "text-orange-600"} cursor-pointer`}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{props.is_you_admin ? "Delete Group" : "Leave Group"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Body with Landscape and Stats */}
        <div className={styles.body}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Category</span>
              <div className={styles.statValue}>
                <img src={groupType?.icon ?? ""} alt={groupType?.name} className={styles.typeIcon} />
                <span>{groupType?.name}</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Members</span>
              <div className={styles.statValue}>
                <Users className="w-4 h-4 text-indigo-500" />
                <span>{props.total_members_count} Joined</span>
              </div>
            </div>
            <div className={`${styles.statItem} col-span-2 mt-2`}>
              <span className={styles.statLabel}>Total Group Spending</span>
              <div className={`${styles.statValue} ${styles.amount}`}>
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <span className="font-extrabold text-slate-900">
                  <CustomCountUp count={props.total_amount} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Member Pile and Status */}
        <div className={styles.footer}>
          <div className={styles.membersList}>
            {props.members.slice(0, 3).map((userImage, index) => (
              <div key={index} className={styles.memberAvatarWrap} style={{ zIndex: 3 - index }}>
                <UserAvatar userImage={userImage} />
              </div>
            ))}
            {props.remaining_members > 0 && <div className={styles.remainingMembers}>+{props.remaining_members}</div>}
          </div>
          <Badge className={props.is_settled ? styles.badgeSettled : styles.badgeUnsettled}>{props.is_settled ? "Settled" : "Unsettled"}</Badge>
        </div>
      </motion.div>

      <CustomAlert
        isOpen={confirmationModal}
        onClose={handleConfirmModal}
        onSubmit={handleSettlement}
        description={props.is_you_admin ? Messages.EXPENSE.DELETE_GROUP(props.group_name) : Messages.EXPENSE.LEAVE_GROUP(props.group_name)}
        isLoading={visibilityLoading}
      />
    </>
  );
}

export default GroupCard;
