import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.DATABASE_SSL === 'true' && {
    ssl: { rejectUnauthorized: false },
  }),
});

export default pool;
