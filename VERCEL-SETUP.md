# Vercel migration

Deploy branch `codex/vercel-migration` from Duckiz1/gorilla-fantasy as a Next.js project. `vercel.json` selects the real Next.js build and `.next` output. The Cloudflare/Sites build remains available separately.

Create a Turso **libSQL** database and connect its credentials as server-only Vercel environment variables:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `SESSION_SECRET` (a fresh random secret of at least 32 characters)
- `OWNER_DISCORD_ID` = `690922143864848405`
- `SITE_URL` = the final HTTPS Vercel production address

The application creates missing tables automatically on its first database request. The setup script remains available for manual initialization.

The current Sites database is separate. Existing teams, schedules, entries, and points must be exported and imported before switching users to the new site. Do not treat a successful empty deployment as a completed migration. Keep the existing site available until the data transfer and login checks pass.

Add `https://YOUR-VERCEL-HOST/api/auth/callback` in the Discord application's OAuth2 redirect settings. Redeploy after setting environment variables. Validate owner login, teams, balances, bets, cancellation deadlines, and leaderboard before sharing the new address. Never put secrets in GitHub or NEXT_PUBLIC variables.
