const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const { Pool } = require("pg");
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/init", async (_, res) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `);
  await pool.query(`INSERT INTO users (name) VALUES ('Alice'), ('Bob')
    ON CONFLICT (name) DO NOTHING;`);
  res.send("Database initialized");
});

app.get("/users", async (_, res) => {
  const r = await pool.query("SELECT * FROM users");
  res.json(r.rows);
});

app.listen(port, () => console.log(`Listening on ${port}`));

