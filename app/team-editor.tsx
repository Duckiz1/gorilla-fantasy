'use client';
import {useState} from 'react';
import type {Team} from '@/lib/game';
export default function TeamEditor({team,busy,act}:{team:Team;busy:boolean;act:(path:string,body:object)=>Promise<boolean>}){
 const [editing,setEditing]=useState(false),[name,setName]=useState(team.name),[color,setColor]=useState(team.color);
 if(!editing)return <div className="record-row"><span className="team-badge" style={{'--team-color':team.color} as React.CSSProperties}>{team.short[0]}</span><strong>{team.name}</strong><button type="button" disabled={busy} onClick={()=>{setName(team.name);setColor(team.color);setEditing(true);}}>Edit team</button></div>;
 return <form className="organizer-form" onSubmit={async e=>{e.preventDefault();if(await act('/api/matches',{action:'editTeam',id:team.id,name,color}))setEditing(false);}}><label>Team name<input required maxLength={50} value={name} onChange={e=>setName(e.target.value)}/></label><label>Team color<input type="color" value={color} onChange={e=>setColor(e.target.value)}/><span>{color.toUpperCase()}</span></label><button className="save-button" disabled={busy}>Save team</button><button type="button" disabled={busy} onClick={()=>setEditing(false)}>Cancel</button></form>;
}
