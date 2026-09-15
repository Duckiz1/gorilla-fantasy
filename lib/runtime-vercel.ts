import {createClient,type Client,type InValue,type ResultSet} from '@libsql/client';
export function config(key:string):string{return process.env[key]||'';}
let client:Client|undefined;
function connection(){if(!client){const url=config('TURSO_DATABASE_URL');if(!url)throw Error('Database is not connected yet.');client=createClient({url,authToken:config('TURSO_AUTH_TOKEN')||undefined});}return client;}
let schemaReady:Promise<void>|undefined;
async function ready(){const conn=connection();schemaReady||=conn.batch([
 'CREATE TABLE IF NOT EXISTS tournaments (id TEXT PRIMARY KEY, data TEXT NOT NULL)',
 'CREATE TABLE IF NOT EXISTS entries (user TEXT NOT NULL, tournament TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(user,tournament))'
],'write').then(()=>undefined);await schemaReady;return conn;}
function result(r:ResultSet){return {success:true,results:r.rows,meta:{changes:r.rowsAffected,last_row_id:Number(r.lastInsertRowid||0)}};}
class Statement{
 constructor(readonly sql:string,readonly args:InValue[]=[]){ }
 bind(...args:InValue[]){return new Statement(this.sql,args);}
 async first<T>(column?:string):Promise<T|null>{const row=(await (await ready()).execute(this)).rows[0];return (row?(column?row[column]:row):null) as T|null;}
 async all<T>(){return result(await (await ready()).execute(this)) as unknown as {success:boolean;results:T[];meta:{changes:number}};}
 async run(){return result(await (await ready()).execute(this));}
}
export function db():D1Database{return {prepare:(sql:string)=>new Statement(sql),batch:async(statements:Statement[])=>{const rows=await (await ready()).batch(statements,'write');return rows.map(result);}} as unknown as D1Database;}
