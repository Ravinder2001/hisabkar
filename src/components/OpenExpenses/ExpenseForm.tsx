import React, { useState } from "react";
import type { Group, Expense, ExpenseShare } from "../../pages/OpenExpenses/OpenExpenses";
import { generateId } from "../../pages/OpenExpenses/OpenExpenses";

interface ExpenseFormProps {
  group: Group;
  expense?: Expense;
  onSubmit: (expense: Expense) => void;
}

export default function ExpenseForm({ group, expense, onSubmit }: ExpenseFormProps) {
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [paidBy, setPaidBy] = useState(expense?.paidBy || group.members[0]?.id || "");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    expense?.shares.map((s: ExpenseShare) => s.memberId) || group.members.map((m) => m.id)
  );
  const [customShares, setCustomShares] = useState<{ [memberId: string]: string }>(
    expense?.shares.reduce(
      (acc: { [memberId: string]: string }, share: ExpenseShare) => ({
        ...acc,
        [share.memberId]: share.amount.toString(),
      }),
      {}
    ) || {}
  );

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]));
  };

  const updateCustomShare = (memberId: string, value: string) => {
    setCustomShares((prev) => ({
      ...prev,
      [memberId]: value,
    }));
  };

  const calculateShares = (): ExpenseShare[] => {
    const totalAmount = Number.parseFloat(amount) || 0;
    if (splitType === "equal") {
      const shareAmount = totalAmount / selectedMembers.length;
      return selectedMembers.map((memberId) => ({
        memberId,
        amount: shareAmount,
      }));
    } else {
      return selectedMembers.map((memberId) => ({
        memberId,
        amount: Number.parseFloat(customShares[memberId] || "0") || 0,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = calculateShares();
    const totalShares = shares.reduce((sum, share) => sum + share.amount, 0);
    const totalAmount = Number.parseFloat(amount) || 0;
    if (Math.abs(totalShares - totalAmount) > 0.01) {
      alert("The sum of shares must equal the total amount");
      return;
    }
    const expenseData: Expense = {
      id: expense?.id || generateId(),
      description: description.trim(),
      amount: totalAmount,
      paidBy,
      shares,
      date: expense?.date || new Date().toISOString(),
    };
    onSubmit(expenseData);
  };

  const shares = calculateShares();
  const totalShares = shares.reduce((sum, share) => sum + share.amount, 0);
  const totalAmount = Number.parseFloat(amount) || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What was this expense for?"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₹</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paid by</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {group.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Split between</label>
          <div className="space-y-3">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => toggleMember(member.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="flex-1 text-sm font-medium text-gray-900">{member.name}</span>
                {selectedMembers.includes(member.id) && splitType === "custom" && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={customShares[member.id] || ""}
                      onChange={(e) => updateCustomShare(member.id, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Split type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="equal"
                checked={splitType === "equal"}
                onChange={(e) => setSplitType(e.target.value as "equal" | "custom")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-900">Split equally</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="custom"
                checked={splitType === "custom"}
                onChange={(e) => setSplitType(e.target.value as "equal" | "custom")}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-900">Custom amounts</span>
            </label>
          </div>
        </div>
        {/* Share Summary */}
        {selectedMembers.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Share breakdown</h4>
            <div className="space-y-1">
              {shares.map((share) => (
                <div key={share.memberId} className="flex justify-between text-sm">
                  <span className="text-gray-600">{group.members.find((m) => m.id === share.memberId)?.name}</span>
                  <span className="font-medium">₹{share.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-1 mt-2 flex justify-between text-sm font-medium">
                <span>Total</span>
                <span className={totalShares === totalAmount ? "text-green-600" : "text-red-600"}>₹{totalShares.toFixed(2)}</span>
              </div>
            </div>
            {Math.abs(totalShares - totalAmount) > 0.01 && (
              <p className="text-red-600 text-xs mt-2">Shares must add up to ₹{totalAmount.toFixed(2)}</p>
            )}
          </div>
        )}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={Math.abs(totalShares - totalAmount) > 0.01}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {expense ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
