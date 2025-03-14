const express = require("express");
const validateBody = require("../helpers/validateBodyHelper");
const schemas = require("../validations/support/payloadValidation");
const SupportController = require("../controller/support.controller");
const { authenticateJWT } = require("../auth");

const router = express.Router();

router.post("/", validateBody(schemas.createTicket), SupportController.createTicket);
router.get("/support_cat", SupportController.getSupportCatList);
router.get("/bug_priorities", authenticateJWT, SupportController.getBugPrioritiesList);

module.exports = router;
