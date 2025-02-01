import React, { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ModalComponent from "../ModalComponent/ModalComponent";
import { Check } from "lucide-react";
import { MemberType, ModalType, OptionType } from "../../utils/comman/CommanTypes";
import CustomSelect from "../CustomSelect/CustomSelect";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";

type ValueType = {
  expenseName: string;
  description: string;
  expenseTypeId: OptionType;
  amount: string;
};

type PropsType = ModalType & {
  groupId: string;
  memberList: MemberType;
};

function AddExpenseModal(props: PropsType) {
  const { expenseTypeList } = useSelector((state: RootState) => state.data);

  const { fetchData: AddExpense, response: addRes } = useApiFetch("");

  const [optionList, setOptionList] = useState<OptionType[]>([]);

  const [values, setValues] = useState<ValueType>({
    expenseName: "",
    description: "",
    expenseTypeId: {
      value: "",
      label: "",
    },
    amount: "",
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [splitType, setSplitType] = useState("equal");

  const handleCheckboxChange = (value: string) => {
    setSplitType(value);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [name]: [value] }));
  };
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [name]: [value] }));
  };
  const handleSelectChange = (optionValue: OptionType) => {
    setValues((prev) => ({ ...prev, expenseTypeId: optionValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await AddExpense(CONSTANTS.API_ROUTES.ADD_EXPENSE + props.groupId, {
      data: {
        expenseName: "Taxi Fare",
        description: "Cricket matach tickets",
        expenseTypeId: 1,
        amount: 100,
        members: [
          {
            userId: 1,
            amount: 50,
          },
          {
            userId: 4,
            amount: 50,
          },
        ],
      },
    });
  };

  useEffect(() => {
    if (expenseTypeList.length) {
      setOptionList(
        expenseTypeList.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      );
    }
  }, [expenseTypeList]);

  useEffect(() => {
    if (addRes?.success == 1) {
      props.setIsOpen(false);
    }
  }, [addRes]);

  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expense Name</label>
          <Input name="expenseName" value={values.expenseName} onChange={handleChange} className="border-[#e5e7eb] rounded-lg" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea name="description" value={values.description} onChange={handleTextAreaChange} className="border-[#e5e7eb] rounded-lg" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expense Type</label>
          <CustomSelect
            name="expenseTypeId"
            value={values.expenseTypeId}
            onChange={handleSelectChange}
            options={optionList}
            placeholder="Select expense type"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input type="number" name="amount" value={values.amount} onChange={handleChange} className="border-[#e5e7eb] rounded-lg" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Users</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {props.memberList.map((user) => (
              <div key={user.id}>
                <button
                  type="button"
                  onClick={() => handleUserToggle(user.id)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-base font-medium ${
                    selectedUsers.includes(user.id) ? "bg-blue-100 text-blue-600 border-2 border-blue-200" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <UserAvatar userImage={user.avatar} userName={user.name} />
                  {selectedUsers.includes(user.id) && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
                <div className="text-xs text-center">{user.name.split(" ")[0]}</div>
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
              const user = props.memberList.find((u) => u.id === userId);
              if (!user) return null;
              return (
                <div key={user.id} className="flex items-center gap-3">
                  <UserAvatar userImage={user.avatar} userName={user.name} />
                  <span className="flex-1">{user.name.split(" ")[0]}</span>
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
