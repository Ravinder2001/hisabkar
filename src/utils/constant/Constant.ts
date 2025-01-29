const CONSTANTS = {
  LOCAL_STORAGE_KEY: "key-name",
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
  PROJECT_ROUTES: {
    AUTHTICATION: "/authentication",
    HOME: "/",
  },
  API_ROUTES: {
    GOOGLE_SIGN_IN: "user/google-signin",
  },
};
export default CONSTANTS;
