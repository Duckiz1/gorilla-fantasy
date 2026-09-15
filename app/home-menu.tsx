'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,Crosshair,GitBranch,LockKeyhole,Settings,ChevronRight,Trophy} from 'lucide-react';
const modes=[
 {id:'matches' as const,number:'01',title:'Match picks',tag:'CALL THE WINNER',description:'Pick the winner and choose how many points to bet.',detail:'Quick stakes · 2× wins',Icon:Crosshair},
 {id:'predictions' as const,number:'02',title:'Tournament predictions',tag:'SEE THE WHOLE PICTURE',description:'Predict who makes the bracket, then map the road to the final.',detail:'Qualifiers → Bracket → Champion',Icon:GitBranch},
 {id:'leaderboard' as const,number:'03',title:'Leaderboard',tag:'CHASE THE TOP SPOT',description:'Compare points with every player and see where you rank.',detail:'Live points · Global rankings',Icon:Trophy}
];
export function DiscordGate(){return <section className="discord-gate"><LockKeyhole size={34}/><h2>Your picks start with Discord.</h2><p>Sign in to access match picks, bracket qualifiers, and bracket predictions.</p><a className="discord-button" href="/api/auth/login">Sign in with Discord <ArrowUpRight size={18}/></a></section>}
export default function HomeMenu({signedIn,owner,onChoose}:{signedIn:boolean;owner:boolean;onChoose:(view:'home'|'matches'|'predictions'|'leaderboard'|'manage')=>void}){
 const [active,setActive]=useState(0);
 const [authMessage,setAuthMessage]=useState('');
 useEffect(()=>{const status=new URLSearchParams(window.location.search).get('auth');if(status==='setup')setAuthMessage('Discord sign-in is not connected yet. The owner needs to connect the Discord application before players can enter.');if(status==='failed')setAuthMessage('Discord sign-in did not finish. Please try again.');},[]);
 return <div className="home-menu">
 <div className="home-intro"><span className="eyebrow">COMPETITIVE GORILLA TAG</span><h1>Your call.<br/><em>Their game.</em></h1><p>Choose your arena.</p></div>
 {authMessage&&<div className="notice" role="alert">{authMessage}</div>}
 <div className="arena-menu">{modes.map((mode,index)=><button key={mode.id} className={'arena-card '+(active===index?'arena-active':'')} onMouseEnter={()=>setActive(index)} onFocus={()=>setActive(index)} onClick={()=>onChoose(mode.id)}>
 <div className="arena-top"><span>{mode.number} / {mode.tag}</span><mode.Icon size={32}/></div>
 <div className="arena-body"><h2>{mode.title}</h2><p>{mode.description}</p></div>
 <div className="arena-detail">{mode.detail}</div>
 <div className="arena-bottom"><span>{signedIn?'Enter picks':'Discord sign-in required'}</span>{signedIn?<ArrowUpRight size={24}/>:<LockKeyhole size={20}/>}</div>
 </button>)}</div>
 <div className="home-bottom"><div><strong>100 points. Make them count.</strong><p>Virtual play points · No cash value</p></div>{!signedIn&&<a className="discord-button" href="/api/auth/login">Sign in with Discord <ArrowUpRight size={18}/></a>}{owner&&<button className="home-manage" onClick={()=>onChoose('manage')}><Settings size={18}/>Manage competition<ChevronRight size={18}/></button>}</div>
 </div>
}
