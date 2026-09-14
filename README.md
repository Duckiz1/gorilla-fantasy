# Gorilla Match Picks

The current website focuses only on match-winner predictions. Fantasy and bracket views are hidden; earlier source and data remain available for future expansion.

## Owner workflow

Use Manage teams & matches to add team names, create a matchup between two different teams, choose a future start time, and enter the verified winner after the start. No players, seeding, bracket configuration, or Discord bot are required.

Owner access uses the trusted Sites authenticated-user headers and an explicit OWNER_ACCOUNT_EMAIL server-side allowlist. It is not granted to every signed-in visitor. OWNER_ACCOUNT_EMAIL is configured privately in Sites. The hosting access remains owner-only. The owner can also try predictions with their existing Site identity. Other participants retain Discord sign-in; their Discord application connection is still needed. Owner and Discord entries are separate identities.

Picks save immediately to D1 and lock at the match start. Correct picks earn 100 points. Results can be corrected by the owner, recalculating points without double awards. No money, deposits, or payouts. Team names are unique without case sensitivity. Concurrent updates reject stale data rather than silently overwriting it.

## Match format

4v4, alternating timed team runs. Longer team time wins a round. First to three round wins takes the match. Organizers verify results externally and enter the winner manually. Ties and disputes must be resolved before entering a winner.

## Discord setup for other players

Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in hosted settings. A Discord OAuth application is sufficient; a running bot is not required. Register https://gorilla-fantasy.harryhadeyn.chatgpt.site/api/auth/callback as the redirect. SITE_URL and SESSION_SECRET are already configured. Secrets must remain server-side. The OAuth flow uses identify only.

## Development

npm run dev; npm run build; npx tsc --noEmit. Windows fallback: node scripts/run-framework.mjs dev or build. D1 schema and migration are unchanged from the initial version. API endpoints check sign-in, explicit owner permission, origin, match deadlines, and eligible teams. Real Discord end-to-end login remains unverified until connected.
