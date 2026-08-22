/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ModalComponent from "../ModalComponent/ModalComponent";
import { Check, CircleAlert } from "lucide-react";
import { ExpenseType, MemberType, ModalType, SplitType } from "../../utils/comman/CommanTypes";
import UserAvatar from "../Atoms/UserAvatar/UserAvatar";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";
import styles from "./style.module.css";
import { Tooltip } from "react-tooltip";

interface UserSplit {
  userId: string;
  amount: string;
}

interface FormValues {
  expenseName: string;
  description: string;
  amount: string;
  selectedUsers: string[];
  splitType: SplitType;
  userSplits: UserSplit[];
  expenseType: string;
}

import { EXPENSE_CATEGORIES } from "../../utils/constant/Categories";
import { getGroupTypeIcon } from "../../utils/comman/groupTypeIcon";

const validationSchema = Yup.object().shape({
  expenseName: Yup.string()
    .required("Expense name is required")
    .min(3, "Must be at least 3 characters")
    .max(20, "Must be at most 20 characters")
    .matches(/^[a-zA-Z\s]*$/, "Only letters and spaces are allowed"),
  description: Yup.string()
    .min(5, "Must be at least 5 characters")
    .max(500, "Must be at most 500 characters")
    .matches(/^[a-zA-Z0-9\s]*$/, "Only alphanumeric and spaces are allowed"),
  expenseType: Yup.string().required("Category is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .integer("Amount must be a whole number (no decimals)")
    .min(1, "Amount must be at least 1")
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
  callback,
  isClone,
  inPage = false,
}: ModalType & {
  groupId: string;
  memberList: MemberType;
  setExpenseList: Dispatch<SetStateAction<any>>;
  selectedRow: ExpenseType | null;
  callback: () => void;
  isClone: boolean;
  inPage?: boolean; // when true: render inline as a page, no modal wrapper
}) {
  const { fetchData: addExpense, response: addRes, isLoading } = useApiFetch("");
  const { fetchData: editExpense, response: editRes, isLoading: editLoading } = useApiFetch("");
  const [showDescription, setShowDescription] = useState(false);
  const formikRef = useRef<any>(null);

  const [initialValues, setInitialValues] = useState<FormValues>({
    expenseName: "",
    description: "",
    amount: "",
    selectedUsers: [],
    splitType: "EQUAL",
    userSplits: [],
    expenseType: "",
  });

  const validateSplits = (values: FormValues): boolean => {
    const totalAmount = parseFloat(values.amount);
    if (!totalAmount || values.selectedUsers.length === 0) return false;

    if (values.splitType === "PERCENTAGE") {
      const totalPercentage = values.userSplits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
      return Math.abs(totalPercentage - 100) < 1.0;
    }

    if (values.splitType === "CUSTOM") {
      const totalSplit = values.userSplits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
      return Math.abs(totalSplit - totalAmount) < 1.0;
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
        amount: Number(values.splitType === "PERCENTAGE" ? (parseFloat(values.amount) * parseFloat(split.amount)) / 100 : split.amount),
      }));

      await addExpense(CONSTANTS.API_ROUTES.ADD_EXPENSE + "/" + groupId, {
        method: "POST",
        data: {
          expenseName: values.expenseName,
          description: values.description,
          splitType: values.splitType,
          amount: parseFloat(values.amount),
          members,
          expenseType: values.expenseType,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditSubmit = async (values: FormValues, { setSubmitting, setErrors }: any) => {
    try {
      if (!validateSplits(values)) {
        setErrors({ userSplits: "Split amounts are invalid" });
        return;
      }

      const members = values.userSplits.map((split) => ({
        userId: split.userId,
        amount: Number(values.splitType === "PERCENTAGE" ? (parseFloat(values.amount) * parseFloat(split.amount)) / 100 : split.amount),
      }));

      await editExpense(CONSTANTS.API_ROUTES.EDIT_EXPENSE + `/${groupId}/${selectedRow?.expense_id}`, {
        method: "PUT",
        data: {
          expenseName: values.expenseName,
          description: values.description,
          splitType: values.splitType,
          amount: parseFloat(values.amount),
          members,
          expenseType: values.expenseType,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const successHandledRef = useRef<string | null>(null);

  useEffect(() => {
    if (addRes?.success === 1 && successHandledRef.current !== addRes.data[0].expense_id) {
      successHandledRef.current = addRes.data[0].expense_id;
      if (!inPage) setIsOpen();
      setExpenseList((prev: any) => {
        const isDuplicate = prev.some((exp: any) => exp.expense_id === addRes.data[0].expense_id);
        if (isDuplicate) return prev;
        return [addRes.data[0], ...prev];
      });
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
      callback();
    }
  }, [addRes, setIsOpen, callback, inPage]);

  const editHandledRef = useRef<string | null>(null);

  useEffect(() => {
    if (editRes?.success === 1 && editHandledRef.current !== editRes.data[0].expense_id) {
      editHandledRef.current = editRes.data[0].expense_id;
      setIsOpen();
      setExpenseList((prev: any) =>
        prev.map((expense: any) => (expense.expense_id === editRes.data[0].expense_id ? { ...editRes.data[0] } : expense))
      );
      callback();
    }
  }, [editRes, setIsOpen, callback]);

  useEffect(() => {
    if (isOpen) {
      if (selectedRow) {
        setInitialValues({
          expenseName: selectedRow.expense_name,
          description: selectedRow.description,
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
          expenseType: selectedRow.expense_type || "Others",
        });
      } else {
        setInitialValues({
          expenseName: "",
          description: "",
          amount: "",
          selectedUsers: [],
          splitType: "EQUAL",
          userSplits: [],
          expenseType: "",
        });
      }
    }
  }, [isOpen, selectedRow]);

  // ── Shared form body ─────────────────────────────────────────────────
  const formBody = (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={inPage} // re-init form when switching back to this tab
      onSubmit={selectedRow && !isClone ? handleEditSubmit : handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, handleBlur, resetForm }) => {
        const displayUsers = Array.from(new Map(memberList.map((m) => [m.id, m])).values()).filter((user) => user.is_current_user);
        const availableMemberIds = displayUsers.filter((user) => user.is_available).map((user) => user.id);

        return (
          <Form className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className={styles.label}>
                  Expense Name <span className={styles.required}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowDescription(!showDescription)}
                  className={`${styles.noteToggle} ${showDescription ? styles.noteToggleActive : ""}`}
                >
                  {showDescription ? "− Note" : "+ Note"}
                </button>
              </div>
              <Field name="expenseName">
                {({ field }: any) => (
                  <input
                    {...field}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="e.g. Dinner"
                    className={`${styles.input} ${touched.expenseName && errors.expenseName ? styles.inputError : ""}`}
                  />
                )}
              </Field>
              {touched.expenseName && errors.expenseName && <div className={styles.errorText}>{errors.expenseName}</div>}

              {showDescription && (
                <div className="mt-1">
                  <Field name="description">
                    {({ field }: any) => (
                      <textarea
                        {...field}
                        onBlur={handleBlur}
                        placeholder="Add a note..."
                        rows={2}
                        className={`${styles.input} ${styles.textarea} ${touched.description && errors.description ? styles.inputError : ""}`}
                      />
                    )}
                  </Field>
                  {touched.description && errors.description && <div className={styles.errorText}>{errors.description}</div>}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={styles.label}>Category</label>
              <div className={`${styles.categoryRow} ${inPage ? "" : styles.categoryRowModal}`}>
                {EXPENSE_CATEGORIES.map((cat) => {
                  const selected = values.expenseType === cat.label;
                  const CatIcon = getGroupTypeIcon(cat.label);
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setFieldValue("expenseType", cat.label)}
                      className={`${styles.categoryBtn} ${selected ? styles.categoryBtnSelected : ""} ${inPage ? "" : styles.categoryBtnFull}`}
                    >
                      <CatIcon size={16} strokeWidth={1.8} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              {touched.expenseType && errors.expenseType && <div className={styles.errorText}>{errors.expenseType}</div>}
            </div>

            <div className="space-y-1.5">
              <label className={styles.label}>
                Amount <span className={styles.required}>*</span>
              </label>
              <Field name="amount">
                {({ field }: any) => (
                  <input
                    type="number"
                    onWheel={(event) => event.currentTarget.blur()}
                    {...field}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setFieldValue("amount", e.target.value);
                      setFieldValue("selectedUsers", []);
                    }}
                    className={`${styles.input} ${touched.amount && errors.amount ? styles.inputError : ""}`}
                  />
                )}
              </Field>
              {touched.amount && errors.amount && <div className={styles.errorText}>{errors.amount}</div>}
            </div>
            <div className="space-y-1.5">
              <label className={styles.label}>Split Type</label>
              <div className={styles.splitTypeRow}>
                {["EQUAL", "PERCENTAGE", "CUSTOM"].map((type) => (
                  <div key={type} className={styles.splitTypeOption}>
                    <Field
                      type="radio"
                      name="splitType"
                      value={type}
                      onChange={(e: any) => {
                        setFieldValue("splitType", e.target.value);
                        setFieldValue("selectedUsers", []);
                      }}
                      id={type}
                      className={styles.radio}
                    />
                    <label htmlFor={type} className={styles.splitTypeLabel}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-1">
                <div className={styles.label}>
                  Select Users <span className={styles.required}>*</span>
                </div>
                <div className={styles.selectAllRow}>
                  <input
                    type="checkbox"
                    checked={availableMemberIds.length > 0 && availableMemberIds.every((id) => values.selectedUsers.includes(id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFieldValue("selectedUsers", availableMemberIds);

                        const amount = parseFloat(values.amount) || 0;
                        const splits = availableMemberIds.map((userId) => ({
                          userId,
                          amount: values.splitType === "EQUAL" && amount ? (amount / availableMemberIds.length).toFixed(2) : "",
                        }));

                        setFieldValue("userSplits", splits);
                      } else {
                        setFieldValue("selectedUsers", []);
                        setFieldValue("userSplits", []);
                      }
                    }}
                    className={styles.checkbox}
                  />
                </div>
              </div>
              <div className={styles.userGrid}>
                {displayUsers.map((user) => {
                  const UserName = user.name.split(" ")[0];
                  const selected = values.selectedUsers.includes(user.id);
                  return (
                    <div key={user.id} className={styles.userItem}>
                      <button
                        type="button"
                        onClick={() => {
                          const newSelected = selected ? values.selectedUsers.filter((id) => id !== user.id) : [...values.selectedUsers, user.id];
                          setFieldValue("selectedUsers", newSelected);
                          const amount = parseFloat(values.amount) || 0;
                          const splits = newSelected.map((userId) => ({
                            userId,
                            amount: values.splitType === "EQUAL" && amount ? (amount / newSelected.length).toFixed(2) : "",
                          }));
                          setFieldValue("userSplits", splits);
                        }}
                        className={`${styles.avatarBtn} ${selected ? styles.avatarBtnSelected : ""}`}
                      >
                        <UserAvatar userImage={user.avatar} userName={user.name} />

                        {selected && (
                          <div className={styles.checkBadge}>
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                      <div className={styles.userName}>
                        <div>{UserName}</div>
                        {!user.is_available ? (
                          <div
                            data-tooltip-id="user-not-available-tooltip"
                            data-tooltip-content={`${UserName} is currently unavailable. Click on the avatar to add them manually.`}
                          >
                            <CircleAlert color="var(--hk-negative)" size={14} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              {touched.selectedUsers && errors.selectedUsers && <div className={styles.errorText}>{errors.selectedUsers}</div>}
            </div>

            {values.selectedUsers.length > 0 && (
              <div className="space-y-1.5">
                <div className={styles.splitDetailsHeader}>
                  <label className={styles.label}>Split Details</label>
                  <span className={styles.remainingLabel}>
                    Remaining:{" "}
                    {values.splitType === "PERCENTAGE"
                      ? (100 - values.userSplits.reduce((sum, split) => sum + Number(split.amount || 0), 0)).toFixed(2) + "%"
                      : (Number(values.amount || 0) - values.userSplits.reduce((sum, split) => sum + Number(split.amount || 0), 0)).toFixed(2)}
                  </span>
                </div>
                <div className={styles.splitRows}>
                  {values.userSplits.map(({ userId }, index) => {
                    const user = memberList.find((u) => u.id === userId);
                    if (!user) return null;

                    return (
                      <div key={userId} className={styles.splitRow}>
                        <UserAvatar userImage={user.avatar} userName={user.name} />
                        <span className={styles.splitRowName}>{user.name.split(" ")[0]}</span>
                        <Field name={`userSplits.${index}.amount`}>
                          {({ field }: any) => (
                            <input
                              {...field}
                              type="text"
                              disabled={values.splitType === "EQUAL"}
                              className={`${styles.input} ${styles.splitInput}`}
                              placeholder={values.splitType === "PERCENTAGE" ? "%" : "0"}
                              value={
                                values.splitType === "EQUAL"
                                  ? Number(values.userSplits[index].amount || 0).toFixed(2)
                                  : values.userSplits[index].amount || ""
                              }
                            />
                          )}
                        </Field>
                      </div>
                    );
                  })}
                </div>
                {typeof errors.userSplits === "string" && <div className={styles.errorText}>{errors.userSplits}</div>}
              </div>
            )}

            <div className={inPage ? styles.pageSubmitRow : ""}>
              <button type="submit" className="hk-btn-primary" style={{ width: "100%" }} disabled={isLoading || editLoading}>
                {isLoading || editLoading ? (
                  <CustomCircularLoading />
                ) : selectedRow && !isClone ? (
                  "Edit Expense"
                ) : isClone ? (
                  "Clone Expense"
                ) : (
                  "Add Expense"
                )}
              </button>
              {inPage && (
                <button type="button" onClick={() => resetForm()} className={styles.resetBtn}>
                  Reset form
                </button>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );

  // ── Inline page mode (no modal) ───────────────────────────────────────
  if (inPage) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageForm}>{formBody}</div>
        <Tooltip id="user-not-available-tooltip" positionStrategy="fixed" style={{ maxWidth: "250px", zIndex: 999 }} />
      </div>
    );
  }

  // ── Modal mode (edit / clone) ─────────────────────────────────────────
  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.container}>
        <div className="text-sm font-bold mb-4">{selectedRow && !isClone ? "Edit" : isClone ? "Cloning" : "Add"} Expense</div>
        {formBody}
      </div>
      <Tooltip id="user-not-available-tooltip" positionStrategy="fixed" style={{ maxWidth: "250px", zIndex: 999 }} />
    </ModalComponent>
  );
}

export default AddExpenseModal;
