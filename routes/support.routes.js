const express = require("express");
const validateBody = require("../helpers/validateBodyHelper");
const schemas = require("../validations/support/payloadValidation");
const SupportController = require("../controller/support.controller");
const { authenticateJWT } = require("../auth");

const router = express.Router();

router.post("/", authenticateJWT, validateBody(schemas.createTicket), SupportController.createTicket);

module.exports = router;
