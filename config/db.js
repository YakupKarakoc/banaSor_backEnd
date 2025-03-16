const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // veya doğrudan connection string
  ssl: {
    rejectUnauthorized: false, // Aiven için gerekli
  },
});

// Bağlantıyı test et
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("PostgreSQL bağlantı hatası:", err);
  } else {
    console.log("PostgreSQL Bağlandı! Zaman:", res.rows[0].now);
  }
});
module.exports = pool;
