const client = require("../configuration/db");

module.exports = {
  saveMessage: async (values) => {
    try {
      const query = `
        INSERT INTO tbl_chats (group_id, user_id, message, expense_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const queryParams = [values.groupId, values.userId, values.message, values.expenseId || null];
      const res = await client.query(query, queryParams);

      if (res.rows.length > 0) {
        const newMessage = res.rows[0];
        // Fetch user details for the message
        const userRes = await client.query("SELECT name FROM tbl_users WHERE user_id = $1", [values.userId]);
        newMessage.user_name = userRes.rows[0]?.name || "Unknown";
        return newMessage;
      }
      return null;
    } catch (error) {
      console.error("Error in saveMessage model:", error.message);
      throw error;
    }
  },

  getChatHistory: async (groupId) => {
    try {
      const query = `
        SELECT c.*, u.name as user_name 
        FROM tbl_chats c
        JOIN tbl_users u ON c.user_id = u.user_id
        WHERE c.group_id = $1
        ORDER BY c.created_at ASC;
      `;
      const result = await client.query(query, [groupId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getChatHistory model:", error.message);
      throw error;
    }
  },
};
