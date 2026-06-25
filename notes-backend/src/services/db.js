import pkg from "pg";
import { env } from "../config/env.js";

const { Pool } = pkg;

let pool = null;

if (env.databaseUrl) {
  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  pool.on("error", (error) => {
    console.error("Postgres pool error:", error);
  });
}

export const dbEnabled = Boolean(pool);

export const initializeDatabase = async () => {
  if (!pool) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id text PRIMARY KEY,
      title text NOT NULL,
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
};

export const query = async (text, params) => {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return pool.query(text, params);
};
