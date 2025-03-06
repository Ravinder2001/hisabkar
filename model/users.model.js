const client = require("../configuration/db");
const generateTimestamp = require("../utils/common/generateTimestamp");

module.exports = {
  register: async (values) => {
    try {
      await client.query("BEGIN");
      const updateUserRes = await client.query(
        `
        INSERT INTO tbl_users (name, avatar, email) VALUES ($1, $2, $3) RETURNING *
      `,
        [values.name, values.avatar, values.email]
      );

      const UserID = updateUserRes.rows[0].user_id;
      await client.query(
        `
        INSERT INTO tbl_upi_address(user_id,upi_address) VALUES($1,$2)
      `,
        [UserID, values.upiAddress]
      );
      await client.query(
        `
        INSERT INTO tbl_user_options(user_id,availibilty_status,created_at) VALUES($1,$2,$3)
      `,
        [UserID, true, generateTimestamp()]
      );
      await client.query("COMMIT");
      return updateUserRes.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in registering user:", error.message);
      throw error;
    }
  },
  getUserDetailsByEmail: async (email) => {
    try {
      const query = `SELECT * FROM tbl_users WHERE email = $1`;

      const params = [email];

      const result = await client.query(query, params);

      return result.rows[0];
    } catch (error) {
      console.error("Error in getting user details by email:", error.message);
      throw error;
    }
  },
  getUserDetailsByID: async (user_id) => {
    try {
      const query = `SELECT * FROM tbl_users WHERE user_id = $1`;

      const params = [user_id];

      const result = await client.query(query, params);

      return result.rows[0];
    } catch (error) {
      console.error("Error in getting user details by ID:", error.message);
      throw error;
    }
  },
  usernameExists: async (username) => {
    try {
      const query = `SELECT * FROM tbl_users WHERE username = $1`;

      const params = [username];

      const result = await client.query(query, params);

      return result.rows.length > 0;
    } catch (error) {
      console.error("Error in checking username:", error.message);
      throw error;
    }
  },
  sWSubscribe: async (values) => {
    try {
      await client.query(
        `INSERT INTO tbl_sw_subscriptions (user_id, endpoint, p256dh, auth, created_at) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) 
         DO UPDATE SET endpoint = $2, p256dh = $3, auth = $4, created_at = $5`,
        [values.userId, values.endpoint, values.keys.p256dh, values.keys.auth, generateTimestamp()]
      );

      return;
    } catch (error) {
      console.error("Error in checking username:", error.message);
      throw error;
    }
  },
  getUsersSWData: async (usersArray) => {
    try {
      const { rows } = await client.query(
        `SELECT tbl_sw_subscriptions.user_id, endpoint, tbl_users.name,
              jsonb_build_object('p256dh', p256dh, 'auth', auth) AS keys
       FROM tbl_sw_subscriptions
       LEFT JOIN tbl_users ON tbl_sw_subscriptions.user_id = tbl_users.user_id
       WHERE tbl_sw_subscriptions.user_id = ANY($1)`,
        [usersArray]
      );

      return rows; // Return the fetched subscription data
    } catch (error) {
      console.error("Error in fetching user subscriptions:", error.message);
      throw error;
    }
  },
  getUserProfileDetails: async (user_id) => {
    try {
      const { rows } = await client.query(
        `
        SELECT 
        u.email,
        u.name,
        u.avatar,
        u.created_at,
        u.role,
        uo.availibilty_status as is_available
        FROM tbl_users u
        LEFT JOIN tbl_user_options uo ON uo.user_id = u.user_id
       WHERE u.user_id = $1`,
        [user_id]
      );

      return rows[0]; // Return the fetched subscription data
    } catch (error) {
      console.error("Error in fetching user subscriptions:", error.message);
      throw error;
    }
  },
  updateProfileDetails: async (values) => {
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE tbl_users SET name = $1, avatar = $2 WHERE user_id = $3`, [values.name, values.avatar, values.userId]);
      await client.query(`UPDATE tbl_user_options SET availibilty_status = $1 WHERE user_id = $2`, [values.is_available, values.userId]);

      await client.query("COMMIT");
      return;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in fetching user subscriptions:", error.message);
      throw error;
    }
  },
  toggleAvailiblityStatus: async (user_id) => {
    try {
      await client.query(
        `
        UPDATE tbl_user_options SET availibilty_status = NOT availibilty_status WHERE user_id = $1`,
        [user_id]
      );

      return; // Return the fetched subscription data
    } catch (error) {
      console.error("Error in fetching user subscriptions:", error.message);
      throw error;
    }
  },
};
