'use client';
import {useEffect,useState} from 'react';
import type {Match,Team} from '@/lib/game';
type Ranked={id:string;name:string;rank:number;points:number};
export default function ManageRecords({matches,teams,act}:{matches:Match[];teams:Team[];act:(path:string,body:object)=>Promise<boolean>}){
 const [players,setPlayers]=useState<Ranked[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[page,setPage]=useState(1);
 async function load(){const r=await fetch('/api/leaderboard',{cache:'no-store'});const d=await r.json() as {players:Ranked[];error?:string};if(!r.ok)throw Error(d.error||'Could not load users.');setPlayers(d.players);setPage(1);}
 useEffect(()=>{void load().catch(e=>setError(e.message));},[]);
 async function run(body:object,message:string){if(!window.confirm(message))return;setBusy(true);setError('');try{if(await act('/api/manage-records',body))await load();}catch(e){setError(e instanceof Error?e.message:'Could not refresh users.');}finally{setBusy(false);}}
 const name=(id:string)=>teams.find(t=>t.id===id)?.name||'Unknown team';
 const pages=Math.max(1,Math.ceil(players.length/10));
 return <section className="match-card result-desk record-manager"><h2>Delete & clear</h2>
 <h3>Matches</h3><p>Deleting a match voids its single bets and any full-week ticket containing it. Stakes are refunded and payouts from those bets are removed.</p>
 <button className="danger-button" disabled={busy||!matches.length} onClick={()=>void run({action:'clearMatches'},'Delete ALL matches? All affected bets will be voided, stakes refunded, and their payouts removed. Teams and players remain.')}>Clear all matches</button>
 {matches.map(m=><div className="record-row" key={m.id}><div><strong>{name(m.a)} vs {name(m.b)}</strong><small>{m.week||'Week 1'} · {m.stage||'seeding'}</small></div><button className="danger-button" disabled={busy} onClick={()=>void run({action:'deleteMatch',id:m.id},'Delete '+name(m.a)+' vs '+name(m.b)+'? Related single and full-week bets will be voided and refunded.')}>Delete match</button></div>)}
 {!matches.length&&<p>No matches to delete.</p>}
 <h3>Leaderboard users</h3><p>Remove users from the leaderboard permanently. Their accounts, team memberships, and point balances remain. Signing in again will not restore their leaderboard entry. New users can still join.</p>
 <button className="danger-button" disabled={busy||!players.length} onClick={()=>void run({action:'clearLeaderboard'},'Remove ALL current users from the leaderboard? Their balances and accounts remain, but they will stay off the leaderboard even after signing in again.')}>Clear leaderboard</button>
 {players.slice((page-1)*10,page*10).map(p=><div className="record-row" key={p.id}><div><strong>#{p.rank} {p.name}</strong><small>{p.points} points</small></div><button className="danger-button" disabled={busy} onClick={()=>void run({action:'removeUser',id:p.id},'Remove '+p.name+' from the leaderboard? Their points and account will remain.')}>Remove user</button></div>)}
 {!players.length&&<p>No leaderboard users to remove.</p>}
 {pages>1&&<div className="leaderboard-pagination"><button disabled={busy||page===1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={busy||page===pages} onClick={()=>setPage(page+1)}>Next</button></div>}
 {error&&<p role="alert">{error}</p>}
 </section>;
}
