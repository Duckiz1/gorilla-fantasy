export type Team = { id: string; name: string; short: string; color: string };
export type Player = { id: string; name: string; team: string; points: number };
export type Match = {id:string;a:string;b:string;lock:string;winner?:string;week?:string;stage?:'seeding'|'bracket';betsOpen?:boolean};
export type Tournament = { id: string; name: string; example: boolean; phase: 'seeding'|'bracket'|'complete'; currentWeek?:string; seedLock: string; bracketLock: string; fantasyLock: string; teams: Team[]; players: Player[]; qualified: string[]; results: Record<string,string>; matches: Match[] };
export type SingleBet={winner:string;stake:number;placedAt:string};
export type WeekBet={picks:Record<string,string>;stake:number;placedAt:string};
export type Picks = { fantasy: string[]; seeding: string[]; bracket: Record<string,string>; matches: Record<string,string>; singleBets?:Record<string,SingleBet>;weekBets?:Record<string,WeekBet> };
export const emptyPicks = (): Picks => ({fantasy:[],seeding:[],bracket:{},matches:{},singleBets:{},weekBets:{}});
const names = ['Canopy','Vortex','Primal','Aftershock','Apex','Outlaws','Velocity','Nightfall'];
export const example: Tournament = {id:'example',name:'Forest Invitational',example:true,phase:'seeding',seedLock:'2026-10-01T18:00:00Z',bracketLock:'2026-10-03T18:00:00Z',fantasyLock:'2026-10-01T18:00:00Z',teams:names.map((name,i)=>({id:'t'+i,name,short:name.slice(0,3).toUpperCase(),color:['#bef264','#a78bfa','#fb923c','#38bdf8','#f472b6','#facc15','#2dd4bf','#94a3b8'][i]})),players:names.flatMap((_,i)=>['Runner','Scout','Chaser','Anchor'].map((role,j)=>({id:`p${i}-${j}`,name:`${names[i]} ${role}`,team:'t'+i,points:0}))),qualified:[],results:{},matches:[{id:'m1',a:'t0',b:'t1',lock:'2026-10-01T18:00:00Z'},{id:'m2',a:'t2',b:'t3',lock:'2026-10-01T19:00:00Z'}]};
export function pairings(qualified:string[],picks:Record<string,string>) { return [{id:'s1',teams:[qualified[0],qualified[3]]},{id:'s2',teams:[qualified[1],qualified[2]]},{id:'final',teams:[picks.s1,picks.s2]}]; }
export function validPicks(p:Picks,t:Tournament,previous:Picks,now=Date.now()) {
 if(!p||!Array.isArray(p.fantasy)||!Array.isArray(p.seeding)||!p.bracket||!p.matches) throw Error('Invalid picks.');
 const unchanged=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
 const unique=(a:string[])=>new Set(a).size===a.length;
 if(p.fantasy.length!==4||!unique(p.fantasy)||p.fantasy.some(id=>!t.players.some(x=>x.id===id))) {if(!unchanged(p.fantasy,previous.fantasy))throw Error('Choose four different players.');}
 if(p.seeding.length!==4||!unique(p.seeding)||p.seeding.some(id=>!t.teams.some(x=>x.id===id))) {if(!unchanged(p.seeding,previous.seeding))throw Error('Choose four qualifying teams.');}
 if(now>=Date.parse(t.fantasyLock)&&!unchanged(p.fantasy,previous.fantasy))throw Error('Fantasy rosters are locked.');
 if((t.phase!=='seeding'||now>=Date.parse(t.seedLock))&&!unchanged(p.seeding,previous.seeding))throw Error('Qualifier picks are locked.');
 if(!unchanged(p.bracket,previous.bracket)) {
  if(t.phase!=='bracket'||now>=Date.parse(t.bracketLock)||t.qualified.length!==4)throw Error('Bracket picks are not open.');
  const pairs=pairings(t.qualified,p.bracket);
  if(Object.keys(p.bracket).some(id=>!pairs.some(x=>x.id===id))||pairs.some(x=>!p.bracket[x.id]||!x.teams.includes(p.bracket[x.id])))throw Error('Complete a valid bracket through the final.');
 }
 for(const [id,winner] of Object.entries(p.matches)) {const m=t.matches.find(x=>x.id===id);if(!m||![m.a,m.b].includes(winner))throw Error('Invalid match pick.');if((now>=Date.parse(m.lock)||m.winner)&&winner!==previous.matches[id])throw Error('This match is locked.');}
 for(const id of Object.keys(previous.matches))if(!p.matches[id])throw Error('Existing match picks cannot be removed.');
 return p;
}
export function score(p:Picks,t:Tournament){return p.fantasy.reduce((n,id)=>n+(t.players.find(x=>x.id===id)?.points||0),0)+p.seeding.filter(id=>t.qualified.includes(id)).length*25+Object.entries(p.bracket).reduce((n,[id,w])=>n+(t.results[id]===w?(id==='final'?100:50):0),0)+t.matches.reduce((n,m)=>n+(m.winner&&p.matches[m.id]===m.winner?100:0),0);}
