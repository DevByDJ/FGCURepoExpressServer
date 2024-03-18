require('dotenv').config()
const { Pool } = require("pg");

const  pool = new Pool ({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})


module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
  transaction: async (queries) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        const result = await client.query(query.text, query.params);
        results.push(result);
      }
      await client.query('COMMIT');
      return results;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  pool
};