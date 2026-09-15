import { db } from '@/lib/server';
import { emptyPicks, type Picks, type Tournament } from '@/lib/game';
import { normalizePicks, normalizeTournament, wallet } from '@/lib/bets';

type StoredRow = { user: string; data: string };

export async function GET() {
  try {
    const active = await db().prepare('SELECT data FROM tournaments WHERE id = ?').bind('active').first<{ data: string }>();
    if (!active) return Response.json({ players: [] }, { headers: { 'Cache-Control': 'no-store' } });

    const tournament = normalizeTournament(JSON.parse(active.data) as Tournament);
    const [profiles, entries] = await Promise.all([
      db().prepare('SELECT user,data FROM entries WHERE tournament = ?').bind('profile').all<StoredRow>(),
      db().prepare('SELECT user,data FROM entries WHERE tournament = ?').bind(tournament.id).all<StoredRow>(),
    ]);
    const names = new Map(profiles.results.map(row => {
      const profile = JSON.parse(row.data) as { name?: string };
      return [row.user, profile.name?.trim() || `Player ${row.user.slice(-4)}`];
    }));
    const picks = new Map(entries.results.map(row => [row.user, normalizePicks(JSON.parse(row.data) as Picks)]));
    const ids = new Set([...names.keys(), ...picks.keys()]);
    const ranked = [...ids].map(id => ({
      id,
      name: names.get(id) || `Player ${id.slice(-4)}`,
      points: wallet(picks.get(id) || emptyPicks(), tournament),
    })).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

    let previousPoints: number | undefined;
    let previousRank = 0;
    return Response.json({
      players: ranked.map((player, index) => {
        if (player.points !== previousPoints) previousRank = index + 1;
        previousPoints = player.points;
        return { name: player.name, points: player.points, rank: previousRank };
      }),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Could not load the leaderboard.' }, { status: 503 });
  }
}
