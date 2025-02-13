import React from "react";
import { Users2, Wallet, MoreVertical } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import styles from "./style.module.css";
import { GroupDataType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomCountUp from "../CustomCountUp/CustomCountUp";

function GroupDetailsContent(data: GroupDataType) {
  const GroupTypeList = useSelector((state: RootState) => state.data.groupTypeList);

  const groupType = GroupTypeList.find((type) => type.id === data.group_type_id);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-600">{data.group_name}</h2>
        <button className="hover:bg-gray-100 p-2 rounded-full">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        {groupType ? (
          <>
            <img src={groupType.icon ?? ""} alt={groupType.name} className="w-5 h-5" />
            <span>{groupType.name}</span>
          </>
        ) : (
          <span>Unknown Group Type</span>
        )}
      </div>
      {data.is_you_admin ? (
        <div className="flex items-center gap-2">
          <Users2 className="h-5 w-5 text-blue-500" />
          <span>{data.members.length} members</span>
          <Badge variant="secondary" className="ml-auto bg-yellow-100 text-yellow-800 border-yellow-200">
            You&apos;re admin
          </Badge>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-green-500" />
        <span className="text-green-600 font-semibold">
          ₹<CustomCountUp count={data.total_amount} />
        </span>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold">Members</h3>
        <div className={`${styles.membersCon} space-y-3`}>
          {data.members.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">
                  Spent: ₹<CustomCountUp count={member.total_spent} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupDetailsContent;
