/**
 * Database connection module
 * Manages PostgreSQL connection using pg library
 */

import { Pool } from 'pg';

// Singleton pattern to ensure only one pool instance
let pool: Pool | null = null;

/**
 * Get database connection pool
 * Creates a new pool if it doesn't exist
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
      process.exit(-1);
    });
  }

  return pool;
}

/**
 * Execute a query
 */
export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const pool = getPool();
  return pool.connect();
}

/**
 * Close the database pool (useful for testing)
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
