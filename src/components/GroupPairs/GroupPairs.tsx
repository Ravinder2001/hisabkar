import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { GroupDataType, GroupPairsData } from "../../utils/comman/CommanTypes";
import CustomCountUp from "../CustomCountUp/CustomCountUp";
import SimplifiedComponent from "../SimplifiedModal/SimplifiedModal";

type PropType = {
  pairsData: GroupPairsData;
  isSettled: boolean;
  GroupId: string;
  groupData: GroupDataType;
};

export default function GroupPairs(props: PropType) {
  const groupMembers = props.groupData.members;

  const [selectedTab, setSelectedTab] = useState("SEND");
  const [viewMode, setViewMode] = useState("SIMPLIFIED"); // Default to Simplified if settled, else Detailed

  const handleTabClick = () => {
    setSelectedTab(selectedTab === "SEND" ? "RECEIVE" : "SEND");
  };

  const handleViewModeClick = (mode: string) => {
    setViewMode(mode);
  };

  const totalSend = props.pairsData?.send.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalReceive = props.pairsData?.receive.reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <div className={styles.container}>
      {/* New Tab for Simplified/Detailed View */}
      <div className="grid w-full grid-cols-2 cursor-pointer mb-4">
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
          <div className="grid w-full grid-cols-2 cursor-pointer">
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
                  <h3 className="text-sm font-medium text-gray-500 mt-2">
                    You will pay{" "}
                    <span className="text-red-600 font-medium">
                      ₹<CustomCountUp count={totalSend} />
                    </span>
                  </h3>
                  <div className={styles.pairsBox}>
                    {props.pairsData?.send.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50 mb-2">
                        <div className="flex items-center gap-3">
                          <UserAvatar userImage={groupMembers.find((member) => member.id == item.user_id)?.avatar} />
                          <div>
                            <p className="text-sm font-medium">{groupMembers.find((member) => member.id == item.user_id)?.name}</p>
                            <p className="text-xs text-gray-500">you will pay</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 font-medium">
                            ₹<CustomCountUp count={Number(item.amount)} />
                          </span>
                          {props.isSettled ? <ArrowRight className="h-4 w-4 text-red-600" /> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No pending payments</div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {props.pairsData?.receive.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 mt-2">
                    You will receive{" "}
                    <span className="text-green-600 font-medium">
                      ₹<CustomCountUp count={totalReceive} />
                    </span>
                  </h3>
                  <div className={styles.pairsBox}>
                    {props.pairsData?.receive.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-50 mb-2">
                        <div className="flex items-center gap-3">
                          <UserAvatar userImage={groupMembers.find((member) => member.id == item.user_id)?.avatar} />
                          <div>
                            <p className="text-sm font-medium">{groupMembers.find((member) => member.id == item.user_id)?.name}</p>
                            <p className="text-xs text-gray-500">will pay you</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium">
                            ₹<CustomCountUp count={Number(item.amount)} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No pending receivables</div>
              )}
            </div>
          )}
        </>
      ) : (
        <SimplifiedComponent groupId={props.GroupId} groupMembers={groupMembers} />
      )}
    </div>
  );
}
