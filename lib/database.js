import postgres from 'postgres';

// Use the DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(connectionString, {
  ssl: 'require',
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export default sql;
