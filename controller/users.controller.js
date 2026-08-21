const userModel = require("../model/users.model");
const groupModel = require("../model/group.model");
const common = require("./common.controller");
const { HttpStatus } = require("../utils/constant/constant");
const Messages = require("../utils/constant/messages");
const config = require("../configuration/config");
const { generateAvatarImage, maskEmail, generateCacheKey } = require("../utils/common/common");
const { encryptData } = require("../utils/encryption");
const redisClient = require("../configuration/redis");

module.exports = {
  googleLogin: async (req, res) => {
    try {
      const access_token = req.body.token;

      // Fetch user info from Google's UserInfo endpoint
      const response = await fetch(config.GOOGLE.GOOGLE_INFO_ENDPOINT, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!response.ok) {
        return res.status(401).json({ message: "Invalid token", success: 0 });
      }

      const { email, name, picture } = await response.json();
      let user = await userModel.getUserDetailsByEmail(email);

      if (!user) {
        // Don't silently create an account for an email the user may have
        // signed in with by mistake — require an explicit confirmation from
        // the client first (see SignIn.tsx's "create a new account?" prompt).
        if (!req.body.confirmNewAccount) {
          return res.status(HttpStatus.OK).json({
            success: 0,
            code: "NEW_ACCOUNT_CONFIRMATION_REQUIRED",
            message: Messages.NEW_ACCOUNT_CONFIRMATION_REQUIRED,
            data: { email, name, picture },
          });
        }

        const avatarImage = generateAvatarImage();
        const hashedUPIAddress = encryptData("dummy@upi");

        user = await userModel.register({
          name,
          email,
          avatar: !picture ? avatarImage : picture,
          upiAddress: hashedUPIAddress,
        });
        user.isNewUser = true;
      }

      if (!user.is_active) {
        return res.status(401).json({ message: Messages.USER_DEACTIVATED, success: 0 });
      }

      const token = await common.generateUserToken(user);
      return common.successResponse(res, Messages.LOGIN_SUCCESS, HttpStatus.OK, { token });
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  sWSubscribe: async (req, res) => {
    try {
      await userModel.sWSubscribe({ ...req.body, userId: req.user.user_id });
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getUserProfileDetails: async (req, res) => {
    try {
      const response = await userModel.getUserProfileDetails(req.user.user_id);
      const maskedEmail = maskEmail(response.email);
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, { ...response, email: maskedEmail });
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  generateNewAvatars: async (req, res) => {
    try {
      let avatarImage1 = generateAvatarImage();
      let avatarImage2 = generateAvatarImage();
      let avatarImage3 = generateAvatarImage();
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, [avatarImage1, avatarImage2, avatarImage3]);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  updateProfileDetails: async (req, res) => {
    try {
      await userModel.updateProfileDetails({ ...req.body, userId: req.user.user_id });

      // Invalidate cached group member lists so the updated availability/profile shows up immediately
      const groupIds = await groupModel.getGroupIdsByUser(req.user.user_id);
      for (const groupId of groupIds) {
        await redisClient.del(generateCacheKey(`group:${groupId}:members`));
      }

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  toggleAvailiblityStatus: async (req, res) => {
    try {
      await userModel.toggleAvailiblityStatus(req.user.user_id);

      // Invalidate cached group member lists so the new availability shows up immediately
      const groupIds = await groupModel.getGroupIdsByUser(req.user.user_id);
      for (const groupId of groupIds) {
        await redisClient.del(generateCacheKey(`group:${groupId}:members`));
      }

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
};
