const chatModel = require("../model/chat.model");
const { decryptData } = require("../utils/encryption");

const getChatHistory = async (req, res) => {
  try {
    const groupId = await decryptData(req.params.groupId);
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const result = await chatModel.getChatHistory(groupId, limit, offset);
    const lastReadId = await chatModel.getLastReadId(req.user.user_id, groupId);
    res.status(200).json({
      success: 1,
      data: result,
      lastReadId: lastReadId,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: 0,
      message: "Internal server error",
    });
  }
};

const getUnreadStatus = async (req, res) => {
  try {
    const groupId = await decryptData(req.params.groupId);
    const hasUnread = await chatModel.checkUnreadStatus(req.user.user_id, groupId);
    res.status(200).json({
      success: 1,
      hasUnread: hasUnread,
    });
  } catch (error) {
    console.error("Error checking unread status:", error);
    res.status(500).json({ success: 0, message: "Internal server error" });
  }
};

module.exports = {
  getChatHistory,
  getUnreadStatus,
};
