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
          g.total_amount,
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
          COALESCE(SUM(amount), 0) as total_amount
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
};

module.exports = chatBotModel;
