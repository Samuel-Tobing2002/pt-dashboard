import { Pool } from 'pg';

console.log('📦 DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔒 DATABASE_SSL:', process.env.DATABASE_SSL);
console.log(process.env.DATABASE_URL)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.DATABASE_SSL === 'true' && {
    ssl: { rejectUnauthorized: false },
  }),
});

export default pool;
