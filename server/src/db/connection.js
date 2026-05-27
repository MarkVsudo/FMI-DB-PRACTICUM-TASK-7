const ibmdb = require("ibm_db");
require("dotenv").config();

const connStr = `DATABASE=${process.env.DB2_DATABASE};HOSTNAME=${process.env.DB2_HOST};PORT=${process.env.DB2_PORT};PROTOCOL=TCPIP;UID=${process.env.DB2_USER};PWD=${process.env.DB2_PASSWORD};`;

const pool = new ibmdb.Pool();

async function query(sql, params = []) {
  const conn = await pool.open(connStr);
  try {
    return await conn.query(sql, params);
  } finally {
    await conn.close();
  }
}

module.exports = { query };
