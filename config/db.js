 const mysql = require("mysql2/promise");
require("dotenv").config();

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLPORT:", process.env.MYSQLPORT);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL Connected Successfully");

    connection.release();
  } catch (error) {
    console.error("MySQL Connection Error:", error);
  }
}

testConnection();

module.exports = pool;