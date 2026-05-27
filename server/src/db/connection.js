const ibmdb = require("ibm_db");
require("dotenv").config();

const connStr = `DATABASE=${process.env.DB2_DATABASE};HOSTNAME=${process.env.DB2_HOST};PORT=${process.env.DB2_PORT};PROTOCOL=TCPIP;UID=${process.env.DB2_USER};PWD=${process.env.DB2_PASSWORD};`;

async function query(sql, params = []) {
  const conn = await ibmdb.open(connStr);

  try {
    await conn.query(`SET CURRENT SCHEMA ${process.env.DB2_SCHEMA}`);

    const data = await conn.query(sql, params);

    return data;
  } catch (err) {
    throw err;
  } finally {
    await conn.close();
  }
}

module.exports = { query };
