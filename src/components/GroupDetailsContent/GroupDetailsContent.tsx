import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CircleCheckBig, MoreVertical, Users2, Wallet } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import styles from "./style.module.css";
import { GroupDataType } from "../../utils/comman/CommanTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomCountUp from "../CustomCountUp/CustomCountUp";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import useApiFetch from "../../hooks/useAPIFetch";
import CustomAlert from "../CustomAlert/CustomAlert";
import Messages from "../../utils/constant/Messages";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";

function GroupDetailsContent(
  data: GroupDataType & {
    GroupId: string;
    setGroupData: Dispatch<SetStateAction<GroupDataType | null>>;
  }
) {
  const GroupTypeList = useSelector((state: RootState) => state.data.groupTypeList);
  const groupType = GroupTypeList.find((type) => type.id === data.group_type_id);

  const { fetchData: toggleSettlement, response: settlementRes, isLoading: settlementLoading } = useApiFetch("");

  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  const handleSettlement = () => {
    toggleSettlement(CONSTANTS.API_ROUTES.GROUP_SETTLEMENT + "/" + data.GroupId);
  };
  const handleConfirmModal = () => {
    setConfirmationModal(!confirmationModal);
  };

  useEffect(() => {
    if (settlementRes?.success == 1) {
      showToast(settlementRes?.message ?? "", "success");
      handleConfirmModal();
      data.setGroupData((prev) => (prev ? { ...prev, is_settled: !prev.is_settled } : prev));
    }
  }, [settlementRes]);

  return (
    <div className={`space-y-6 ${styles.container}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-600">{data.group_name}</h2>
        {data.is_you_admin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={handleConfirmModal} className="text-black-600 dark:text-red-400 bg-white cursor-pointer">
                <CircleCheckBig className="mr-2 h-4 w-4" color="green" />
                <span className="text-green-800">{data.is_settled ? "Un-settle this group" : "Make Settlement"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
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
      <CustomAlert
        isOpen={confirmationModal}
        onClose={handleConfirmModal}
        onSubmit={handleSettlement}
        description={Messages.EXPENSE.SETTLEMENT_ALERT(data.is_settled)}
        isLoading={settlementLoading}
      />
    </div>
  );
}

export default GroupDetailsContent;
