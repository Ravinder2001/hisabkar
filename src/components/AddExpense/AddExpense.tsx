import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ModalComponent from "../ModalComponent/ModalComponent";
import { Check } from "lucide-react";
import { ModalType } from "../../utils/comman/CommanTypes";
import CustomSelect from "../CustomSelect/CustomSelect";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";

interface User {
  id: number;
  name: string;
  avatar: string;
}

const MOCK_USERS: User[] = [
  { id: 1, name: "Alice", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Bob", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "David", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "David", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 6, name: "David", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 7, name: "David", avatar: "/placeholder.svg?height=40&width=40" },
];

const MOCK_EXPENSE_TYPES = [
  { value: "1", label: "Food" },
  { value: "2", label: "Transport" },
  { value: "3", label: "Entertainment" },
];

function AddExpenseModal(props: ModalType) {
  const [expenseName, setExpenseName] = useState("");
  const [expenseTypeId, setExpenseTypeId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [splitType, setSplitType] = useState("equal");

  const handleCheckboxChange = (value: string) => {
    setSplitType(value);
  };

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ expenseName, expenseTypeId, amount, selectedUsers, splitType });
    // onClose();
  };

  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expense Name</label>
          <Input value={expenseName} onChange={(e) => setExpenseName(e.target.value)} className="border-[#e5e7eb] rounded-lg" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expense Type</label>
          <CustomSelect options={MOCK_EXPENSE_TYPES} placeholder="Select expense type" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-[#e5e7eb] rounded-lg" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Users</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {MOCK_USERS.map((user) => (
              <div key={user.id}>
                <button
                  type="button"
                  onClick={() => handleUserToggle(user.id)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-base font-medium ${
                    selectedUsers.includes(user.id) ? "bg-blue-100 text-blue-600 border-2 border-blue-200" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <UserAvatar />
                  {selectedUsers.includes(user.id) && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
                <div className="text-xs">Ravinder</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Split Type</label>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="equal"
                checked={splitType === "equal"}
                onChange={() => handleCheckboxChange("equal")}
                className="border-2 border-gray-200"
              />
              <label htmlFor="equal" className="ml-2 text-sm">
                Equal
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="percentage"
                checked={splitType === "percentage"}
                onChange={() => handleCheckboxChange("percentage")}
                className="border-2 border-gray-200"
              />
              <label htmlFor="percentage" className="ml-2 text-sm">
                Percentage
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="custom"
                checked={splitType === "custom"}
                onChange={() => handleCheckboxChange("custom")}
                className="border-2 border-gray-200"
              />
              <label htmlFor="custom" className="ml-2 text-sm">
                Custom
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Split Details</label>
          <div className="space-y-3 mt-2">
            {selectedUsers.map((userId) => {
              const user = MOCK_USERS.find((u) => u.id === userId);
              if (!user) return null;
              return (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">{user.initial}</div>
                  <span className="flex-1">{user.name}</span>
                  <Input type="text" className="w-24 border-[#e5e7eb] rounded-lg text-right" placeholder={splitType === "percentage" ? "%" : "0"} />
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white rounded-lg py-2">
          Add Expense
        </Button>
      </form>
    </ModalComponent>
  );
}

export default AddExpenseModal;
