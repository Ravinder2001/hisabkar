const express = require("express");
const validateBody = require("../helpers/validateBodyHelper");
const schemas = require("../validations/users/payloadValidation");
const UserController = require("../controller/users.controller");
const { authenticateJWT } = require("../auth");

const router = express.Router();

router.post("/google-signin", validateBody(schemas.googleLogin), UserController.googleLogin);
router.post("/service-worker-subscribe", authenticateJWT, validateBody(schemas.subscriptionSchema), UserController.sWSubscribe);
router.get("/", authenticateJWT, UserController.getUserProfileDetails);
router.put("/", authenticateJWT, validateBody(schemas.updateProfileDetails), UserController.updateProfileDetails);
router.get("/generateAvatars", authenticateJWT, UserController.generateNewAvatars);
router.get("/toggleAvailibiltyStatus", authenticateJWT, UserController.toggleAvailiblityStatus);

module.exports = router;
