const moment = require("moment");
const client = require("../configuration/db");
const config = require("../configuration/config");

module.exports = {
  createSession: async ({ sessionId, userId, refreshTokenHash, userAgent, ipAddress }) => {
    try {
      const expiresAt = moment().utcOffset("+05:30").add(config.JWT.REFRESH_EXPIRY_DAYS, "days").format("YYYY-MM-DD HH:mm:ss");

      await client.query(
        `INSERT INTO tbl_user_sessions (session_id, user_id, refresh_token_hash, user_agent, ip_address, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [sessionId, userId, refreshTokenHash, userAgent, ipAddress, expiresAt]
      );

      return sessionId;
    } catch (error) {
      console.error("Error creating session:", error.message);
      throw error;
    }
  },

  getValidSession: async (sessionId) => {
    try {
      const { rows } = await client.query(`SELECT * FROM tbl_user_sessions WHERE session_id = $1 AND revoked_at IS NULL AND expires_at > NOW()`, [sessionId]);

      return rows[0];
    } catch (error) {
      console.error("Error fetching session:", error.message);
      throw error;
    }
  },

  // Looked up by the refresh token's hash directly (sha256 of a 64-byte
  // random value is effectively unique), so /refresh-token and /logout only
  // need the cookie — no need to also parse the (possibly expired) access
  // token to recover a session id.
  getValidSessionByHash: async (refreshTokenHash) => {
    try {
      const { rows } = await client.query(`SELECT * FROM tbl_user_sessions WHERE refresh_token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`, [refreshTokenHash]);

      return rows[0];
    } catch (error) {
      console.error("Error fetching session by hash:", error.message);
      throw error;
    }
  },

  rotateSession: async (sessionId, { refreshTokenHash }) => {
    try {
      const expiresAt = moment().utcOffset("+05:30").add(config.JWT.REFRESH_EXPIRY_DAYS, "days").format("YYYY-MM-DD HH:mm:ss");

      await client.query(`UPDATE tbl_user_sessions SET refresh_token_hash = $1, expires_at = $2 WHERE session_id = $3`, [refreshTokenHash, expiresAt, sessionId]);

      return;
    } catch (error) {
      console.error("Error rotating session:", error.message);
      throw error;
    }
  },

  revokeSession: async (sessionId) => {
    try {
      await client.query(`UPDATE tbl_user_sessions SET revoked_at = NOW() WHERE session_id = $1`, [sessionId]);
      return;
    } catch (error) {
      console.error("Error revoking session:", error.message);
      throw error;
    }
  },

  revokeSessionByHash: async (refreshTokenHash) => {
    try {
      await client.query(`UPDATE tbl_user_sessions SET revoked_at = NOW() WHERE refresh_token_hash = $1`, [refreshTokenHash]);
      return;
    } catch (error) {
      console.error("Error revoking session by hash:", error.message);
      throw error;
    }
  },

  revokeAllUserSessions: async (userId) => {
    try {
      await client.query(`UPDATE tbl_user_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);
      return;
    } catch (error) {
      console.error("Error revoking all sessions for user:", error.message);
      throw error;
    }
  },
};
