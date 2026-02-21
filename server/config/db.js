import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err);
  }
})();

export default db;