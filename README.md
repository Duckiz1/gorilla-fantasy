# Gorilla Match Picks

The website supports match-winner picks, weekly seeding rankings, bracket-team qualification picks, and bracket predictions. Fantasy roster views remain hidden.

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

## Restored tournament predictions

The Seeding & bracket picks view has Stage 1 (weekly seeding rankings and bracket-team qualification picks) and Stage 2 (bracket winners through the final). Each window is an independent saved event; create a new weekly window rather than replacing historical picks. No fantasy roster is shown.

Owner area contains all team creation, match creation, prediction-window creation and verified results. Both current management endpoints and the older organizer endpoint enforce the configured owner identity on the server. Discord admins are not independently granted creation permission.

Owner creates each window with its eligible teams and closing time. For weekly predictions players rank every eligible team. For qualification predictions they choose the configured number of teams without ranking them. After qualification the owner creates a bracket window by selecting the confirmed teams in seed order. Single elimination supports 2/4/8/16/32 teams. Picks lock at the closing time. Results can only be submitted after closing. The owner enters official rankings, qualifiers, or a completed bracket in the corresponding window card. Changes recalculate points.

Scores: 25 per exact weekly seed position, 25 per correct qualifier, 50 per bracket-round winner, 100 for the finals champion. Prediction points are displayed within the prediction view; the header continues to show match points. Existing match and team data is preserved. Event and entry records reuse the current D1 schema; no migration is required.

Verification: TypeScript and production build, seven new prediction rule tests, and anonymous management rejections. Real Discord sign-in remains dependent on the Discord application configuration. Browser interaction testing was not requested for this update.

