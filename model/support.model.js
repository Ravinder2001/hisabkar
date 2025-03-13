const client = require("../configuration/db");
const generateTimestamp = require("../utils/common/generateTimestamp");

module.exports = {
  createTicket: async (values) => {
    try {
      const { ticketType, email, phone, description, categoryId, priorityId } = values;

      const query = `
        INSERT INTO tbl_tickets 
          (ticket_type, email, phone, description, category_id, priority_id, status, resolved_at, resolution_notes,created_at) 
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;

      const params = [
        ticketType,
        email,
        phone || null, // Store as NULL if empty
        description,
        categoryId || null, // Store as NULL if not provided
        priorityId || null, // Store as NULL if not provided
        "OPEN",
        null,
        null,
        generateTimestamp(),
      ];

      const { rows } = await client.query(query, params);
      return rows[0]; // Return the created ticket details
    } catch (error) {
      console.error("Error in creating ticket:", error.message);
      throw error;
    }
  },
  getSupportCatList: async () => {
    try {
      const { rows } = await client.query(`SELECT category_id as value, category_name as label FROM tbl_support_categories`);
      return rows;
    } catch (error) {
      console.error("Error in creating ticket:", error.message);
      throw error;
    }
  },
  getBugPrioritiesList: async () => {
    try {
      const { rows } = await client.query(`SELECT priority_id as value, priority_name as label FROM tbl_bug_priorities`);
      return rows;
    } catch (error) {
      console.error("Error in creating ticket:", error.message);
      throw error;
    }
  },
};
