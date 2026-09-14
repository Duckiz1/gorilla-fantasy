'use client';

import {useState} from 'react';
import {Plus, Users, X} from 'lucide-react';
import type {Player, Team} from '@/lib/game';

type Props={
  teams:Team[];
  players:Player[];
  busy:boolean;
  act:(path:string,body:object)=>Promise<boolean>;
};

export default function RosterManager({teams,players,busy,act}:Props){
  const [name,setName]=useState('');
  const [activeTeam,setActiveTeam]=useState('');
  const [discordId,setDiscordId]=useState('');

  function openTeam(teamId:string){setActiveTeam(teamId);setName('');setDiscordId('')}

  return <section className="match-card roster-manager">
    <div className="roster-title"><div><h2>Team rosters</h2><p className="section-description">Create a team first, then add its players directly beneath it.</p></div><Users size={24}/></div>
    {teams.length===0?<div className="empty-roster"><p>No teams yet.</p><span>Add your first team above to start its roster.</span></div>:<div className="team-rosters">{teams.map(t=>{const members=players.filter(p=>p.team===t.id);const adding=activeTeam===t.id;return <article className="team-roster-card" key={t.id}>
      <div className="team-roster-heading"><div><span className="team-badge small" style={{'--team-color':t.color} as React.CSSProperties}>{t.short[0]}</span><div><strong>{t.name}</strong><small>{members.length} {members.length===1?'player':'players'}</small></div></div><button type="button" onClick={()=>adding?setActiveTeam(''):openTeam(t.id)}>{adding?<><X size={16}/>Cancel</>:<><Plus size={16}/>Add player</>}</button></div>
      {members.length>0?<div className="team-members">{members.map(player=><div key={player.id}><span>{player.name.slice(0,1).toUpperCase()}</span><strong>{player.name}</strong></div>)}</div>:<p className="no-members">No players on this team yet.</p>}
      {adding&&<form className="organizer-form inline-player-form" onSubmit={async e=>{e.preventDefault();if(await act('/api/matches',{action:'player',name,team:t.id,discordId})){setName('');setDiscordId('');setActiveTeam('')}}}>
        <label>Player name<input autoFocus value={name} onChange={e=>setName(e.target.value)} required maxLength={50} placeholder="Player display name"/></label>
        <label>Discord user ID<input value={discordId} onChange={e=>setDiscordId(e.target.value.trim())} required inputMode="numeric" pattern="[0-9]{15,22}" placeholder="Example: 123456789012345678"/><small>Enable Discord Developer Mode, right-click the user, and choose Copy User ID. The ID stays private.</small></label>
        <button className="save-button" disabled={busy}>Add to {t.name} <Plus size={17}/></button>
      </form>}
    </article>})}</div>}
  </section>;
}
