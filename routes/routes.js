const express = require("express");
const router = express.Router();

const usersRouter = require("./users.routes");
const expenseRouter = require("./expense.routes");
const groupRouter = require("./group.routes");

// const { authLimiter, commonLimiter } = require("../helpers/rateLimitorHelper");

router.use("/user", usersRouter);
router.use("/group", groupRouter);
router.use("/expense", expenseRouter);
module.exports = router;
