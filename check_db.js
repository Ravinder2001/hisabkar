const client = require("./configuration/db");
client
  .connect()
  .then(async () => {
    try {
      const res = await client.query("SELECT * FROM tbl_users LIMIT 1");
      console.log("Columns:", Object.keys(res.rows[0]));
      console.log("Last AI Usage Date type:", typeof res.rows[0].last_ai_usage_date, res.rows[0].last_ai_usage_date);
    } catch (err) {
      console.log(err.message);
    }
  })
  .finally(() => client.end());
