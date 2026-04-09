const client = require("../configuration/db");

const chatBotModel = {
  checkAndIncrementAiUsage: async (userId, limit) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Get current usage
      const checkQuery = `
        SELECT ai_message_count, last_ai_usage_date 
        FROM tbl_users WHERE user_id = $1
      `;
      const checkResult = await client.query(checkQuery, [userId]);
      const user = checkResult.rows[0];

      let currentCount = 0;
      const lastDate = user.last_ai_usage_date ? new Date(user.last_ai_usage_date).toISOString().split("T")[0] : null;

      if (lastDate === today) {
        currentCount = user.ai_message_count || 0;
      } else {
        // Reset counter for a new day
        currentCount = 0;
      }

      if (currentCount >= limit) {
        return { allowed: false, currentCount };
      }

      // Increment count
      const updateQuery = `
        UPDATE tbl_users 
        SET ai_message_count = $1, last_ai_usage_date = $2 
        WHERE user_id = $3
      `;
      await client.query(updateQuery, [currentCount + 1, today, userId]);

      return { allowed: true, currentCount: currentCount + 1 };
    } catch (error) {
      console.error("Error in checkAndIncrementAiUsage:", error.message);
      throw error;
    }
  },

  getGroupSummaryForAi: async (groupId) => {
    try {
      const query = `
        SELECT 
          g.group_name,
          g.total_amount::FLOAT,
          g.is_settled,
          (SELECT COUNT(*) FROM tbl_group_members WHERE group_id = $1) as member_count,
          (SELECT COUNT(*) FROM tbl_expenses WHERE group_id = $1 AND is_active = TRUE) as total_expenses
        FROM tbl_groups g
        WHERE g.group_id = $1
      `;
      const result = await client.query(query, [groupId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in getGroupSummaryForAi:", error.message);
      throw error;
    }
  },

  getUserExpensesForAi: async (groupId, userId) => {
    try {
      const query = `
        SELECT 
          COUNT(*) as expense_count,
          COALESCE(SUM(amount)::FLOAT, 0) as total_amount
        FROM tbl_expenses
        WHERE group_id = $1 AND paid_by = $2 AND is_active = TRUE
      `;
      const result = await client.query(query, [groupId, userId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in getUserExpensesForAi:", error.message);
      throw error;
    }
  },

  findExpensesByName: async (groupId, name) => {
    try {
      const query = `
        SELECT expense_name, amount::FLOAT, expense_type, created_at, (SELECT name FROM tbl_users WHERE user_id = paid_by) as payer
        FROM tbl_expenses
        WHERE group_id = $1 AND expense_name ILIKE $2 AND is_active = TRUE
        ORDER BY created_at DESC
        LIMIT 5
      `;
      const result = await client.query(query, [groupId, `%${name}%`]);
      return result.rows;
    } catch (error) {
      console.error("Error in findExpensesByName:", error.message);
      throw error;
    }
  },

  getExpensesByAmountRange: async (groupId, min, max) => {
    try {
      const query = `
        SELECT expense_name, amount::FLOAT, expense_type, created_at
        FROM tbl_expenses
        WHERE group_id = $1 AND amount >= $2 AND amount <= $3 AND is_active = TRUE
        ORDER BY amount DESC
        LIMIT 10
      `;
      const result = await client.query(query, [groupId, min || 0, max || 9999999]);
      return result.rows;
    } catch (error) {
      console.error("Error in getExpensesByAmountRange:", error.message);
      throw error;
    }
  },

  getPredictionDataForAi: async (groupId) => {
    try {
      const query = `
        SELECT 
          COALESCE(SUM(amount)::FLOAT, 0) as total_spent,
          MIN(created_at) as first_expense_date,
          COUNT(*) as total_count
        FROM tbl_expenses
        WHERE group_id = $1 AND is_active = TRUE
      `;
      const result = await client.query(query, [groupId]);
      const data = result.rows[0];

      // Also get the group creation date just in case no expenses exist
      const groupQuery = `SELECT created_at FROM tbl_groups WHERE group_id = $1`;
      const groupResult = await client.query(groupQuery, [groupId]);

      return {
        ...data,
        group_created_at: groupResult.rows[0]?.created_at,
      };
    } catch (error) {
      console.error("Error in getPredictionDataForAi:", error.message);
      throw error;
    }
  },
  getExpensesByCategory: async (groupId, category) => {
    try {
      const query = `
        SELECT expense_name, amount::FLOAT, created_at
        FROM tbl_expenses
        WHERE group_id = $1 AND expense_type ILIKE $2 AND is_active = TRUE
        ORDER BY created_at DESC
        LIMIT 10
      `;
      const result = await client.query(query, [groupId, category]);
      return result.rows;
    } catch (error) {
      console.error("Error in getExpensesByCategory:", error.message);
      throw error;
    }
  },
  getSpendingByCategory: async (groupId) => {
    try {
      const query = `
        SELECT expense_type, SUM(amount)::FLOAT as total_amount, COUNT(*) as count
        FROM tbl_expenses
        WHERE group_id = $1 AND is_active = TRUE
        GROUP BY expense_type
        ORDER BY total_amount DESC
      `;
      const result = await client.query(query, [groupId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getSpendingByCategory:", error.message);
      throw error;
    }
  },
};

module.exports = chatBotModel;
