'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Medal, Trophy } from 'lucide-react';

type Player = { name: string; points: number; rank: number };
const PAGE_SIZE = 10;

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetch('/api/leaderboard').then(async response => {
      const data = await response.json() as { players?: Player[]; error?: string };
      if (!response.ok) throw Error(data.error);
      setPlayers(data.players || []);
    }).catch(reason => setError(reason instanceof Error ? reason.message : 'Could not load the leaderboard.'));
  }, []);

  const pages = Math.max(1, Math.ceil(players.length / PAGE_SIZE));
  const visible = players.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <section className="leaderboard-page">
    <div className="leaderboard-summary">
      <div><Trophy size={28}/><span>GLOBAL STANDINGS</span><strong>{players.length}</strong><small>ranked players</small></div>
      <p>Balances update automatically when match results settle single and full-week bets.</p>
    </div>
    {error ? <div className="notice" role="status">{error}</div> : !players.length ? <div className="bracket-wait"><Trophy size={42}/><h2>No ranked players yet.</h2><p>Players appear here after signing in with Discord.</p></div> : <div className="leaderboard-card">
      <div className="leaderboard-head"><span>RANK</span><span>PLAYER</span><span>POINTS</span></div>
      {visible.map((player, index) => <div className={'leaderboard-row rank-'+player.rank} key={(page - 1) * PAGE_SIZE + index}>
        <span className="rank-number">{player.rank <= 3 ? <Medal size={19}/> : null}#{player.rank}</span>
        <strong>{player.name}</strong>
        <span className="leader-points">{player.points.toLocaleString()} PTS</span>
      </div>)}
      <div className="leaderboard-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={17}/> Previous</button>
        <div>{Array.from({ length: pages }, (_, index) => index + 1).map(number => <button aria-label={`Page ${number}`} className={number === page ? 'active' : ''} key={number} onClick={() => setPage(number)}>{number}</button>)}</div>
        <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={17}/></button>
      </div>
    </div>}
  </section>;
}
