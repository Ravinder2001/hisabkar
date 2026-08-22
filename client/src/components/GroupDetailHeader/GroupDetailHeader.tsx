import React, { useState } from "react";
import { ChevronLeft, MoreVertical, UserPlus, Settings, Logs, CircleCheckBig, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ModalComponent from "../ModalComponent/ModalComponent";
import CustomCountUp from "../CustomCountUp/CustomCountUp";
import { MemberType } from "../../utils/comman/CommanTypes";
import styles from "./style.module.css";

type PropsType = {
  groupName: string;
  memberCount: number;
  groupTypeName: string;
  members: MemberType;
  isYouAdmin: boolean;
  isSettled: boolean;
  onBack: () => void;
  onAddMember: () => void;
  onGroupSettings: () => void;
  onLogs: () => void;
  onToggleSettlement: () => void;
  onDownload: () => void;
};

const VISIBLE_AVATARS = 2;

function GroupDetailHeader(props: PropsType) {
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const remainingCount = props.members.length - VISIBLE_AVATARS;

  return (
    <div className={styles.header}>
      <button className={styles.backBtn} onClick={props.onBack} aria-label="Back">
        <ChevronLeft size={20} />
      </button>

      <div className={styles.titleBlock}>
        <div className={styles.groupName}>{props.groupName}</div>
        <div className={styles.subtitle}>
          {props.memberCount} member{props.memberCount === 1 ? "" : "s"}
          {props.groupTypeName ? (
            <>
              {" · "}
              <span className={styles.groupType}>{props.groupTypeName}</span>
            </>
          ) : null}
        </div>
      </div>

      <button type="button" className={styles.avatarStackBtn} onClick={() => setMembersModalOpen(true)} aria-label="View members">
        <div className="hk-avatar-stack">
          {props.members.slice(0, VISIBLE_AVATARS).map((member, index) => (
            <div
              key={member.id}
              className="hk-avatar"
              style={{ width: 28, height: 28, fontSize: "0.68rem", background: `var(--hk-avatar-${(index % 5) + 1})` }}
            >
              {member.avatar ? (
                <img src={member.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              ) : (
                member.name?.[0]?.toUpperCase()
              )}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="hk-avatar" style={{ width: 28, height: 28, fontSize: "0.62rem", background: "var(--hk-surface-sunken)", color: "var(--hk-ink-soft)" }}>
              +{remainingCount}
            </div>
          )}
        </div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={styles.menuBtn} aria-label="Group menu">
            <MoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ background: "var(--hk-surface)", color: "var(--hk-ink)", border: "1px solid var(--hk-border)" }}>
          {props.isYouAdmin && !props.isSettled && (
            <DropdownMenuItem onClick={props.onAddMember} className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add Members</span>
            </DropdownMenuItem>
          )}
          {props.isYouAdmin && !props.isSettled && (
            <DropdownMenuItem onClick={props.onGroupSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Group Settings</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={props.onLogs} className="cursor-pointer">
            <Logs className="mr-2 h-4 w-4" />
            <span>Group Logs</span>
          </DropdownMenuItem>
          {props.isYouAdmin && (
            <DropdownMenuItem onClick={props.onToggleSettlement} className="cursor-pointer" style={{ color: "var(--hk-positive)" }}>
              <CircleCheckBig className="mr-2 h-4 w-4" />
              <span>{props.isSettled ? "Un-settle this group" : "Make Settlement"}</span>
            </DropdownMenuItem>
          )}
          {props.isSettled && (
            <DropdownMenuItem onClick={props.onDownload} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              <span>Download Group Data</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalComponent isOpen={membersModalOpen} setIsOpen={setMembersModalOpen}>
        <div className={styles.membersModal}>
          <div className={styles.membersModalTitle}>Members</div>
          <div className={styles.membersList}>
            {props.members.map((member, index) => (
              <div key={member.id} className={styles.memberRow}>
                <div className="hk-avatar" style={{ width: 40, height: 40, fontSize: "0.9rem", background: `var(--hk-avatar-${(index % 5) + 1})` }}>
                  {member.avatar ? (
                    <img src={member.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                  ) : (
                    member.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div className={styles.memberInfo}>
                  <div className={styles.memberName}>
                    {member.name}
                    {!member.is_current_user && <span className={styles.memberLeft}> (User Left)</span>}
                  </div>
                  <div className={styles.memberSpent}>
                    Spent: ₹<CustomCountUp count={member.total_spent} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}

export default GroupDetailHeader;
