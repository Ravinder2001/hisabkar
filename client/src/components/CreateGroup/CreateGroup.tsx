/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import ModalComponent from "../ModalComponent/ModalComponent";
import { ModalType, OptionType } from "../../utils/comman/CommanTypes";
import { getGroupTypeIcon } from "../../utils/comman/groupTypeIcon";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";
import Messages from "../../utils/constant/Messages";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";
import styles from "./style.module.css";

interface FormValues {
  groupName: string;
  groupTypeId: OptionType;
}

const validationSchema = Yup.object().shape({
  groupName: Yup.string().required("Group name is required").min(3, "Must be at least 3 characters"),
  groupTypeId: Yup.object().shape({
    value: Yup.string().required("Group type is required"),
    label: Yup.string().required("Please select a group type"),
  }),
});

function CreateGroupModal({
  isOpen,
  setIsOpen,
  callbackFunc,
  setIsShareGroupModal,
}: ModalType & {
  callbackFunc: (e: any) => void;
  setIsShareGroupModal: Dispatch<SetStateAction<{ status: boolean; groupCode: string }>>;
}) {
  const { groupTypeList } = useSelector((state: RootState) => state.data);
  const { fetchData: createGroup, response: createRes, isLoading: createGroupLoading } = useApiFetch("");

  const initialValues: FormValues = {
    groupName: "",
    groupTypeId: { value: "", label: "" },
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      await createGroup(CONSTANTS.API_ROUTES.CREATE_GROUP, {
        method: "POST",
        data: {
          groupName: values.groupName,
          groupTypeId: values.groupTypeId.value,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (createRes?.success === 1) {
      setIsOpen(false);
      setIsShareGroupModal({
        status: true,
        groupCode: createRes.data.code,
      });
      callbackFunc(createRes.data.group_data);
      showToast(Messages.LOGS.GROUP_CREATED, "success");
    }
  }, [createRes]);

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen} className={styles.container}>
      <div className={styles.header}>
        <motion.div
          className={styles.headerIcon}
          initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <Sparkles size={20} />
        </motion.div>
        <div>
          <div className={styles.title}>Create a group</div>
          <div className={styles.subtitle}>Give it a name and pick what it&apos;s for</div>
        </div>
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} validateOnBlur={false} onSubmit={handleSubmit}>
        {({ errors, touched, isSubmitting, handleBlur, values, setFieldValue, setFieldTouched }) => {
          const PreviewIcon = getGroupTypeIcon(values.groupTypeId.label);
          const hasType = !!values.groupTypeId.value;

          return (
            <Form className={styles.form} noValidate>
              <div className={styles.field}>
                <label className={styles.label}>Group name</label>
                <Field name="groupName">
                  {({ field }: any) => (
                    <input
                      {...field}
                      onBlur={handleBlur}
                      className={`${styles.input} ${touched.groupName && errors.groupName ? styles.inputError : ""}`}
                      placeholder="e.g. Goa Trip 2026"
                      autoFocus
                    />
                  )}
                </Field>
                {touched.groupName && errors.groupName && <div className={styles.errorText}>{errors.groupName}</div>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Group type</label>
                <div className={styles.typeGrid}>
                  {groupTypeList.map((type, index) => {
                    const TypeIcon = getGroupTypeIcon(type.name);
                    const selected = values.groupTypeId.value === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        type="button"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.025 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${styles.typeCard} ${selected ? styles.typeCardSelected : ""}`}
                        onClick={() => {
                          setFieldValue("groupTypeId", { value: type.id, label: type.name });
                          setFieldTouched("groupTypeId", true, false);
                        }}
                      >
                        <span className={styles.typeCardIcon}>
                          <TypeIcon size={18} strokeWidth={1.8} />
                        </span>
                        <span className={styles.typeCardLabel}>{type.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {touched.groupTypeId && errors.groupTypeId?.value && <div className={styles.errorText}>{errors.groupTypeId.value}</div>}
              </div>

              <div className={styles.preview}>
                <div className={styles.previewLabel}>Preview</div>
                <div className={styles.previewRow}>
                  <span className={`${styles.previewIcon} ${hasType ? styles.previewIconActive : ""}`}>
                    <PreviewIcon size={18} strokeWidth={1.8} />
                  </span>
                  <div className={styles.previewBody}>
                    <div className={styles.previewName}>{values.groupName || "Your group name"}</div>
                    <div className={styles.previewMeta}>1 member · You</div>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`hk-btn-primary ${styles.submitBtn}`}
                disabled={isSubmitting}
              >
                {createGroupLoading ? (
                  <CustomCircularLoading />
                ) : (
                  <>
                    Create group
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </Form>
          );
        }}
      </Formik>
    </ModalComponent>
  );
}

export default CreateGroupModal;
