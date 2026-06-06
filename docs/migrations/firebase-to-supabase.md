# Migration: Firebase → Supabase (self-hosted)

**Status:** Proposed
**Owner:** @caviri
**Created:** 2026-06-05

## Decision

Drop Firebase (Auth + Firestore + AppCheck + Storage) and replace it with a
self-hosted Supabase stack. Auth lives in GoTrue (Supabase's auth service),
application data lives in Supabase Postgres accessed through PostgREST.
Existing user accounts are not migrated; the cutover is a clean break and
the user base re-registers.

## Why drop Firebase

- Two packages, ~80 MB in `node_modules` (`firebase` + `firebase-admin`).
- Vendor lock-in to Google Cloud project `swiss-data-website-dev-76736`
  for dev and a separate prod project — both opaque from the host VM.
- `firebase-admin` pulls native Node bindings and ~500 ms cold-start cost
  on every Next.js API worker.
- Firestore is barely used: four collections, three of them tiny content
  (`faqData`, `teamMember`, `contactForm`), one operational (`users`).
- AppCheck is configured client-side but the server reads the same header
  as a Firebase ID token — the AppCheck signal is effectively dead weight.

## Why Supabase self-hosted (and not something lighter)

The team prefers Supabase. Trade-offs accepted:

- Heavier infra than the Auth.js + Postgres alternative (~8 containers
  instead of 1). Mitigated by joining the same `imaging-plaza-net` we
  built for the webapp compose.
- More moving parts to upgrade. Mitigated by pinning images and using
  the official upstream `supabase/docker` compose as a baseline.

Benefits we get back:

- Studio UI for inspecting tables, users, and policies.
- GoTrue handles email magic-link, Google OAuth, GitHub OAuth without
  per-provider glue code.
- Realtime subscriptions are a free upgrade if we later want to drop the
  Firestore `onSnapshot` pattern in `softwareFetchers.ts`.

## Out of scope

- Migrating existing Firebase users. Cutover is a clean break.
- Replacing GraphDB. Software metadata stays in GraphDB.
- Replacing Storage. We do not use Firebase Storage today.

## Target architecture

```
┌──────────────┐    HTTP    ┌────────────────┐    SQL    ┌──────────────┐
│  Next.js     │───────────▶│  Supabase      │──────────▶│  Postgres    │
│  webapp      │            │  (Kong + GT +  │           │  (auth.users,│
│              │            │   PostgREST)   │           │   public.*)  │
└──────────────┘            └────────────────┘           └──────────────┘
        │                            ▲
        │                            │
        │       cookie / JWT         │
        └────────────────────────────┘
```

- Webapp uses `@supabase/supabase-js` (client) and `@supabase/ssr`
  (server cookies + service-role for AuthHandler).
- All upstream calls to GraphDB / FAIR / SHACL / gimie unchanged.
- Self-hosted Supabase stack lives at `/imaging-plaza/supabase/` on the
  host (analogous to `/imaging-plaza/plausible/`), joined to
  `imaging-plaza-net` so the webapp reaches it as `http://kong:8000`.

## Data model

See [`db/schema.sql`](../../db/schema.sql) for the SQL.

Four public tables back what Firestore used to hold:

| Public table          | Replaces Firestore | Notes                                              |
|-----------------------|--------------------|----------------------------------------------------|
| `profiles`            | `users`            | `id` references `auth.users(id)`. Bookmarks +      |
|                       |                    | own-softwares are `text[]`, role is an enum.       |
| `faqs`                | `faqData`          | Public read, admin write.                          |
| `team_members`        | `teamMember`       | Public read, admin write.                          |
| `contact_submissions` | `contactForm`      | Public insert, admin read.                         |

`software` collection is dropped (never read or written in code).

## Feature mapping

| Firebase                                  | Supabase                                                       |
|-------------------------------------------|----------------------------------------------------------------|
| `signInWithEmailAndPassword`              | `supabase.auth.signInWithPassword`                             |
| `signInWithPopup(googleProvider)`         | `supabase.auth.signInWithOAuth({ provider: 'google' })`        |
| `signInWithPopup(githubProvider)`         | `supabase.auth.signInWithOAuth({ provider: 'github' })`        |
| `createUserWithEmailAndPassword`          | `supabase.auth.signUp`                                         |
| `sendPasswordResetEmail`                  | `supabase.auth.resetPasswordForEmail`                          |
| `onAuthStateChanged`                      | `supabase.auth.onAuthStateChange`                              |
| `getIdToken()`                            | `supabase.auth.getSession().access_token`                      |
| Server: `getAuth().verifyIdToken(token)`  | Server: `supabase.auth.getUser(token)` with service-role       |
| `getFirestore().collection('users').doc`  | `supabase.from('profiles').select/insert/update`               |
| `onSnapshot(query)`                       | `supabase.channel('profiles').on('postgres_changes', ...)`     |
| AppCheck token header                     | Drop. RLS + session cookie do the gating.                      |

## Phases

Each phase ships as its own commit. Build and tests must stay green
between phases — Firebase and Supabase coexist until phase 6.

| # | Phase                                         | Touches                                                                    |
|---|-----------------------------------------------|----------------------------------------------------------------------------|
| 0 | Land this plan + schema (this commit)         | `docs/migrations/`, `db/schema.sql`                                        |
| 1 | ✅ Stand up Supabase locally + apply schema   | `/imaging-plaza/supabase/` (host, not this repo) + verify migrations apply |
| 2 | ✅ Add Supabase client + server helpers       | `utils/supabase/`, `.env.dist`                                             |
| 3 | ✅ New `AuthContext` reading Supabase session | `utils/SupabaseAuthContext.tsx`, parallel with existing Firebase one       |
| 4 | ✅ Rewrite the four `/account/*` pages        | `pages/account/{login,create,setup,forgot-pw}.tsx` + AccountLogin children |
| 5 | ✅ Swap `fetchers/auth.ts` and `userFetchers.ts` | profile reads/writes + bookmarks via `supabase.from('profiles')`         |
| 6 | ✅ Swap server `AuthHandler`                  | `server/handler.ts` — verify Supabase access token instead of Firebase ID  |
| 7 | ✅ Replace `X-Firebase-AppCheck` header usage | `stores/userStore.tsx`, `stores/formStore.ts`, `components/.../*Card.tsx`  |
| 8 | ✅ Migrate `faq.server.ts`, `teamMembers.server` | server-side selects against Postgres                                     |
| 9 | ✅ Migrate `contactFetchers.ts`               | client insert via supabase, RLS allows anonymous insert                    |
| 10| ✅ Remove `firebase`, `firebase-admin` deps   | `package.json`, `package-lock.json`, drop `utils/firebase/`                |
| 11| ✅ Cleanup `firestore.rules`, env, dead consts | Delete `firestore.rules`, `DB_COL_*` constants, Firebase env vars         |

## Per-file checklist

### Delete after phase 11

- `utils/firebase/firebase.ts`
- `utils/firebase/firebaseAuth.ts`
- `utils/firebase/firebaseAdmin.ts`
- `firestore.rules`
- `constants/dbCollections.ts` (or pruned to just GraphDB collection names)
- `models/User.ts` FirebaseUser import — replace with Supabase `User`

### Edit

- `pages/_app.tsx` — wrap in Supabase session provider instead of AuthProvider
- `utils/AuthContext.tsx` — port to Supabase session
- `fetchers/auth.ts` — full rewrite against supabase-js
- `fetchers/userFetchers.ts` — `arrayUnion`/`arrayRemove` → SQL `array_append`/`array_remove`
- `fetchers/softwareFetchers.ts` — `onSnapshot` → `supabase.channel()`
- `fetchers/contactFetchers.ts` — `addDoc` → `supabase.from('contact_submissions').insert`
- `fetchers/faq.server.ts` — Firestore admin → server-side supabase client
- `fetchers/teamMembers.server.ts` — same
- `server/handler.ts` — `AuthRequest` uses Supabase service-role to verify
- `stores/userStore.tsx`, `stores/formStore.ts` — bearer token from session
- `components/Common/SoftwareCard/{H,V}SoftwareCard.tsx` — drop `getAuth()` use
- `components/Account/ChangePasswordModal.tsx` — `sendPasswordResetEmail` →
  `supabase.auth.resetPasswordForEmail`
- `.env.dist` — drop `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_ADMIN_*`, add
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`

### Keep

- `pages/api/softwares/*` — GraphDB only, no Firebase dependency
- `fetchers/sparqlFetchers.server.ts` — same
- `utils/AuthContext.tsx` API surface — keep `{user, isLoading, login*, logout}`
  so consumers don't all need rewriting

## Phase 1 status (completed 2026-06-06)

The Supabase stack is up on the dev VM at `/imaging-plaza/supabase/`,
joined to `imaging-plaza-net`. Three services:

- `supabase-db-1` (`supabase/postgres:15.1.1.78`) — DB on internal 5432
- `supabase-gotrue-1` (`supabase/gotrue:v2.151.0`) — auth on host 9999
- `supabase-mailpit-1` (`axllent/mailpit:v1.20`) — fake SMTP, UI on host 8025

Brought up with:

```bash
docker network create imaging-plaza-net   # if missing
cd /imaging-plaza/supabase
docker compose up -d
./sync-roles.sh     # one-time: align internal role passwords to .env
```

`db/schema.sql` from this repo applied cleanly against the running DB:

```bash
docker run --rm --network imaging-plaza-net \
  -e PGPASSWORD="$(grep ^POSTGRES_PASSWORD= /imaging-plaza/supabase/.env | cut -d= -f2-)" \
  -v $PWD/db/schema.sql:/schema.sql:ro \
  postgres:15-alpine \
  psql -h supabase-db-1 -U supabase_admin -d postgres -f /schema.sql
```

End-to-end verified:

- `POST /signup` to GoTrue returns a JWT and creates `auth.users` row.
- `on_auth_user_created` trigger fires → `public.profiles` row with
  `role=user`, empty bookmark arrays.
- `POST /recover` sends the reset email; Mailpit captures it at
  http://imagingplazadev.epfl.ch:8025 with `From: "Imaging Plaza" <noreply@...>`.

### Quirk worth documenting

`supabase/postgres:15.1.1.78` only honours `POSTGRES_PASSWORD` for the
`supabase_admin` superuser. The other internal roles
(`supabase_auth_admin`, `supabase_storage_admin`, `authenticator`,
`supabase_replication_admin`) keep an opaque image-baked password, so
every Supabase service that connects as one of them fails until they're
synced. `sync-roles.sh` does that via `supabase_admin` (the one role
that can `ALTER USER` reserved roles) and restarts GoTrue so it picks
up the change. Run it once after `docker compose up -d` on a fresh
stack; idempotent on reruns.

## Rollback

The cutover happens in phase 6 (server) + phase 10 (delete deps).
Until phase 10 lands on main, reverting to the previous main restores
Firebase. After phase 10, rollback means re-adding the Firebase packages
and reinstating the deleted `utils/firebase/` files — practical if done
within a release window, costly if user accounts have been created in
Supabase.

## Email delivery (decided 2026-06-05)

GoTrue sends transactional email for signup confirmation, password reset,
magic link, and invites. We use **Mailgun, EU region** in every
environment, plus a Mailpit sidecar in dev for offline testing.

**Why Mailgun EU and not SendGrid free:** EU data residency matches the
EPFL profile; SendGrid's free tier is US-only. Volume is on the order of
a few dozen mails/month, so Mailgun's pay-as-you-go ($0.80 / 1000 mails)
is effectively free at this scale.

### What ops needs to do once

1. Sign up at mailgun.com and switch the account to the EU region.
2. Add a sending domain — recommend a subdomain like
   `mg.imaging-plaza.epfl.ch` so the parent domain's reputation is
   unaffected by transactional traffic.
3. Ask EPFL IT to publish the four DNS records Mailgun prints (one TXT
   for SPF, two TXTs for DKIM, one CNAME for tracking) and a single MX
   for inbound bounces.
4. From the Mailgun panel, copy the SMTP credentials of the new domain
   into `/imaging-plaza/supabase/.env`:

```env
GOTRUE_SMTP_HOST=smtp.eu.mailgun.org
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=postmaster@mg.imaging-plaza.epfl.ch
GOTRUE_SMTP_PASS=<paste from Mailgun panel>
GOTRUE_SMTP_ADMIN_EMAIL=noreply@imaging-plaza.epfl.ch
GOTRUE_SMTP_SENDER_NAME=Imaging Plaza
```

### Dev / local testing

Until the DNS records are live, GoTrue points at a **Mailpit** container
in the Supabase compose. Captured mail is browsable at
`http://imagingplazadev.epfl.ch:8025` and never leaves the host:

```env
GOTRUE_SMTP_HOST=mailpit
GOTRUE_SMTP_PORT=1025
GOTRUE_SMTP_USER=
GOTRUE_SMTP_PASS=
```

Swap to the Mailgun block above once the domain is verified.

## Open questions

1. **OAuth redirect URLs.** GoTrue needs the public URL of the webapp to
   build callback URIs. In dev that is `http://imagingplazadev.epfl.ch:3000`;
   in prod that needs to be set per environment.
2. **Admin bootstrap.** First admin user — created via SQL or via
   Supabase Studio after the stack is up?
