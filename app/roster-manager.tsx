'use client';

import {useState} from 'react';
import {Plus, Users} from 'lucide-react';
import type {Player, Team} from '@/lib/game';

type Props={
  teams:Team[];
  players:Player[];
  busy:boolean;
  act:(path:string,body:object)=>Promise<boolean>;
};

export default function RosterManager({teams,players,busy,act}:Props){
  const [name,setName]=useState('');
  const [team,setTeam]=useState('');
  const [discordId,setDiscordId]=useState('');

  return <section className="match-card roster-manager">
    <div className="roster-title"><div><h2>Add a player</h2><p className="section-description">Link each competitor to their Discord account so the site can block bets involving their team.</p></div><Users size={24}/></div>
    <form className="organizer-form" onSubmit={async e=>{e.preventDefault();if(await act('/api/matches',{action:'player',name,team,discordId})){setName('');setDiscordId('')}}}>
      <label>Player name<input value={name} onChange={e=>setName(e.target.value)} required maxLength={50} placeholder="Player display name"/></label>
      <label>Team<select required value={team} onChange={e=>setTeam(e.target.value)}><option value="">Choose team</option>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      <label>Discord user ID<input value={discordId} onChange={e=>setDiscordId(e.target.value.trim())} required inputMode="numeric" pattern="[0-9]{15,22}" placeholder="Example: 123456789012345678"/><small>In Discord, enable Developer Mode, right-click the user, then choose Copy User ID. This ID stays private.</small></label>
      <button className="save-button" disabled={busy||teams.length===0}>Add player <Plus size={17}/></button>
    </form>
    <div className="roster-list">{players.length===0?<p>No players added yet.</p>:teams.map(t=>{const members=players.filter(p=>p.team===t.id);return members.length>0&&<div className="roster-team" key={t.id}><strong>{t.name}</strong><span>{members.map(p=>p.name).join(' · ')}</span></div>})}</div>
  </section>;
}
