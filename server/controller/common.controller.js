const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const config = require("../configuration/config");
const { HttpStatus } = require("../utils/constant/constant");
const sessionsModel = require("../model/sessions.model");
/**
 * Sends a successful JSON response with the specified message, optional status code, and optional data.
 * @author Ravinder Singh Negi
 * @param {Object} res - The Express response object.
 * @param {string} message - The message to be included in the response.
 * @param {number} [status=200] - The HTTP status code to be set for the response. Default is 200 (OK).
 * @param {any} [data] - Additional data to be included in the response.
 * @returns {Object} The Express response object.
 */
function successResponse(res, message, status = 200, data, count = null) {
  if (status === undefined) {
    status = 200;
  }
  return res.status(status).json({
    success: 1,
    message: message,
    data: data,
    ...(count >= 0 && count != null && { count: count }),
  });
}

/**
 * Sends a Error JSON response with the specified message, optional status code, and optional data.
 * @author Ravinder Singh Negi
 * @param {Object} res - The Express response object.
 * @param {string} message - The message to be included in the response.
 * @param {number} [status=500] - The HTTP status code to be set for the response. Default is 200 (OK).
 * @param {any} [data] - Additional data to be included in the response.
 * @returns {Object} The Express response object.
 */
function errorResponse(res, message, status = 500) {
  if (status === undefined) {
    status = 500;
  }
  return res.status(status).json({ success: 0, message: message });
}

/**
 * @desc Common error handling for Business logic controller
 * @author Ravinder Singh Negi
 * @param {error} - custom error
 * @param {*} res
 * @returns
 */
const handleAsyncError = (error, res) => {
  // common.logError(error); will add logger here
  console.log(error);

  return errorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
};

/**
 * @desc Function to check empty object
 * @param {object} obj
 * @returns true/false
 */
const isEmptyObj = (obj) => {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }
  return true;
};

const generateAccessToken = (data, sessionId) => {
  return jwt.sign(
    {
      iss: "hisabkar-server",
      id: data.user_id,
      name: data.name,
      role: data.role,
      avatar: data.avatar,
      isNewUser: data.isNewUser ?? false,
      sessionId,
      iat: Math.round(new Date().getTime() / 1000),
    },
    config.JWT.SECRET_KEY,
    {
      expiresIn: config.JWT.ACCESS_EXPIRY,
    }
  );
};

/**
 * @desc High-entropy opaque refresh token (not a JWT — nothing to decode,
 * just a random value the client holds and the server can look up).
 */
const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

/**
 * @desc Refresh tokens are hashed before storage, same reasoning as
 * passwords — a DB dump shouldn't hand out directly usable tokens.
 * sha256 (not bcrypt) is fine here since the input is already
 * high-entropy random data, not a low-entropy human password.
 */
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

/**
 * @desc Creates a new session row + matching access/refresh token pair for
 * a user (used on login, and again on each refresh to rotate the token).
 * @param {Object} user - user row (from tbl_users)
 * @param {Object} [req] - Express request, used to record user-agent/IP
 * @returns {Promise<{accessToken: string, refreshToken: string, sessionId: string}>}
 */
const issueSession = async (user, req) => {
  const sessionId = uuidv4();
  const refreshToken = generateRefreshToken();

  await sessionsModel.createSession({
    sessionId,
    userId: user.user_id,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: req?.headers?.["user-agent"] || null,
    ipAddress: req?.ip || null,
  });

  const accessToken = generateAccessToken(user, sessionId);
  return { accessToken, refreshToken, sessionId };
};

/**
 * @desc Rotates an existing session's refresh token in place (same
 * session_id, new hash) and issues a fresh access token to match.
 */
const rotateSession = async (session, user) => {
  const refreshToken = generateRefreshToken();
  await sessionsModel.rotateSession(session.session_id, { refreshTokenHash: hashToken(refreshToken) });
  const accessToken = generateAccessToken(user, session.session_id);
  return { accessToken, refreshToken };
};

module.exports = {
  errorResponse: errorResponse,
  isEmptyObj,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  issueSession,
  rotateSession,
  successResponse,
  handleAsyncError,
};
