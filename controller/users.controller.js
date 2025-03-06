const userModel = require("../model/users.model");
const common = require("./common.controller");
const { HttpStatus } = require("../utils/constant/constant");
const Messages = require("../utils/constant/messages");
const config = require("../configuration/config");
const { generateAvatarImage, maskEmail } = require("../utils/common/common");
const { encryptData } = require("../utils/encryption");

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

      const { email, name } = await response.json();
      let user = await userModel.getUserDetailsByEmail(email);

      if (!user) {
        const avatarImage = generateAvatarImage();
        const hashedUPIAddress = encryptData("dummy@upi");

        user = await userModel.register({
          name,
          email,
          avatar: avatarImage,
          upiAddress: hashedUPIAddress,
        });
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
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  toggleAvailiblityStatus: async (req, res) => {
    try {
      await userModel.toggleAvailiblityStatus(req.user.user_id);
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
};
