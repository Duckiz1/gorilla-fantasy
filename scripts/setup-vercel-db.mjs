import {createClient} from '@libsql/client';
if(!process.env.TURSO_DATABASE_URL)throw Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN first.');
const db=createClient({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});
await db.batch([
 'CREATE TABLE IF NOT EXISTS tournaments (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
 'CREATE TABLE IF NOT EXISTS entries (user TEXT NOT NULL, tournament TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(user,tournament))'
],'write');
db.close();console.log('Database tables are ready. Existing data was preserved.');
