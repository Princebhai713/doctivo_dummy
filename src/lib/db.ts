
import { Pool } from 'pg';

/**
 * Optimized PostgreSQL connection pool with SSL support.
 * Checks for DATABASE_URL and provides clear error if missing or malformed.
 */
const connectionString = process.env.DATABASE_URL;

// Validation to prevent "ENOTFOUND base" error
const isValidUrl = connectionString && 
                   connectionString.startsWith('postgres') && 
                   !connectionString.includes('your_') &&
                   !connectionString.includes('base');

const pool = new Pool({
  connectionString: isValidUrl ? connectionString : undefined,
  ssl: connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1') 
    ? false 
    : { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client.', err.message);
});

export const query = async (text: string, params?: any[]) => {
  if (!isValidUrl) {
    throw new Error('Database Error: DATABASE_URL in .env is missing or invalid. Please paste your real connection string from Neon/Supabase.');
  }
  
  try {
    return await pool.query(text, params);
  } catch (error: any) {
    // Catch common host resolution errors
    if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
      throw new Error(`Connection Failed: Could not resolve database host. Check if your DATABASE_URL is correct.`);
    }
    throw error;
  }
};

export default pool;
