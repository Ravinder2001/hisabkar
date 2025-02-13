import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
// import { Users, MoreVertical, Trash2, IndianRupee } from "lucide-react";
import { Users, IndianRupee } from "lucide-react";
import { GroupType } from "../../utils/comman/CommanTypes";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../utils/constant/Constant";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomCountUp from "../CustomCountUp/CustomCountUp";

export function propsCard(props: GroupType) {
  const navigate = useNavigate();
  const groupTypeList = useSelector((state: RootState) => state.data.groupTypeList);

  const groupType = groupTypeList.find((type) => type.id === props.group_type_id);
  return (
    <Card
      onClick={() => navigate(CONSTANTS.PROJECT_ROUTES.GROUP + `/${props.group_id}`)}
      className="w-[100%] max-w-sm overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-bl-full opacity-20"></div>
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300">{props.group_name}</CardTitle>
        {/* <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem className="text-red-600 dark:text-red-400 bg-white">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete this group</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
              <img src={groupType?.icon ?? ""} alt={groupType?.name} className="w-6 h-6 object-cover" />
            </div>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-300">{groupType?.name}</span>
          </div>
          <div className="flex items-center space-x-2 justify-self-end">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">{props.total_members_count} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <IndianRupee className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-300">
              ₹<CustomCountUp count={props.total_amount} />
            </span>
          </div>
          <div className="justify-self-end">
            {props.is_you_admin && (
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700"
              >
                You&apos;re admin
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-4 mt-4">
        <div className={styles.card_wrapper}>
          <div className={styles.card_wrapper_acounts}>
            {props.remaining_members > 0 ? <div className={styles.card_score}>{props.remaining_members}</div> : null}

            {props.members.map((userImage, index) => (
              <div key={index} className={styles.card_acounts}>
                <UserAvatar userImage={userImage} />
              </div>
            ))}
          </div>
        </div>
        <Badge variant={props.is_settled ? "secondary" : "default"} className="bg-black text-white backdrop-blur-sm">
          {props.is_settled ? "Settled" : "Unsettled"}
        </Badge>
      </CardFooter>
    </Card>
  );
}

export default propsCard;
