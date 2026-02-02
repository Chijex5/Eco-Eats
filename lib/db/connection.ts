/**
 * Database connection module
 * Manages MySQL connection using mysql2 library
 */
import 'dotenv/config';
import { createPool, type Pool, type PoolConnection, type ResultSetHeader } from 'mysql2/promise';

// Singleton pattern to ensure only one pool instance
let pool: Pool | null = null;

export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
  affectedRows?: number;
  insertId?: number | string;
}

function getPoolConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not configured');
  }

  const url = new URL(databaseUrl);
  const database = url.pathname.replace(/^\//, '');

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  };
}

/**
 * Get database connection pool
 * Creates a new pool if it doesn't exist
 */
export function getPool(): Pool {
  if (!pool) {
    pool = createPool(getPoolConfig());
  }

  return pool;
}

/**
 * Execute a query
 */
export async function query<T = unknown>(sql: string, params: readonly unknown[] = []): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const [rows] = await pool.execute(sql, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      const rowCount = Array.isArray(rows) ? rows.length : rows.affectedRows ?? 0;
      console.log('Executed query', { sql, duration, rows: rowCount });
    }

    if (Array.isArray(rows)) {
      return { rows: rows as T[], rowCount: rows.length };
    }

    const header = rows as ResultSetHeader;
    return {
      rows: [],
      rowCount: header.affectedRows ?? 0,
      affectedRows: header.affectedRows,
      insertId: header.insertId,
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getConnection(): Promise<PoolConnection> {
  const pool = getPool();
  return pool.getConnection();
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
