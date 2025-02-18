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
};

type LogType = {
  log_id: number;
  name: string;
  action_type: "EDIT" | "DELETE" | "SETTLED" | "UNSETTLED" | "JOINED" | "LEFT";
  old_amount: string | null;
  new_amount: string | null;
  created_at: string;
  expense_id: number | null;
  expense_name: string | null;
};

const getActionDetails = (actionType: LogType["action_type"]) => {
  switch (actionType) {
    case "EDIT":
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
    default:
      return { icon: ExternalLink, color: "bg-gray-500", textColor: "text-gray-700" };
  }
};

const getActionMessage = (log: LogType) => {
  switch (log.action_type) {
    case "EDIT":
      return `edited the expense "${log.expense_name}"`;
    case "DELETE":
      return `deleted an expense`;
    case "SETTLED":
      return `settled the expenses`;
    case "UNSETTLED":
      return `unsettled the expenses`;
    case "JOINED":
      return `joined the group`;
    case "LEFT":
      return `left the group`;
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
                <div key={log.log_id} className="relative flex items-center w-full">
                  <div className={`absolute left-0 p-2 rounded-full ${color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Card className="ml-12 w-full transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-4">
                      <p className={`font-semibold ${textColor}`}>
                        {log.name} {getActionMessage(log)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                      {log.old_amount && log.new_amount && (
                        <p className="text-sm mt-2">
                          Amount changed from <span className="font-medium">{log.old_amount}</span> to{" "}
                          <span className="font-medium">{log.new_amount}</span>
                        </p>
                      )}
                      {log.expense_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            console.log(`Redirect to expense ${log.expense_id}`);
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Expense
                        </Button>
                      )}
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
