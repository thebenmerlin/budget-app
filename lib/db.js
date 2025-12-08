import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable in lib/db.js');
}

// Build pool config. Allow toggling SSL via DATABASE_SSL env var.
// For Neon you may need SSL=true in Vercel, and DATABASE_SSL=true locally if required.
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.DATABASE_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

// Prevent creating many pools during hot-reload / serverless re-invocations.
let pool;
if (global._pgPool) {
  pool = global._pgPool;
} else {
  pool = new Pool(poolConfig);
  global._pgPool = pool;
}

export async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Optional: simple console log to help during development
    // console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    // Surface error clearly for debugging
    console.error('Database query error', err);
    throw err;
  }
}

// export pool in case you need transactions or client checkout
export { pool };