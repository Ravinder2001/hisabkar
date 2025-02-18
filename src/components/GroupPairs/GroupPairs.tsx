import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { GroupPairsData } from "../../utils/comman/CommanTypes";
import CustomCountUp from "../CustomCountUp/CustomCountUp";

type PropType = {
  pairsData: GroupPairsData;
};

export default function GroupPairs(props: PropType) {
  const [selectedTab, setSelectedTab] = useState("SEND");

  const handleTabClick = () => {
    setSelectedTab(selectedTab == "SEND" ? "RECEIVE" : "SEND");
  };

  const totalSend = props.pairsData?.send.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalReceive = props.pairsData?.receive.reduce((acc, item) => acc + Number(item.amount), 0);

  return (
    <div className={styles.container}>
      <div className="grid w-full grid-cols-2 cursor-pointer">
        <div onClick={handleTabClick} className={selectedTab == "SEND" ? styles.activeTab : styles.inActiveTab}>
          Send ({props.pairsData?.send.length})
        </div>
        <div onClick={handleTabClick} className={selectedTab == "RECEIVE" ? styles.activeTab : styles.inActiveTab}>
          Receive ({props.pairsData?.receive.length})
        </div>
      </div>
      {selectedTab == "SEND" ? (
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
                      <UserAvatar />
                      <div>
                        <p className="text-sm font-medium">{item.user_name}</p>
                        <p className="text-xs text-gray-500">you will pay</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-medium">
                        ₹<CustomCountUp count={Number(item.amount)} />
                      </span>
                      <ArrowRight className="h-4 w-4 text-red-600" />
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
                      <UserAvatar />
                      <div>
                        <p className="text-sm font-medium">{item.user_name}</p>
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
    </div>
  );
}
