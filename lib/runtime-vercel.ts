import {createClient,type Client,type InValue,type ResultSet} from '@libsql/client';
export function config(key:string):string{return process.env[key]||'';}
let client:Client|undefined;
function connection(){if(!client){const url=config('TURSO_DATABASE_URL');if(!url)throw Error('Database is not connected yet.');client=createClient({url,authToken:config('TURSO_AUTH_TOKEN')||undefined});}return client;}
function result(r:ResultSet){return {success:true,results:r.rows,meta:{changes:r.rowsAffected,last_row_id:Number(r.lastInsertRowid||0)}};}
class Statement{
 constructor(readonly sql:string,readonly args:InValue[]=[]){ }
 bind(...args:InValue[]){return new Statement(this.sql,args);}
 async first<T>(column?:string):Promise<T|null>{const row=(await connection().execute(this)).rows[0];return (row?(column?row[column]:row):null) as T|null;}
 async all<T>(){return result(await connection().execute(this)) as unknown as {success:boolean;results:T[];meta:{changes:number}};}
 async run(){return result(await connection().execute(this));}
}
export function db():D1Database{return {prepare:(sql:string)=>new Statement(sql),batch:async(statements:Statement[])=>{const rows=await connection().batch(statements,'write');return rows.map(result);}} as unknown as D1Database;}
