import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { GroupPairsData, MemberType } from "../../utils/comman/CommanTypes";
import CustomCountUp from "../CustomCountUp/CustomCountUp";
import SimplifiedComponent from "../SimplifiedModal/SimplifiedModal";

type PropType = {
  pairsData: GroupPairsData;
  isSettled: boolean;
  GroupId: string;
  groupMembers: MemberType;
};

export default function GroupPairs(props: PropType) {
  const groupMembers = props.groupMembers;

  const [selectedTab, setSelectedTab] = useState("SEND");
  const [viewMode, setViewMode] = useState("SIMPLIFIED");

  const handleTabClick = () => {
    setSelectedTab(selectedTab === "SEND" ? "RECEIVE" : "SEND");
  };

  const handleViewModeClick = (mode: string) => {
    setViewMode(mode);
  };

  const totalSend = props.pairsData?.send.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalReceive = props.pairsData?.receive.reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <div className={styles.container} style={{ color: "var(--hk-ink)" }}>
      {/* New Tab for Simplified/Detailed View */}
      <div className="grid w-full grid-cols-2 cursor-pointer mb-4 gap-2">
        <div onClick={() => handleViewModeClick("SIMPLIFIED")} className={viewMode === "SIMPLIFIED" ? styles.activeTab : styles.inActiveTab}>
          Simplified
        </div>

        <div onClick={() => handleViewModeClick("DETAILED")} className={viewMode === "DETAILED" ? styles.activeTab : styles.inActiveTab}>
          Detailed
        </div>
      </div>

      {/* Content based on View Mode */}
      {viewMode === "DETAILED" ? (
        <>
          {/* Send/Receive Tabs inside Detailed View */}
          <div className="grid w-full grid-cols-2 cursor-pointer gap-2">
            <div onClick={handleTabClick} className={selectedTab === "SEND" ? styles.activeTab : styles.inActiveTab}>
              Send ({props.pairsData?.send.length})
            </div>
            <div onClick={handleTabClick} className={selectedTab === "RECEIVE" ? styles.activeTab : styles.inActiveTab}>
              Receive ({props.pairsData?.receive.length})
            </div>
          </div>

          {/* Send/Receive Content */}
          {selectedTab === "SEND" ? (
            <div className="space-y-4">
              {props.pairsData?.send.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium mt-2" style={{ color: "var(--hk-ink-soft)" }}>
                    You will pay{" "}
                    <span className="font-medium" style={{ color: "var(--hk-negative)" }}>
                      ₹<CustomCountUp count={totalSend} />
                    </span>
                  </h3>
                  <div className={styles.pairsBox}>
                    {props.pairsData?.send.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg mb-2"
                        style={{ background: "var(--hk-negative-soft)" }}
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar userImage={groupMembers.find((member) => member.id == item.user_id)?.avatar} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--hk-ink)" }}>
                              {groupMembers.find((member) => member.id == item.user_id)?.name}
                            </p>
                            <p className="text-xs" style={{ color: "var(--hk-ink-faint)" }}>
                              you will pay
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: "var(--hk-negative)" }}>
                            ₹<CustomCountUp count={Number(item.amount)} />
                          </span>
                          {props.isSettled ? <ArrowRight className="h-4 w-4" style={{ color: "var(--hk-negative)" }} /> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6" style={{ color: "var(--hk-ink-faint)" }}>
                  No pending payments
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {props.pairsData?.receive.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium mt-2" style={{ color: "var(--hk-ink-soft)" }}>
                    You will receive{" "}
                    <span className="font-medium" style={{ color: "var(--hk-positive)" }}>
                      ₹<CustomCountUp count={totalReceive} />
                    </span>
                  </h3>
                  <div className={styles.pairsBox}>
                    {props.pairsData?.receive.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg mb-2"
                        style={{ background: "var(--hk-positive-soft)" }}
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar userImage={groupMembers.find((member) => member.id == item.user_id)?.avatar} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--hk-ink)" }}>
                              {groupMembers.find((member) => member.id == item.user_id)?.name}
                            </p>
                            <p className="text-xs" style={{ color: "var(--hk-ink-faint)" }}>
                              will pay you
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: "var(--hk-positive)" }}>
                            ₹<CustomCountUp count={Number(item.amount)} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6" style={{ color: "var(--hk-ink-faint)" }}>
                  No pending receivables
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <SimplifiedComponent groupId={props.GroupId} groupMembers={groupMembers} isSettled={props.isSettled} />
      )}
    </div>
  );
}
