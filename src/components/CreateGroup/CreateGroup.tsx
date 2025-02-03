/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ModalComponent from "../ModalComponent/ModalComponent";
import { ModalType, OptionType } from "../../utils/comman/CommanTypes";
import CustomSelect from "../CustomSelect/CustomSelect";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import showToast from "../../utils/helpers/toastHelper";
import Messages from "../../utils/constant/Messages";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
}: ModalType & {
  callbackFunc: () => void;
}) {
  const { groupTypeList } = useSelector((state: RootState) => state.data);
  const { fetchData: createGroup, response: createRes } = useApiFetch("");

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
      callbackFunc();
      showToast(Messages.LOGS.GROUP_CREATED, "success");
    }
  }, [createRes]);

  return (
    <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="text-md font-bold mb-6">Create Group</div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, isSubmitting, handleBlur }) => (
          <Form className="space-y-6" noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Field name="groupName">
                {({ field }: any) => (
                  <Input
                    {...field}
                    onBlur={handleBlur}
                    className={`border-[#e5e7eb] rounded-lg ${touched.groupName && errors.groupName ? "border-red-500" : ""}`}
                    placeholder="Enter group name"
                  />
                )}
              </Field>
              {touched.groupName && errors.groupName && <div className="text-red-500 text-xs">{errors.groupName}</div>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Group Type</label>
              <Field name="groupTypeId">
                {({ field, form }: any) => (
                  <CustomSelect
                    {...field}
                    options={groupTypeList.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    onChange={(option: OptionType) => {
                      form.setFieldValue("groupTypeId", option);
                      form.setFieldTouched("groupTypeId", true, false);
                    }}
                    placeholder="Select group type"
                    className={touched.groupTypeId && errors.groupTypeId?.value ? "border-red-500" : ""}
                  />
                )}
              </Field>
              {touched.groupTypeId && errors.groupTypeId?.value && <div className="text-red-500 text-xs">{errors.groupTypeId.value}</div>}
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white rounded-lg py-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating Group..." : "Create Group"}
            </Button>
          </Form>
        )}
      </Formik>
    </ModalComponent>
  );
}

export default CreateGroupModal;
