import * as Yup from "yup";

const YupSchema = {
  userRegistrationSchema: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    upiAddress: Yup.string()
      .required("UPI Address is required")
      .matches(/^[\w.-]+@[\w]+$/, "Invalid UPI address"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
  userLoginSchema: Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
};

export default YupSchema;
