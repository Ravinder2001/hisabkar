import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Target, X } from "lucide-react";
import useApiFetch from "../../hooks/useAPIFetch";
import CircularProgress from "./CircularProgress";

interface BudgetSetterProps {
  groupId: string;
  onBudgetSet: () => void;
}

export default function BudgetSetter({ groupId, onBudgetSet }: BudgetSetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [budgetVal, setBudgetVal] = useState("");
  const [budgetData, setBudgetData] = useState({ budget: 0, total_spent: 0 });

  const { fetchData: fetchBudgetDetails, response: budgetRes } = useApiFetch("/group/budgetDetails/" + groupId);
  const { fetchData: updateBudget, response: updateRes, isLoading } = useApiFetch("/group/setBudget/" + groupId);

  useEffect(() => {
    fetchBudgetDetails();
  }, [groupId]);

  useEffect(() => {
    if (budgetRes?.success === 1) {
      setBudgetData(budgetRes.data);
      setBudgetVal(budgetRes.data.budget > 0 ? budgetRes.data.budget.toString() : "");
    }
  }, [budgetRes]);

  const handleSave = async () => {
    if (!budgetVal || isNaN(Number(budgetVal))) return;
    await updateBudget(undefined, {
      method: "POST",
      data: { budget: Number(budgetVal) },
    });
  };

  useEffect(() => {
    if (updateRes?.success === 1) {
      setIsOpen(false);
      fetchBudgetDetails();
      onBudgetSet();
    }
  }, [updateRes]);

  const currentBudget = budgetData.budget;
  const totalSpent = budgetData.total_spent;
  const percentage = currentBudget > 0 ? Math.min(100, Math.round((totalSpent / currentBudget) * 100)) : 0;
  const remaining = currentBudget > 0 ? Math.max(0, currentBudget - totalSpent) : 0;

  return (
    <div className="relative">
      <Button
        className="fixed bottom-6 right-24 rounded-full w-14 h-14 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white p-0 flex items-center justify-center transform transition-transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 99998 }}
      >
        {currentBudget > 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-1 font-bold text-[10px]">
            <CircularProgress percentage={percentage} />
          </div>
        ) : (
          <Target className="w-6 h-6" />
        )}
      </Button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-64 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl bg-white border border-slate-100 flex flex-col animate-in slide-in-from-bottom-5"
          style={{ zIndex: 99999 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-sm text-slate-800">Your Group Budget</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {currentBudget > 0 && (
            <div className="mb-5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
              <div className="flex justify-between mb-2">
                <span>Total Budget:</span>
                <span className="font-semibold text-slate-900">₹{Number(currentBudget).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Spent:</span>
                <span className="font-semibold text-red-500">₹{Number(totalSpent).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-200 pt-2 mt-2">
                <span>Remaining:</span>
                <span className="text-emerald-600 text-[13px]">₹{Number(remaining).toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Budget Amount"
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className="h-10 text-sm focus-visible:ring-indigo-500 rounded-lg shadow-sm"
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              {isLoading ? "..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
