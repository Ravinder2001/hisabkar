const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.controller");
const passport = require("passport");

router.get("/history/:groupId", passport.authenticate("jwt", { session: false }), chatController.getChatHistory);

module.exports = router;
