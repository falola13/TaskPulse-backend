import pg from 'pg';

const host = process.env.DB_HOST ?? 'localhost';
const port = Number(process.env.DB_PORT ?? 5433);
const user = process.env.DB_USERNAME ?? 'postgres';
const password = process.env.DB_PASSWORD ?? 'postgres';
const name = process.env.DB_NAME ?? 'taskpulse_dev';

if (!/^[a-zA-Z0-9_]+$/.test(name)) {
  console.error('DB_NAME must contain only letters, digits, and underscores');
  process.exit(1);
}

const admin = new pg.Client({
  host,
  port,
  user,
  password,
  database: 'postgres',
});

await admin.connect();
const { rows } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
if (rows.length === 0) {
  await admin.query(`CREATE DATABASE ${name}`);
  console.log(`Created database ${name}`);
} else {
  console.log(`Database ${name} already exists`);
}
await admin.end();
