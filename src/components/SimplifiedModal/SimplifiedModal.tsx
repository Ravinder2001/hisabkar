import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { ArrowRight, DollarSign } from "lucide-react";
import CustomAccordion from "../CustomAccordian/CustomAccordian";

type PropsType = {
  groupId: string;
  groupMembers: {
    id: string;
    name: string;
    avatar: string;
    total_spent: number;
    is_available: boolean;
  }[];
};

type SimplifiedDataType = {
  from: string;
  to: string;
  amount: number;
}[];

function SimplifiedComponent(props: PropsType) {
  const LoggedInUser = useSelector((state: RootState) => state.user.id);
  const [simplifiedData, setSimplifiedData] = useState<SimplifiedDataType>([]);

  const { fetchData, response, isLoading } = useApiFetch(CONSTANTS.API_ROUTES.GET_SIMPLIFIED + "/" + props.groupId);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (response?.success == 1) {
      setSimplifiedData(response.data);
    }
  }, [response]);

  // Helper function to get member name by ID
  const getMemberName = (id: string) => {
    const member = props.groupMembers.find((member) => {
      return member.id == String(id);
    });
    return member?.name || "Unknown";
  };

  // Helper function to get member avatar by ID
  const getMemberAvatar = (id: string) => {
    const member = props.groupMembers.find((member) => {
      return member.id == String(id);
    });
    return member?.avatar || "";
  };

  // Filter user's transactions
  const userTransactions = simplifiedData.filter((transaction) => transaction.from === LoggedInUser || transaction.to === LoggedInUser);

  return (
    <div id={styles.container} className="max-w-3xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">Expense Simplification</h2>

      {userTransactions.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:scale-[1.01]">
          <h3 className="text-sm sm:text-lg font-semibold text-indigo-700 mb-3 flex items-center">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Your Simplified Expenses
          </h3>
          <div className="space-y-3">
            {userTransactions.map((transaction, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  transaction.from === LoggedInUser ? "bg-red-50 border-l-4 border-red-400" : "bg-green-50 border-l-4 border-green-400"
                } transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={transaction.from === LoggedInUser ? getMemberAvatar(transaction.to) : getMemberAvatar(transaction.from)}
                      alt="User avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs text-white ${
                        transaction.from === LoggedInUser ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {transaction.from === LoggedInUser ? "→" : "←"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-gray-700 font-medium">{transaction.from === LoggedInUser ? "You owe" : "You get from"}</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      {transaction.from === LoggedInUser ? getMemberName(transaction.to) : getMemberName(transaction.from)}
                    </p>
                  </div>
                </div>
                <div className={`text-sm sm:text-lg font-bold ${transaction.from === LoggedInUser ? "text-red-600" : "text-green-600"}`}>
                  {transaction.from === LoggedInUser ? "-" : "+"}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CustomAccordion header="Group Simplification">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : simplifiedData.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base font-medium">No settlements to display</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">All expenses are already balanced</p>
          </div>
        ) : (
          <div className={`transition-all duration-500 overflow-auto`}>
            <div className="flow-root">
              <div className="flex flex-col">
                {simplifiedData.map((transaction, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 ${
                      index !== simplifiedData.length - 1 ? "border-b border-gray-100" : ""
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={getMemberAvatar(transaction.from) || "/placeholder.svg"}
                            alt={`${getMemberName(transaction.from)}'s avatar`}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        </div>
                        <ArrowRight className="mx-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <div className="relative">
                          <img
                            src={getMemberAvatar(transaction.to) || "/placeholder.svg"}
                            alt={`${getMemberName(transaction.to)}'s avatar`}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm sm:text-base font-medium text-gray-900">{getMemberName(transaction.from)}</p>
                        <p className="text-xs sm:text-sm text-gray-500">pays {getMemberName(transaction.to)}</p>
                      </div>
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CustomAccordion>

      {!isLoading && simplifiedData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-4">Transaction Flow</h4>
          <div className="relative bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-4 min-w-[500px]">
              {Array.from(new Set(simplifiedData.flatMap((transaction) => [transaction.from, transaction.to]))).map((memberId) => (
                <div
                  key={memberId}
                  className="flex flex-col items-center bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200 w-auto sm:w-24"
                >
                  <img
                    src={getMemberAvatar(memberId) || "/placeholder.svg"}
                    alt={`${getMemberName(memberId)}'s avatar`}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm mb-2"
                  />
                  <p className="text-xs font-medium text-center text-gray-800 truncate w-full">{getMemberName(memberId)}</p>
                  {(() => {
                    const outgoing = simplifiedData.filter((t) => t.from === memberId).reduce((sum, t) => sum + t.amount, 0);
                    const incoming = simplifiedData.filter((t) => t.to === memberId).reduce((sum, t) => sum + t.amount, 0);
                    const net = incoming - outgoing;
                    return (
                      <p className={`text-xs font-bold mt-1 ${net > 0 ? "text-green-600" : net < 0 ? "text-red-600" : "text-gray-500"}`}>
                        {net > 0 ? "+" : ""}₹{net.toFixed(2)}
                      </p>
                    );
                  })()}
                </div>
              ))}
            </div>
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
              {simplifiedData.map((transaction, index) => (
                <path
                  key={index}
                  d={`M 0,0 C 100,100 200,100 300,0`}
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="opacity-50"
                />
              ))}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimplifiedComponent;
