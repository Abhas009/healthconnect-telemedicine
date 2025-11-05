import pkg from 'pg';
import Redis from 'ioredis';
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'hc_user',
  password: process.env.PGPASSWORD || 'hc_password',
  database: process.env.PGDATABASE || 'healthconnect',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432
});

export const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
});
