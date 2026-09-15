import {env} from 'cloudflare:workers';
export function config(key:string):string{return String((env as unknown as Record<string,unknown>)[key]||process.env[key]||'');}
export function db():D1Database{const binding=(env as unknown as {DB?:D1Database}).DB;if(!binding)throw Error('Database is not connected yet.');return binding;}
