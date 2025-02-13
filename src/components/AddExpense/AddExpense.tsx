/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../ui/input";
import ModalComponent from "../ModalComponent/ModalComponent";
import { Check } from "lucide-react";
import { ExpenseType, MemberType, ModalType, OptionType, SplitType } from "../../utils/comman/CommanTypes";
import CustomSelect from "../CustomSelect/CustomSelect";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";
import Messages from "../../utils/constant/Messages";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

interface UserSplit {
  userId: string;
  amount: string;
}

interface FormValues {
  expenseName: string;
  description: string;
  expenseTypeId: OptionType;
  amount: string;
  selectedUsers: string[];
  splitType: SplitType;
  userSplits: UserSplit[];
}

const validationSchema = Yup.object().shape({
  expenseName: Yup.string().required("Expense name is required").min(3, "Must be at least 3 characters").max(20, "Must be at most 20 characters"),
  description: Yup.string().min(5, "Must be at least 5 characters").max(100, "Must be at most 100 characters"),
  expenseTypeId: Yup.object().shape({
    value: Yup.string().required("Expense type is required"),
    label: Yup.string().required("Please select an expense type"),
  }),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .min(0.01, "Amount must be greater than 0")
    .max(999999, "Amount must be lesser than 999999"),
  selectedUsers: Yup.array().min(1, "Select at least one user").required("Select users to split with"),
});

