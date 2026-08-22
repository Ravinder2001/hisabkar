const Messages = {
  // Expense Messages
  EXPENSE: {
    ADD_SUCCESS: "Expense added successfully.",
    ADD_ERROR: "Failed to add expense. Please try again.",

    EDIT_SUCCESS: "Expense updated successfully.",
    EDIT_ERROR: "Failed to update expense. Please try again.",

    DELETE_SUCCESS: "Expense deleted successfully.",
    DELETE_ERROR: "Failed to delete expense. Please try again.",
    DELETE_ALERT: (expenseName: string) => `Are you sure you want to delete this ${expenseName} expense?`,
    DELETE_GROUP: (expenseName: string) => `Are you sure you want to delete this ${expenseName} group?`,
    LEAVE_GROUP: (expenseName: string) => `Are you sure you want to leave this ${expenseName} group?`,
    SETTLEMENT_ALERT: (status: boolean) => `Are you sure you want to ${status ? "Un-settle" : "Settle"} this group?`,

    NOT_FOUND: "Expense not found.",
    INVALID_AMOUNT: "Invalid amount. Please enter a valid number.",
  },

  // Expense Log Messages
  LOGS: {
    FETCH_SUCCESS: "Expense logs retrieved successfully.",
    FETCH_ERROR: "Failed to retrieve expense logs. Please try again.",
    NO_LOGS: "No logs available for this group.",
    ADD_EXPENSE: "Expense added successfully!",
    EDIT_EXPENSE: "Expense edited successfully!",
    GROUP_CREATED: "Group created successfully!",
    WELCOME: (name: string) => `Welcome to Hisabkar! ${name}`,
  },

  // General Messages
  GENERAL: {
    SERVER_ERROR: "Something went wrong. Please try again later.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    INVALID_INPUT: "Invalid input. Please check your data and try again.",
  },
};

export default Messages;
