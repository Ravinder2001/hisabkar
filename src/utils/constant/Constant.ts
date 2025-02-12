const CONSTANTS = {
  LOCAL_STORAGE_KEY: "key-name",
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
  PROJECT_ROUTES: {
    AUTHTICATION: "/authentication",
    HOME: "/",
    GROUP: "/group",
    JOIN_GROUP: "/join-group",
  },
  API_ROUTES: {
    GOOGLE_SIGN_IN: "/user/google-signin",
    SEND_LOGIN_OTP: "/user/login-send-otp",
    SEND_OTP: "/user/send-otp",
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    ALL_GROUPS: "/group",
    EXPENSE_TYPE_LIST: "/expense/expenseTypeList",
    GROUP_TYPE_LIST: "/group/groupTypeList",
    GROUP_DETAILS: "/group/single/",
    ALL_EXPENSES: "/expense/getAllExpenses/",
    ADD_EXPENSE: "/expense/addExpense/",
    CREATE_GROUP: "/group/createGroup/",
    JOIN_GROUP: "/group/joinGroup/",
    MY_PAIRS: "/group/myPairs/",
    DELETE_EXPENSE: "/expense/",
    SW_SUBSCRIPTION: "/user/service-worker-subscribe",
  },
};
export default CONSTANTS;
