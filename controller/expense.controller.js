const expenseModel = require("../model/expense.model");
const usersModel = require("../model/users.model");
const common = require("./common.controller");
const { HttpStatus } = require("../utils/constant/constant");
const Messages = require("../utils/constant/messages");
const { trackExpenseChange } = require("../helpers/expenseLog");
const { sendNotificationsToUsers } = require("../helpers/pushService");
const { encryptData } = require("../utils/encryption");

module.exports = {
  addExpense: async (req, res) => {
    try {
      const response = await expenseModel.addExpense({ ...req.body, groupId: req.params.group_id, paidBy: req.user.user_id });

      // Check if the current user is included in the members
      const isYouIncluded = req.body.members.some((member) => member.userId === req.user.user_id);

      // Get all user IDs from group data except the current user
      const userIds = response.groupData.user_ids.map((id) => id.user_id).filter((id) => id !== req.user.user_id);

      // Count of other members (excluding current user)
      const otherMembersCount = req.body.members.filter((member) => member.userId !== req.user.user_id).length;

      let bodyText = `${req.user.name} has added ₹${response.expenseData[0].amount}`;
      if (isYouIncluded) {
        if (otherMembersCount > 0) {
          bodyText += ` with you and ${otherMembersCount} other${otherMembersCount > 1 ? "s" : ""}`;
        } else {
          bodyText += ` with you`;
        }
      } else {
        if (req.body.members.length > 0) {
          bodyText += ` with ${req.body.members.length} member${req.body.members.length > 1 ? "s" : ""}`;
        }
      }

      if (userIds.length) {
        let subscriptions = await usersModel.getUsersSWData(userIds);

        if (subscriptions.length) {
          const payload = {
            title: `${req.body.expenseName} | ${response.groupData.group_name}`,
            body: bodyText,
            group_id: encryptData(req.params.group_id),
          };
          subscriptions.forEach((sub) => sendNotificationsToUsers(sub, payload));
        }
      }

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response.expenseData);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  editExpense: async (req, res) => {
    try {
      const response = await expenseModel.editExpense({ ...req.body, expenseId: req.params.expense_id, paidBy: req.user.user_id });

      // Extract all user IDs from req.body.members except the current user
      const userIds = response.groupData.user_ids.map((id) => id.user_id).filter((id) => id !== req.user.user_id);

      if (userIds.length) {
        let subscriptions = await usersModel.getUsersSWData(userIds);

        if (subscriptions.length) {
          // Send notifications to each subscription
          const payload = {
            title: response.groupData.group_name,
            body: `${req.user.name} has edited an expense.`,
            group_id: encryptData(req.params.group_id),
          };
          subscriptions.forEach((sub) => sendNotificationsToUsers(sub, payload));
        }
      }

      await trackExpenseChange({
        groupId: response.groupId,
        expenseId: req.params.expense_id,
        userId: req.user.user_id,
        actionType: "EDIT",
        oldAmount: response.oldAmount,
        newAmount: req.body.amount,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response.expenseData);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getAllExpenses: async (req, res) => {
    try {
      const { lastId, limit } = req.query;
      let data = await expenseModel.getAllExpenses({
        groupId: req.params.group_id,
        userId: req.user.user_id,
        lastId: lastId ? parseInt(lastId) : null,
        limit: limit ? parseInt(limit) : 10,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, data, data.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  deleteExpense: async (req, res) => {
    try {
      let response = await expenseModel.deleteExpense(req.params.expense_id, req.user.user_id);

      // Extract all user IDs from req.body.members except the current user
      const userIds = response.groupData.user_ids.map((id) => id.user_id).filter((id) => id !== req.user.user_id);

      if (userIds.length) {
        let subscriptions = await usersModel.getUsersSWData(userIds);

        if (subscriptions.length) {
          // Send notifications to each subscription
          const payload = {
            title: response.groupData.group_name,
            body: `${req.user.name} has deleted an expense.`,
            group_id: encryptData(req.params.group_id),
          };
          subscriptions.forEach((sub) => sendNotificationsToUsers(sub, payload));
        }
      }

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
};
