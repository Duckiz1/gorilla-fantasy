import {z} from 'zod';
import {db,siteOwner,originOK} from '@/lib/server';
import type {Tournament} from '@/lib/game';
const actions=z.discriminatedUnion('action',[
 z.object({action:z.literal('deleteMatch'),id:z.string().min(1)}),
 z.object({action:z.literal('clearMatches')}),
 z.object({action:z.literal('removeUser'),id:z.string().min(1).max(200)}),
 z.object({action:z.literal('clearLeaderboard')})
]);
export async function POST(r:Request){
 if(!originOK(r)||!await siteOwner(r))return Response.json({error:'Owner access required.'},{status:403});
 try{
  const text=await r.text();if(text.length>2000)throw Error('Request too large.');
  const a=actions.parse(JSON.parse(text));
  if(a.action==='deleteMatch'||a.action==='clearMatches'){
   const row=await db().prepare('SELECT data FROM tournaments WHERE id = ?').bind('active').first<{data:string}>();
   if(!row)throw Error('No matches to delete.');
   const t=JSON.parse(row.data) as Tournament;
   if(a.action==='deleteMatch'&&!t.matches.some(m=>m.id===a.id))throw Error('Match not found.');
   t.matches=a.action==='clearMatches'?[]:t.matches.filter(m=>m.id!==a.id);
   const result=await db().prepare('UPDATE tournaments SET data = ? WHERE id = ? AND data = ?').bind(JSON.stringify(t),'active',row.data).run();
   if(!result.meta.changes)return Response.json({error:'Schedule changed. Reload and try again.'},{status:409});
  }else if(a.action==='removeUser'){
   const existing=await db().prepare('SELECT user FROM entries WHERE user = ? LIMIT 1').bind(a.id).first();
   if(!existing)throw Error('Leaderboard user not found. Refresh and try again.');
   await db().prepare("INSERT INTO entries (user,tournament,data) VALUES (?,'leaderboard:hidden','{}') ON CONFLICT(user,tournament) DO NOTHING").bind(a.id).run();
  }else{
   await db().prepare("INSERT INTO entries (user,tournament,data) SELECT DISTINCT user,'leaderboard:hidden','{}' FROM entries WHERE tournament <> 'leaderboard:hidden' ON CONFLICT(user,tournament) DO NOTHING").run();
  }
  return Response.json({saved:true});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not update records.'},{status:400});}
}
