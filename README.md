# Gorilla Fantasy

Discord-gated Gorilla Tag fantasy rosters, match-winner picks and two-stage tournament predictions. All predictions use points without monetary value; there are no deposits or payouts.

## Connect Discord

Set SITE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET and a random SESSION_SECRET of at least 32 characters in hosted environment settings. Mark both secrets private. Set ADMIN_DISCORD_IDS to comma-separated Discord user IDs for tournament organizers. Do not commit secrets.

Register https://gorilla-fantasy.harryhadeyn.chatgpt.site/api/auth/callback in the Discord application OAuth2 redirect list. Local redirect: http://localhost:5173/api/auth/callback, with the matching local SITE_URL. OAuth uses identify only; authorization codes and access tokens remain server-side and are not stored. Signed HttpOnly sessions expire after seven days. Discord membership is not required. Platform owner-only hosting access is separate from Discord sign-in.

Discord OAuth reference: https://docs.discord.com/developers/topics/oauth2

## Tournament workflow

Until an organizer publishes a real tournament, the site shows explicitly labeled, read-only examples. An allowlisted organizer signs in and uses Tournament desk to rename teams and players, configure dates, and publish. Current scope: eight initial teams of four players; four qualifiers and a single-elimination semifinal/final bracket. Organizer forms can add matches. Publish a new tournament key for each competition.

Qualifier picks lock before seeding starts. Organizer publishes the four qualified teams in seed order and opens bracket predictions. Seed 1 plays 4 and seed 2 plays 3. Players select both semifinal winners and a finals champion before the bracket lock. Changing an earlier winner clears the champion. Tournament phases cannot move backward, confirmed seeds cannot change, and expired deadlines cannot change after entries exist.

A match is 4v4; each round includes two timed team runs, the longer wins the round, and first to three round wins takes the match. Organizers enter verified winners. Ties, forfeits, disconnects and disputed results require organizer resolution before entering a winner.

Provisional fantasy scoring: one point per completed second of individual survival, plus five per confirmed tag. Organizers enter verified cumulative fantasy totals. Correct qualifier = 25 points, semifinal winner = 50, champion = 100, match winner = 100. Scoring derives from the latest verified results, so refreshing never duplicates awards.

Entries persist in D1 under the verified Discord user ID and tournament key. All writes check the authenticated session, origin, deadlines and eligible selections. The example event cannot accept entries. The organizer endpoint checks the server-side Discord allowlist.

## Develop and verify

Use npm run install:ci, npm run dev and npm run build. If Windows npm shims fail, invoke the installed npm CLI with Node. Production output is a Cloudflare Worker. Database migrations are generated with npm run db:generate and applied by Sites at deployment.

TypeScript: npx tsc --noEmit. Rules tests: node --experimental-strip-types --test tests/game.test.ts.

Verified: production build, TypeScript, six rules tests, guest gating, desktop and mobile layout, mode navigation, bracket pending state, and valid/invalid WebMCP navigation. Real Discord end-to-end sign-in and authenticated user persistence need Discord application configuration and remain unverified. No credentials are bundled. No live teams or competition feed are connected.
