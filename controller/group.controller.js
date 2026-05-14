const groupModel = require("../model/group.model");
const usersModel = require("../model/users.model");
const common = require("./common.controller");
const { HttpStatus, TIME } = require("../utils/constant/constant");
const Messages = require("../utils/constant/messages");
const { getExpenseChangeLog, trackExpenseChange } = require("../helpers/expenseLog");
const ExcelJS = require("exceljs");
const { sendNotificationsToUsers } = require("../helpers/pushService");
const { maskEmail, generateCacheKey } = require("../utils/common/common");
const { encryptData } = require("../utils/encryption");
const { DEMO_GROUP_ID } = require("../configuration/config");
const redisClient = require("../configuration/redis");

module.exports = {
  createGroup: async (req, res) => {
    try {
      const createRes = await groupModel.createGroup({
        ...req.body,
        userId: req.user.user_id,
      });
      createRes.group_data.group_id = await encryptData(createRes.group_data.group_id);

      // Invalidate the cache for the user's groups
      await redisClient.del(generateCacheKey(`user:${req.user.user_id}:groups`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, createRes);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  joinGroup: async (req, res) => {
    try {
      const response = await groupModel.joinGroup({
        groupCode: req.params.group_code,
        userId: req.user.user_id,
      });

      // Extract all user IDs from req.body.members except the current user
      const userIds = response.groupMembers.filter((id) => id !== req.user.user_id);

      if (userIds.length) {
        let subscriptions = await usersModel.getUsersSWData(userIds);

        if (subscriptions.length) {
          // Send notifications to each subscription
          const payload = {
            title: response.group_name,
            body: `${req.user.name} has joined the group.`,
            group_id: encryptData(response.group_id),
          };
          subscriptions.forEach((sub) => sendNotificationsToUsers(sub, payload));
        }
      }

      await trackExpenseChange({
        groupId: response.group_id,
        expenseId: null,
        userId: req.user.user_id,
        actionType: "JOINED",
        oldAmount: null,
        newAmount: null,
      });
      // Invalidate the cache for the user's groups
      await redisClient.del(generateCacheKey(`user:${req.user.user_id}:groups`));

      await redisClient.del(generateCacheKey(`group:${response.group_id}:members`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  leaveGroup: async (req, res) => {
    try {
      const response = await groupModel.leaveGroup({
        groupId: req.params.group_id,
        userId: req.user.user_id,
      });

      await trackExpenseChange({
        groupId: req.params.group_id,
        expenseId: null,
        userId: req.user.user_id,
        actionType: "LEFT",
        oldAmount: null,
        newAmount: null,
      });
      // Invalidate the cache for the user's groups
      await redisClient.del(generateCacheKey(`user:${req.user.user_id}:groups`));

      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:members`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getAllGroups: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const cacheKey = generateCacheKey(`user:${userId}:groups`);

      // ==========================================
      // SCENARIO A: Check Cache (Cache Hit)
      // ==========================================

      const cachedGroups = await redisClient.get(cacheKey);
      if (cachedGroups) {
        // If it exists in Redis, parse it back to JSON and return instantly!
        console.log(`⚡ CACHE HIT for ${cacheKey}`);
        const groupList = JSON.parse(cachedGroups);
        return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, groupList, groupList.length);
      }

      // ==========================================
      // SCENARIO B: Fetch from Database (Cache Miss)
      // ==========================================
      console.log(`🐌 CACHE MISS for ${cacheKey}. Fetching from PostgreSQL...`);
      let groupList = await groupModel.getAllGroups(userId);
      // Encrypt group_id properly (your existing code)
      groupList = await Promise.all(
        groupList.map(async (item) => ({
          ...item,
          group_id: await encryptData(item.group_id),
        }))
      );
      // Save the fresh database result into Redis
      await redisClient.setEx(cacheKey, TIME.REDIS_CACHE_EXPIRY, JSON.stringify(groupList));
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, groupList, groupList.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getGroupDataById: async (req, res) => {
    try {
      let groupList = await groupModel.getGroupDataById({
        groupId: req.params.group_id,
        userId: req.user.user_id,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, groupList);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getGroupMembers: async (req, res) => {
    try {
      const cacheKey = generateCacheKey(`group:${req.params.group_id}:members`);
      const cachedMembers = await redisClient.get(cacheKey);

      if (cachedMembers) {
        console.log(`⚡ CACHE HIT for ${cacheKey}`);
        const parsedMembers = JSON.parse(cachedMembers);
        return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, parsedMembers, parsedMembers.length);
      }

      console.log(`🐌 CACHE MISS for ${cacheKey}. Fetching from PostgreSQL...`);
      let members = await groupModel.getGroupMembers(req.params.group_id);

      // If groupId matches DEMO_GROUP_ID, mask member names
      members = await Promise.all(
        members.map(async (item, index) => ({
          ...item,
          name: req.params.group_id == DEMO_GROUP_ID ? `DemoUser${index + 1}` : item.name,
          avatar: req.params.group_id == DEMO_GROUP_ID ? "https://api.dicebear.com/7.x/adventurer/svg?seed=345&gender=male" : item.avatar,
        }))
      );

      await redisClient.setEx(cacheKey, TIME.REDIS_CACHE_EXPIRY, JSON.stringify(members));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, members, members.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getGroupExpenseLogs: async (req, res) => {
    try {
      let groupList = await getExpenseChangeLog(req.params.group_id);

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, groupList);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getGroupTypeList: async (req, res) => {
    try {
      let groupList = await groupModel.getGroupTypeList();

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, groupList);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getMyPairs: async (req, res) => {
    try {
      let groupList = await groupModel.getMyPairs({
        group_id: req.params.group_id,
        user_id: req.user.user_id,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, groupList);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  toggleGroupSettlement: async (req, res) => {
    try {
      let response = await groupModel.toggleGroupSettlement({
        group_id: req.params.group_id,
        user_id: req.user.user_id,
      });

      await trackExpenseChange({
        groupId: req.params.group_id,
        expenseId: null,
        userId: req.user.user_id,
        actionType: response.is_settled ? "SETTLED" : "UNSETTLED",
        oldAmount: null,
        newAmount: null,
      });

      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:simplified`));

      return common.successResponse(res, Messages.GROUP_SETTLEMNT_TOGGLE(response.is_settled), HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  toggleGroupVisibilty: async (req, res) => {
    try {
      const response = await groupModel.toggleGroupVisibilty({
        group_id: req.params.group_id,
        user_id: req.user.user_id,
      });

      return common.successResponse(res, Messages.GROUP_STATUS_TOGGLE(response.is_active), HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  downloadGroupData: async (req, res) => {
    try {
      const response = await groupModel.downloadGroupData({
        group_id: req.params.group_id,
      });

      const { group, members, expenses, expenseMembers } = response;

      // Step 1: Initialize a map to track total spent by each user
      const totalSpentMap = new Map();

      // Step 2: Iterate over expenses to calculate the total spent
      expenses.forEach((expense) => {
        const { paid_by, expense_amount } = expense;

        // Find the user ID for the person who paid
        const user = members.find((member) => member.name === paid_by);

        // If the user is found, add the expense amount to their total spent
        if (user) {
          const currentTotal = totalSpentMap.get(user.user_id) || 0;
          totalSpentMap.set(user.user_id, currentTotal + parseFloat(expense_amount));
        }
      });

      // Step 3: Create an array of each user with their total spent
      const result = members.map((member) => ({
        user_id: member.user_id,
        name: member.name,
        total_spent: totalSpentMap.get(member.user_id) || 0,
      }));

      // Create an Excel workbook
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Group Report");

      // Header - Group Info
      sheet.addRow(["Group Name:", group.group_name]);
      sheet.addRow(["Group Type:", group.group_type]);
      sheet.addRow(["Total Amount Spent:", group.total_amount]);
      sheet.addRow([]); // Blank row

      // Group Members Section
      sheet.addRow(["Group Members", "Total Spent"]);
      result.forEach((member) => {
        sheet.addRow([member.name, member.total_spent]);
      });

      sheet.addRow([]); // Blank row

      // Expenses Section
      sheet.addRow(["Expense Name", "Expense Type", "Expense Amount", "Created At", "Paid By", ...members.map((m) => m.name)]);

      expenses.forEach((expense) => {
        const expenseRow = [expense.expense_name, expense.expense_type, expense.expense_amount, expense.created_at, expense.paid_by];

        // Add amounts per user
        const memberAmounts = members.map((member) => {
          const memberExpense = expenseMembers.find((em) => em.expense_id === expense.expense_id && em.name === member.name);
          return memberExpense ? memberExpense.amount : 0;
        });

        sheet.addRow([...expenseRow, ...memberAmounts]);
      });

      // Backend response headers should include:
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=group_data.xlsx");
      // Send the file
      await workbook.xlsx.write(res);
      return res.end();
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getGroupLogs: async (req, res) => {
    try {
      const response = await groupModel.getGroupLogs({
        group_id: req.params.group_id,
        user_id: req.user.user_id,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response, response.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getGrpupSpendAnalysis: async (req, res) => {
    try {
      const response = await groupModel.getGrpupSpendAnalysis({
        group_id: req.params.group_id,
        user_id: req.params.user_id != -1 ? req.params.user_id : null,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response, response.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getFriendsList: async (req, res) => {
    try {
      let response = await groupModel.getFriendsList(req.user.user_id, req.params.group_id, req.query.search);
      if (response.length) {
        response = await Promise.all(
          response.map(async (item) => {
            const maskedEmail = maskEmail(item.email);
            return { ...item, email: maskedEmail };
          })
        );
      }
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response, response.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  addGroupMember: async (req, res) => {
    try {
      await groupModel.addGroupMember({ userId: req.user.user_id, groupId: req.params.group_id, ...req.body });

      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:members`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getSimplifiedPairs: async (req, res) => {
    try {
      const cacheKey = generateCacheKey(`group:${req.params.group_id}:simplified`);
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`⚡ CACHE HIT for ${cacheKey}`);
        const parsedData = JSON.parse(cachedData);
        return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, parsedData, parsedData.length);
      }

      console.log(`🐌 CACHE MISS for ${cacheKey}. Fetching from PostgreSQL...`);
      const response = await groupModel.getSimplifiedPairs(req.params);

      await redisClient.setEx(cacheKey, TIME.REDIS_CACHE_EXPIRY, JSON.stringify(response));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response, response.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  editGroupDetails: async (req, res) => {
    try {
      await groupModel.editGroupDetails({
        groupId: req.params.group_id,
        ...req.body,
        userId: req.user.user_id,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  toggleMemberStatus: async (req, res) => {
    try {
      await groupModel.toggleMemberStatus({
        groupId: req.params.group_id,
        userId: req.user.user_id,
        memberId: req.params.user_id,
      });

      await redisClient.del(generateCacheKey(`group:${req.params.group_id}:members`));

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  setGroupBudget: async (req, res) => {
    try {
      if (req.body.budget === undefined || req.body.budget < 0) {
        return common.errorResponse(res, "Invalid budget amount", HttpStatus.BAD_REQUEST);
      }
      await groupModel.setGroupBudget({
        groupId: req.params.group_id,
        userId: req.user.user_id,
        budget: req.body.budget,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getBudgetDetails: async (req, res) => {
    try {
      const response = await groupModel.getBudgetDetails({
        groupId: req.params.group_id,
        userId: req.user.user_id,
      });

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, response);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  sendReminder: async (req, res) => {
    try {
      const toUserId = req.params.to_user_id;
      const groupId = req.params.group_id;

      // Get subscriptions for the target user
      let subscriptions = await usersModel.getUsersSWData([toUserId]);

      if (subscriptions && subscriptions.length > 0) {
        const payload = {
          title: "Hisabkar: Payment Reminder",
          body: `Please settle your pending expenses in the group.`,
          group_id: await encryptData(groupId),
        };

        subscriptions.forEach((sub) => sendNotificationsToUsers(sub, payload));
      }

      return common.successResponse(res, "Reminder sent successfully", HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
};
