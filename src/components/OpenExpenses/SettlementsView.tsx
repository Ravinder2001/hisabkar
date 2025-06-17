import React from "react";
import { Check } from "lucide-react";
import type { Group } from "../../pages/OpenExpenses/OpenExpenses";
import { calculateSettlements } from "../../pages/OpenExpenses/OpenExpenses";

export default function SettlementsView({ group, getMemberName }: { group: Group; getMemberName: (memberId: string) => string }) {
  const settlements = calculateSettlements(group);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Settlement Summary</h3>

        {settlements.length === 0 ? (
          <div className="text-center py-8">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h4>
            <p className="text-gray-600">No payments needed between group members.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">To settle all expenses, the following payments need to be made:</p>
            {settlements.map((settlement: { from: string; to: string; amount: number }, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between space-x-2 sm:space-x-4">
                  {/* From person */}
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-semibold text-xs sm:text-base">
                        {getMemberName(settlement.from).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getMemberName(settlement.from)}</p>
                      <p className="text-xs sm:text-sm text-gray-600">owes</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-center flex-shrink-0 px-2">
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">₹{settlement.amount.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-gray-500">to pay</p>
                  </div>

                  {/* To person */}
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 justify-end">
                    <div className="text-right min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getMemberName(settlement.to)}</p>
                      <p className="text-xs sm:text-sm text-gray-600">receives</p>
                    </div>
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-xs sm:text-base">
                        {getMemberName(settlement.to).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
