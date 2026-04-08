const client = require("../configuration/db");
// const Messages = require("../utils/constant/messages");
const { decryptData } = require("../utils/encryption");

const getChatHistory = async (req, res) => {
  try {
    const groupId = await decryptData(req.params.groupId);
    const query = `
      SELECT c.*, u.name as user_name 
      FROM tbl_chats c
      JOIN tbl_users u ON c.user_id = u.user_id
      WHERE c.group_id = $1
      ORDER BY c.created_at ASC;
    `;
    const result = await client.query(query, [groupId]);
    res.status(200).json({
      success: 1,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: 0,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getChatHistory,
};
