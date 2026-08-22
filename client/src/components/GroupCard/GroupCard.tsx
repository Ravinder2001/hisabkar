import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { MoreVertical, Trash2, Share } from "lucide-react";
import { GroupType } from "../../utils/comman/CommanTypes";
import { getGroupTypeIcon } from "../../utils/comman/groupTypeIcon";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../utils/constant/Constant";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomAlert from "../CustomAlert/CustomAlert";
import useApiFetch from "../../hooks/useAPIFetch";
import showToast from "../../utils/helpers/toastHelper";
import Messages from "../../utils/constant/Messages";

const formatMoney = (amount: number) => `₹${Math.round(Math.abs(amount)).toLocaleString("en-IN")}`;

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

  const balance = props.net_balance ?? 0;
  const isOwed = balance > 0;
  const isOwing = balance < 0;

  // Gold by default (you owe / no activity yet) — green only when money is actually owed to you.
  const iconBg = isOwed ? "var(--hk-positive-soft)" : "var(--hk-accent-soft)";
  const iconColor = isOwed ? "var(--hk-positive)" : "var(--hk-accent-strong)";
  const CategoryIcon = getGroupTypeIcon(groupType?.name);

  return (
    <>
      <div className={`hk-card ${styles.card}`} onClick={() => navigate(CONSTANTS.PROJECT_ROUTES.GROUP + `/${props.group_id}`)}>
        <div className={styles.icon} style={{ background: iconBg, color: iconColor }}>
          <CategoryIcon size={20} strokeWidth={1.8} />
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <div className={styles.title}>{props.group_name}</div>
            {props.is_you_admin && <span className="hk-pill hk-pill-neutral">Admin</span>}
          </div>
          <div className={styles.meta}>
            <div className="hk-avatar-stack">
              {props.members.slice(0, 3).map((avatar, index) => (
                <div key={index} className={`hk-avatar ${styles.hkAvatar}`}>
                  {avatar ? <img src={avatar} alt="" className={styles.avatarImg} /> : null}
                </div>
              ))}
            </div>
            <span className={styles.count}>{props.total_members_count} members</span>
          </div>
        </div>

        <div className={styles.right}>
          {props.is_settled ? (
            <span className="hk-pill hk-pill-neutral">Settled</span>
          ) : (
            <div className={styles.amtCol}>
              <div className={`hk-money ${styles.amt}`} style={{ color: isOwing ? "var(--hk-negative)" : isOwed ? "var(--hk-positive)" : "var(--hk-ink-faint)" }}>
                {isOwing ? "− " : isOwed ? "+ " : ""}
                {formatMoney(balance)}
              </div>
              <div className={styles.label}>{isOwing ? "you owe" : isOwed ? "owed to you" : "settled up"}</div>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className={styles.menuBtn}>
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{ background: "var(--hk-surface)", color: "var(--hk-ink)", border: "1px solid var(--hk-border)" }}
              onClick={(e) => e.stopPropagation()}
            >
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
