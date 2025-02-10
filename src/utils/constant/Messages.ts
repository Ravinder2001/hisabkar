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

    NOT_FOUND: "Expense not found.",
    INVALID_AMOUNT: "Invalid amount. Please enter a valid number.",
  },

  // Expense Log Messages
  LOGS: {
    FETCH_SUCCESS: "Expense logs retrieved successfully.",
    FETCH_ERROR: "Failed to retrieve expense logs. Please try again.",
    NO_LOGS: "No logs available for this group.",
    ADD_EXPENSE: "Expense added successfully!",
    GROUP_CREATED: "Group created successfully!",
  },

  // General Messages
  GENERAL: {
    SERVER_ERROR: "Something went wrong. Please try again later.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    INVALID_INPUT: "Invalid input. Please check your data and try again.",
  },
};

export default Messages;
