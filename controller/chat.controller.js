const chatModel = require("../model/chat.model");
const { decryptData } = require("../utils/encryption");

const getChatHistory = async (req, res) => {
  try {
    const groupId = await decryptData(req.params.groupId);
    const result = await chatModel.getChatHistory(groupId);
    res.status(200).json({
      success: 1,
      data: result,
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
