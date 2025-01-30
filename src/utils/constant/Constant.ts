const CONSTANTS = {
  LOCAL_STORAGE_KEY: "key-name",
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
  PROJECT_ROUTES: {
    AUTHTICATION: "/authentication",
    HOME: "/",
    GROUP: "/group",
  },
  API_ROUTES: {
    GOOGLE_SIGN_IN: "user/google-signin",
    SEND_LOGIN_OTP: "user/login-send-otp",
    SEND_OTP: "user/send-otp",
    LOGIN: "user/login",
    REGISTER: "user/register",
    ALL_GROUPS: "group",
  },
};
export default CONSTANTS;