function AddExpenseModal({
  isOpen,
  setIsOpen,
  groupId,
  memberList,
  setExpenseList,
  selectedRow,
}: ModalType & {
  groupId: string;
  memberList: MemberType;
  setExpenseList: Dispatch<SetStateAction<any>>;
  selectedRow: ExpenseType | null;
}) {
  const { expenseTypeList } = useSelector((state: RootState) => state.data);
  const { fetchData: addExpense, response: addRes, isLoading } = useApiFetch("");

  const [initialValues, setInitialValues] = useState<FormValues>({
    expenseName: "",
    description: "",
    expenseTypeId: { value: "", label: "" },
    amount: "",
    selectedUsers: [],
    splitType: "EQUAL",
    userSplits: [],
  });

  const validateSplits = (values: FormValues): boolean => {
    const totalAmount = parseFloat(values.amount);
    if (!totalAmount || values.selectedUsers.length === 0) return false;

    if (values.splitType === "PERCENTAGE") {
      const totalPercentage = values.userSplits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
      return Math.abs(totalPercentage - 100) < 0.01;
    }

    if (values.splitType === "CUSTOM") {
      const totalSplit = values.userSplits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
      return Math.abs(totalSplit - totalAmount) < 0.01;
    }

    return true;
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, setErrors }: any) => {
    try {
      if (!validateSplits(values)) {
        setErrors({ userSplits: "Split amounts are invalid" });
        return;
      }

      const members = values.userSplits.map((split) => ({
        userId: split.userId,
        amount: Number(values.splitType === "PERCENTAGE" ? ((parseFloat(values.amount) * parseFloat(split.amount)) / 100).toFixed(2) : split.amount),
      }));

      await addExpense(CONSTANTS.API_ROUTES.ADD_EXPENSE + "/" + groupId, {
        method: "POST",
        data: {
          expenseName: values.expenseName,
          description: values.description,
          splitType: values.splitType,
          expenseTypeId: values.expenseTypeId.value,
          amount: parseFloat(values.amount),
          members,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const DetectFormChanges = ({ values, setFieldValue }: any) => {
    useEffect(() => {
      setFieldValue("selectedUsers", []);
    }, [values.amount, values.splitType]);
    return null;
  };

  useEffect(() => {
    if (addRes?.success === 1) {
      setIsOpen();
      setExpenseList((prev: any) => [addRes.data[0], ...prev]);
      showToast(Messages.LOGS.ADD_EXPENSE, "success");
    }
  }, [addRes, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      if (selectedRow) {
        setInitialValues({
          expenseName: selectedRow.expense_name,
          description: selectedRow.description,
          expenseTypeId: {
            value: selectedRow.expense_type_id,
            label: expenseTypeList.find((et) => et.id === selectedRow.expense_type_id)?.name || "",
          },
          amount: selectedRow.amount.toString(),
          selectedUsers: selectedRow.members.map((member) => member.id),
          splitType: selectedRow.split_type,
          userSplits:
            selectedRow.split_type === "PERCENTAGE"
              ? selectedRow.members.map((member) => {
                  const percentage = (member.amount / selectedRow.amount) * 100; // Calculate percentage

                  return {
                    userId: member.id,
                    amount: percentage.toString(), // Assign the calculated amount
                  };
                })
              : selectedRow.members.map((member) => ({
                  userId: member.id,
                  amount: member.amount.toString(),
                })),
        });
      } else {
        setInitialValues({
          expenseName: "",
          description: "",
          expenseTypeId: { value: "", label: "" },
          amount: "",
          selectedUsers: [],
          splitType: "EQUAL",
          userSplits: [],
        });
      }
    }
  }, [isOpen, selectedRow, expenseTypeList]);

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="text-md font-bold mb-6">Add Expense</div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue, handleBlur }) => (
          <Form className="space-y-6" noValidate>
            <DetectFormChanges values={values} setFieldValue={setFieldValue} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Expense Name</label>
              <Field name="expenseName">
                {({ field }: any) => (
                  <Input
                    {...field}
                    onBlur={handleBlur}
                    className={`border-[#e5e7eb] rounded-lg ${touched.expenseName && errors.expenseName ? "border-red-500" : ""}`}
                  />
                )}
              </Field>
              {touched.expenseName && errors.expenseName && <div className="text-red-500 text-xs">{errors.expenseName}</div>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Field name="description">
                {({ field }: any) => (
                  <Textarea
                    {...field}
                    onBlur={handleBlur}
                    className={`border-[#e5e7eb] rounded-lg ${touched.description && errors.description ? "border-red-500" : ""}`}
                  />
                )}
              </Field>
              {touched.description && errors.description && <div className="text-red-500 text-xs">{errors.description}</div>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expense Type</label>
              <Field name="expenseTypeId">
                {({ field, form }: any) => (
                  <CustomSelect
                    {...field}
                    options={expenseTypeList.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    onChange={(option: OptionType) => {
                      form.setFieldValue("expenseTypeId", option);
                      form.setFieldTouched("expenseTypeId", true, false);
                    }}
                    placeholder="Select expense type"
                    className={touched.expenseTypeId && errors.expenseTypeId?.value ? "border-red-500" : ""}
                  />
                )}
              </Field>
              {touched.expenseTypeId && errors.expenseTypeId?.value && <div className="text-red-500 text-xs">{errors.expenseTypeId.value}</div>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Field name="amount">
                {({ field }: any) => (
                  <Input
                    type="number"
                    onWheel={(event) => event.currentTarget.blur()}
                    {...field}
                    onBlur={handleBlur}
                    className={`border-[#e5e7eb] rounded-lg ${touched.amount && errors.amount ? "border-red-500" : ""}`}
                  />
                )}
              </Field>
              {touched.amount && errors.amount && <div className="text-red-500 text-xs">{errors.amount}</div>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Split Type</label>
              <div className="flex gap-4">
                {["EQUAL", "PERCENTAGE", "CUSTOM"].map((type) => (
                  <div key={type} className="flex items-center">
                    <Field type="radio" name="splitType" value={type} id={type} className="border-2 border-gray-200" />
                    <label htmlFor={type} className="ml-2 text-sm capitalize">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Users</label>
              <div className="flex flex-wrap gap-4">
                {memberList.map((user) => (
                  <div key={user.id} className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newSelected = values.selectedUsers.includes(user.id)
                          ? values.selectedUsers.filter((id) => id !== user.id)
                          : [...values.selectedUsers, user.id];
                        setFieldValue("selectedUsers", newSelected);
                        const amount = parseFloat(values.amount) || 0;
                        const splits = newSelected.map((userId) => ({
                          userId,
                          amount: values.splitType === "EQUAL" && amount ? (amount / newSelected.length).toFixed(2) : "",
                        }));
                        setFieldValue("userSplits", splits);
                      }}
                      className={`flex items-center justify-center relative w-12 h-12 rounded-full ${
                        values.selectedUsers.includes(user.id) ? "bg-blue-100 border-2 border-blue-200" : "bg-gray-100"
                      }`}
                    >
                      <UserAvatar userImage={user.avatar} userName={user.name} />
                      {values.selectedUsers.includes(user.id) && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                    <div className="text-xs mt-1">{user.name.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
              {touched.selectedUsers && errors.selectedUsers && <div className="text-red-500 text-xs mt-1">{errors.selectedUsers}</div>}
            </div>
            {values.selectedUsers.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Split Details</label>
                <div className="space-y-3">
                  {values.userSplits.map(({ userId }, index) => {
                    const user = memberList.find((u) => u.id === userId);
                    if (!user) return null;

                    return (
                      <div key={userId} className="flex items-center gap-3">
                        <UserAvatar userImage={user.avatar} userName={user.name} />
                        <span className="flex-1">{user.name}</span>
                        <Field name={`userSplits.${index}.amount`}>
                          {({ field }: any) => (
                            <Input
                              {...field}
                              type="text"
                              disabled={values.splitType === "EQUAL"}
                              className="w-24 text-right"
                              placeholder={values.splitType === "PERCENTAGE" ? "%" : "0"}
                            />
                          )}
                        </Field>
                      </div>
                    );
                  })}
                </div>

                {typeof errors.userSplits === "string" && <div className="text-red-500 text-xs mt-1">{errors.userSplits}</div>}
              </div>
            )}
            <ButtonComponent type="submit" text="Add Expense" isLoading={isLoading} />
          </Form>
        )}
      </Formik>
    </ModalComponent>
  );
}

export default AddExpenseModal;
