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
        const chat_id = res.rows[0].chat_id;
        // Fetch full message details including user name and rich expense info
        const detailQuery = `
          SELECT 
            c.*, 
            u.name as user_name,
            e.expense_name,
            e.amount as expense_amount,
            e.created_at as expense_date,
            et.icon as expense_icon,
            et.type_name as expense_type,
            (
              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                'name', u2.name,
                'amount', em.amount,
                'avatar', u2.avatar
              ))
              FROM tbl_expense_members em
              JOIN tbl_users u2 ON em.user_id = u2.user_id
              WHERE em.expense_id = e.expense_id
            ) as expense_members
          FROM tbl_chats c
          JOIN tbl_users u ON c.user_id = u.user_id
          LEFT JOIN tbl_expenses e ON c.expense_id = e.expense_id
          LEFT JOIN tbl_expense_types et ON e.expense_type_id = et.expense_type_id
          WHERE c.chat_id = $1;
        `;
        const detailRes = await client.query(detailQuery, [chat_id]);
        return detailRes.rows[0];
      }
      return null;
    } catch (error) {
      console.error("Error in saveMessage model:", error.message);
      throw error;
    }
  },

  getChatHistory: async (groupId, limit = 20, offset = 0) => {
    try {
      const query = `
        SELECT 
          c.*, 
          u.name as user_name,
          e.expense_name,
          e.amount as expense_amount,
          e.created_at as expense_date,
          et.icon as expense_icon,
          et.type_name as expense_type,
          (
            SELECT JSON_AGG(JSON_BUILD_OBJECT(
              'name', u2.name,
              'amount', em.amount,
              'avatar', u2.avatar
            ) ORDER BY u2.name)
            FROM tbl_expense_members em
            JOIN tbl_users u2 ON em.user_id = u2.user_id
            WHERE em.expense_id = e.expense_id
          ) as expense_members
        FROM tbl_chats c
        JOIN tbl_users u ON c.user_id = u.user_id
        LEFT JOIN tbl_expenses e ON c.expense_id = e.expense_id
        LEFT JOIN tbl_expense_types et ON e.expense_type_id = et.expense_type_id
        WHERE c.group_id = $1
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3;
      `;
      const result = await client.query(query, [groupId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error("Error in getChatHistory model:", error.message);
      throw error;
    }
  },
  getLastReadId: async (userId, groupId) => {
    try {
      const query = `
        SELECT last_read_chat_id 
        FROM tbl_chat_read_status 
        WHERE user_id = $1 AND group_id = $2;
      `;
      const result = await client.query(query, [userId, groupId]);
      return result.rows.length > 0 ? result.rows[0].last_read_chat_id : 0;
    } catch (error) {
      console.error("Error in getLastReadId model:", error.message);
      return 0;
    }
  },

  updateReadStatus: async (userId, groupId, lastChatId) => {
    try {
      const query = `
        INSERT INTO tbl_chat_read_status (user_id, group_id, last_read_chat_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, group_id) 
        DO UPDATE SET last_read_chat_id = EXCLUDED.last_read_chat_id
        WHERE tbl_chat_read_status.last_read_chat_id < EXCLUDED.last_read_chat_id;
      `;
      await client.query(query, [userId, groupId, lastChatId]);
      return true;
    } catch (error) {
      console.error("Error in updateReadStatus model:", error.message);
      throw error;
    }
  },
  checkUnreadStatus: async (userId, groupId) => {
    try {
      const query = `
        SELECT EXISTS (
          SELECT 1 FROM tbl_chats 
          WHERE group_id = $1 
          AND chat_id > (
            SELECT COALESCE(last_read_chat_id, 0) 
            FROM tbl_chat_read_status 
            WHERE user_id = $2 AND group_id = $1
          )
        ) as has_unread;
      `;
      const result = await client.query(query, [groupId, userId]);
      return result.rows[0].has_unread;
    } catch (error) {
      console.error("Error in checkUnreadStatus model:", error.message);
      return false;
    }
  },
};
