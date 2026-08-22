const express = require("express");
const chatbotController = require("../controller/chatbot.controller");
const { authenticateJWT } = require("../auth");
const validateData = require("../middleware/groupValidation");
const validateExpData = require("../middleware/expenseValidation");

const router = express.Router();

router.post("/message/:group_id", authenticateJWT, validateData.validateGroupId, validateExpData.validateGroupMembership, chatbotController.processChat);

module.exports = router;
