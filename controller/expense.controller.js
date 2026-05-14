const expenseModel = require("../model/expense.model");
const usersModel = require("../model/users.model");
const common = require("./common.controller");
const { HttpStatus, TIME } = require("../utils/constant/constant");
const { generateCacheKey } = require("../utils/common/common");
const redisClient = require("../configuration/redis");
const Messages = require("../utils/constant/messages");
const { trackExpenseChange } = require("../helpers/expenseLog");
const { sendNotificationsToUsers } = require("../helpers/pushService");
const { encryptData } = require("../utils/encryption");

module.exports = {
  addExpense: async (req, res) => {
    try {
      const response = await expenseModel.addExpense({ ...req.body, groupId: req.params.group_id, paidBy: req.user.user_id });

      // Check if the current user is included in the members
      // const isYouIncluded = req.body.members.some((member) => member.userId === req.user.user_id);

      // Get all user IDs from group data except the current user
      const userIds = response.groupData.user_ids.map((id) => id.user_id).filter((id) => id !== req.user.user_id);
      const involvedMemberIds = req.body.members.map((member) => member.userId);

      if (userIds.length) {
        let subscriptions = await usersModel.getUsersSWData(userIds);

        if (subscriptions.length) {
          subscriptions.forEach((sub) => {
            const isRecipientInvolved = involvedMemberIds.some((id) => id == sub.user_id);
            let bodyText = `${req.user.name} has added ₹${response.expenseData[0].amount}`;

            if (isRecipientInvolved) {
              const othersInSplitCount = involvedMemberIds.length - 1;
              if (othersInSplitCount > 0) {
                bodyText += ` with you and ${othersInSplitCount} other${othersInSplitCount > 1 ? "s" : ""}`;
              } else {
                bodyText += ` with you`;
              }
            } else {
              const splitCount = involvedMemberIds.length;
              bodyText += ` with ${splitCount} member${splitCount > 1 ? "s" : ""}`;
            }

            const payload = {
              title: `${req.body.expenseName} | ${response.groupData.group_name}`,
              body: bodyText,
              group_id: encryptData(req.params.group_id),
            };
            sendNotificationsToUsers(sub, payload);
          });
        }
      }

      // Invalidate the group expenses cache
      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:expenses`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response.expenseData);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  editExpense: async (req, res) => {
    try {
      const response = await expenseModel.editExpense({ ...req.body, expenseId: req.params.expense_id, paidBy: req.user.user_id });

      // Extract all user IDs from group data except the current user
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

      // Invalidate the group expenses cache
      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:expenses`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response.expenseData);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getAllExpenses: async (req, res) => {
    try {
      const { lastId, limit } = req.query;
      const isFirstPage = !lastId;
      const cacheKey = generateCacheKey(`group:${req.params.group_id}:expenses`);

      if (isFirstPage) {
        const cachedExpenses = await redisClient.get(cacheKey);
        if (cachedExpenses) {
          console.log(`⚡ CACHE HIT for ${cacheKey}`);
          const parsedData = JSON.parse(cachedExpenses);
          return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, parsedData, parsedData.length);
        }
        console.log(`🐌 CACHE MISS for ${cacheKey}. Fetching from PostgreSQL...`);
      }

      let data = await expenseModel.getAllExpenses({
        groupId: req.params.group_id,
        userId: req.user.user_id,
        lastId: lastId ? parseInt(lastId) : null,
        limit: limit ? parseInt(limit) : 10,
      });

      if (isFirstPage) {
        await redisClient.setEx(cacheKey, TIME.REDIS_CACHE_EXPIRY, JSON.stringify(data));
      }

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, data, data.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  deleteExpense: async (req, res) => {
    try {
      let response = await expenseModel.deleteExpense(req.params.expense_id, req.user.user_id);

      // Extract all user IDs from group data except the current user
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

      // Invalidate the group expenses cache
      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:expenses`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
};
