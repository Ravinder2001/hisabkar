/**
 * Module dependencies.
 */
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

/**
 * Module imports.
 */
const userModel = require("../../model/users.model");
const sessionsModel = require("../../model/sessions.model");
const config = require("../../configuration/config");
const Messages = require("../../utils/constant/messages");

/**
 * JWT options for passport-jwt strategy.
 * @type {Object}
 * @property {Function} jwtFromRequest - Function to extract JWT token from the request.
 * @property {string} secretOrKey - Secret key used to verify the JWT token.
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT.SECRET_KEY,
};

/**
 * Passport JWT strategy for admin authentication.
 * @param {Object} payload - Decoded JWT payload.
 * @param {Function} done - Callback function to indicate authentication success or failure.
 * @returns {Promise<void>} - Promise that resolves when authentication is complete.
 */

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      if (!payload.iss) {
        return done(null, false, { message: Messages.UNAUTHORIZED });
      }

      // Instant revocation: even a not-yet-expired access token is rejected
      // once its session has been logged out / force-logged-out, since we
      // check the session row on every request (see tbl_user_sessions).
      // A token with no sessionId predates the session system entirely (a
      // pre-migration 100-day JWT) and is rejected the same way, forcing a
      // one-time re-login onto the tracked/revocable session model.
      const session = payload.sessionId ? await sessionsModel.getValidSession(payload.sessionId) : null;
      if (!session) {
        return done(null, false, { message: Messages.TOKEN_EXPIRED });
      }

      const user = await userModel.getUserDetailsByID(payload.id);

      if (!user) {
        return done(null, false);
      }

      delete user.password;

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

/**
 * Module exports.
 */
module.exports = passport;
