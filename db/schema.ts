import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
export const tournaments = sqliteTable('tournaments',{id:text('id').primaryKey(),data:text('data').notNull()});
export const entries = sqliteTable('entries',{user:text('user').notNull(),tournament:text('tournament').notNull(),data:text('data').notNull()},t=>[primaryKey({columns:[t.user,t.tournament]})]);
