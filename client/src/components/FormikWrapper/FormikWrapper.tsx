/* eslint-disable */
import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import styles from "./style.module.css";
import YupSchema from "../../utils/comman/YupValidations";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

type YupSchemaKeys = keyof typeof YupSchema;

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  isDynamic?: boolean;
  customComponent?: React.ReactNode;
}

interface ReusableFormProps {
  initialValues: Record<string, any>;
  schemaName: YupSchemaKeys;
  onSubmit: (values: any) => void;
  fields: FormField[];
  submitButtonText?: string;
  isLoading?: boolean; // Added prop
}

const FormikWrapper: React.FC<ReusableFormProps> = ({
  initialValues,
  schemaName,
  onSubmit,
  fields,
  submitButtonText = "Submit",
  isLoading = false, // Default to false
}) => {
  return (
    <Formik initialValues={initialValues} validationSchema={YupSchema[schemaName]} onSubmit={onSubmit}>
      {({ values }) => (
        <Form className={styles.formContainer}>
          {fields.map((field, index) =>
            field.customComponent ? (
              <div key={index} className={styles.customComponent}>
                {field.customComponent}
                <ErrorMessage name={field.name} component="div" className={styles.errorMsg} />
              </div>
            ) : field.isDynamic ? (
              <FieldArray
                key={index}
                name={field.name}
                render={(arrayHelpers) => (
                  <div className={styles.dynamicFieldContainer}>
                    <label className={styles.label}>{field.label}</label>
                    {values[field.name].map((_: any, idx: number) => (
                      <div key={idx} className={styles.dynamicField}>
                        <Field name={`${field.name}[${idx}]`} type={field.type} placeholder={field.placeholder} className={styles.input} />
                        <button type="button" onClick={() => arrayHelpers.remove(idx)} className={styles.removeButton}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => arrayHelpers.push("")} className={styles.addButton}>
                      Add
                    </button>
                    <ErrorMessage name={field.name} component="div" className={styles.errorMsg} />
                  </div>
                )}
              />
            ) : (
              <div key={index} className={styles.fieldContainer}>
                <label htmlFor={field.name} className={styles.label}>
                  {field.label}
                </label>
                <Field id={field.name} name={field.name} type={field.type} placeholder={field.placeholder} className={styles.input} />
                <ErrorMessage name={field.name} component="div" className={styles.errorMsg} />
              </div>
            )
          )}
          <ButtonComponent isLoading={isLoading} text={submitButtonText} />
        </Form>
      )}
    </Formik>
  );
};

export default FormikWrapper;
