const { Pool } = require('pg');

const connectionString = process.env.postgresql://neondb_owner:npg_6BmY5QvwIUpa@ep-sweet-unit-a9p8s0bu-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      host: 'localhost',
      user: 'postgres',
      password: 'YOUR_LOCAL_PASSWORD',
      database: 'mystery_night_planner',
      port: 5432
    });

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('DB connection error:', err));

module.exports = pool;
