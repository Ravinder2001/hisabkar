/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ExternalLink, Edit, Trash, Check, X, UserPlus, UserMinus } from "lucide-react";

import styles from "./style.module.css";

type PropsType = {
  groupId: string;
  isOpen: boolean;
  setIsOpen: () => void;
  onExpenseClick: (id: any) => void;
};

type LogType = {
  log_id: number;
  name: string;
  action_type: "EDIT" | "DELETE" | "SETTLED" | "UNSETTLED" | "JOINED" | "LEFT" | "ADDED" | "REMOVED" | "EDIT_GROUP";
  old_amount: string | null;
  new_amount: string | null;
  created_at: string;
  expense_id: number | null;
  expense_name: string | null;
  details: {
    amount: number;
    members: {
      name: string;
      amount: number;
    }[];
    expense_name: string;
    added_by: string;
    removed_user: string;
    new_group_name: string;
    new_group_type: string;
    old_group_name: string;
    old_group_type: string;
  } | null;
};

const getActionDetails = (actionType: LogType["action_type"]) => {
  switch (actionType) {
    case "EDIT":
      return { icon: Edit, color: "bg-blue-500", textColor: "text-blue-700" };
    case "EDIT_GROUP":
      return { icon: Edit, color: "bg-blue-500", textColor: "text-blue-700" };
    case "DELETE":
      return { icon: Trash, color: "bg-red-500", textColor: "text-red-700" };
    case "SETTLED":
      return { icon: Check, color: "bg-green-500", textColor: "text-green-700" };
    case "UNSETTLED":
      return { icon: X, color: "bg-yellow-500", textColor: "text-yellow-700" };
    case "JOINED":
      return { icon: UserPlus, color: "bg-purple-500", textColor: "text-purple-700" };
    case "LEFT":
      return { icon: UserMinus, color: "bg-pink-500", textColor: "text-pink-700" };
    case "REMOVED":
      return { icon: UserMinus, color: "bg-red-500", textColor: "text-red-700" };
    case "ADDED":
      return { icon: UserPlus, color: "bg-pink-500", textColor: "text-pink-700" };
    default:
      return { icon: ExternalLink, color: "bg-gray-500", textColor: "text-gray-700" };
  }
};

const getActionMessage = (log: LogType) => {
  switch (log.action_type) {
    case "EDIT":
      return `edited the expense "${log.expense_name}".`;
    case "DELETE":
      return `deleted an expense.`;
    case "SETTLED":
      return `settled the expenses.`;
    case "UNSETTLED":
      return `unsettled the expenses.`;
    case "JOINED":
      return `joined the group.`;
    case "LEFT":
      return `left the group.`;
    case "ADDED":
      return `added to group`;
    case "REMOVED":
      return `removed`;
    case "EDIT_GROUP":
      return `edited the group settings`;
    default:
      return `performed an action`;
  }
};

function GroupLogs(props: PropsType) {
  const { fetchData, response, isLoading } = useApiFetch("");

  const [logData, setLogData] = useState<LogType[]>([]);

  useEffect(() => {
    fetchData(CONSTANTS.API_ROUTES.GROUP_LOGS + "/" + props.groupId);
  }, [props.groupId]);

  useEffect(() => {
    if (response?.success == 1) {
      setLogData(response.data);
    }
  }, [response]);
  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <div className={styles.container}>
        <h1 className="text-3xl font-bold mb-2 text-center">Activity Timeline</h1>
        {isLoading ? (
          <div className="w-full h-full flex justify-center">
            <CustomCircularLoading />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            {logData.map((log) => {
              const { icon: Icon, color, textColor } = getActionDetails(log.action_type);

              return (
                <div key={log.log_id} className="relative flex items-center w-full" style={{ marginTop: "0px" }}>
                  <div className={`absolute left-0 p-2 rounded-full ${color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Card className="ml-12 w-full">
                    <CardContent className="p-4">
                      <p className={`font-semibold ${textColor}`}>
                        {log.name} {getActionMessage(log)}{" "}
                        {log.action_type === "ADDED"
                          ? `by ${log.details?.added_by}.`
                          : log.action_type === "REMOVED"
                            ? `${log.details?.removed_user} from the group.`
                            : ""}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                      {log.old_amount && log.new_amount && log.action_type !== "DELETE" && (
                        <p className="text-sm mt-2">
                          Amount changed from <span className="font-medium">{log.old_amount}</span> to{" "}
                          <span className="font-medium">{log.new_amount}</span>
                        </p>
                      )}

                      {log.action_type === "DELETE" && log.details && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                          <h4 className="font-medium text-gray-900">{log.details.expense_name}</h4>
                          <p className="text-sm text-gray-700 mt-1">
                            Total amount: <span className="font-medium">{log.details.amount}</span>
                          </p>

                          <div className="mt-3">
                            <p className="text-xs text-gray-500 uppercase font-medium mb-2">Split between</p>
                            <div className="space-y-2">
                              {log.details.members.map((member, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{member.name}</span>
                                  <span className="font-medium">{member.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {log.action_type === "EDIT_GROUP" && log.details && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                          <h4 className="font-medium text-gray-900">Group Settings Changed</h4>
                          {log.details.old_group_name !== log.details.new_group_name && (
                            <p className="text-sm text-gray-700 mt-1">
                              Group name changed from <span className="font-medium italic">{log.details.old_group_name}</span> to{" "}
                              <span className="font-medium italic">{log.details.new_group_name}</span>
                            </p>
                          )}
                          {log.details.old_group_type !== log.details.new_group_type && (
                            <p className="text-sm text-gray-700 mt-1">
                              Group type changed from <span className="font-medium italic">{log.details.old_group_type}</span> to{" "}
                              <span className="font-medium italic">{log.details.new_group_type}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {log.expense_id ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            props.setIsOpen();
                            props.onExpenseClick(log.expense_id);
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Expense
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ModalComponent>
  );
}

export default GroupLogs;
