# Backend Integration Brief

Context for wiring this frontend up to the real backend, `finance-dashboard-be`
(sibling repo, path: `../finance-dashboard-be`). Written at the point the backend was
just finished and verified end-to-end against a real database, before any frontend
integration work started — meant to save a fresh session from re-deriving decisions
that aren't obvious from either codebase alone. The backend's own README, controllers,
and DTOs are the source of truth for anything not covered here; this file exists for
the handful of things that require looking at *both* repos at once.

## Running the backend locally

See `finance-dashboard-be/README.md` for full setup. Short version: `.env` from
`.env.example`, `npm run migration:run`, `npm run bootstrap:admin`, `npm run start:dev`.
Default port is `3001` (`PORT` env var).

## Auth model — the biggest integration decision

The backend issues a JWT (`POST /auth/login` → `{ accessToken }`), verified via
`Authorization: Bearer <token>` on every other request. It does **not** set a cookie
itself — that's a frontend decision.

**This matters a lot here** because the existing pages (e.g.
`app/(protected)/organizations/[orgId]/profit-loss/page.tsx`) are async Server
Components that fetch data directly during render, not via client-side `fetch`. For
that pattern to keep working against a real backend, the JWT needs to be readable
**server-side** (in Server Components and in `middleware.ts` for route protection) —
which means an `httpOnly` cookie set via a Next.js Route Handler that proxies
`/auth/login`, not `localStorage` (which Server Components can't see at all).

This is an open decision for whoever does the integration:
- **Cookie + server-side fetch** (recommended fit for the current codebase): add a
  Next.js API route (e.g. `app/api/auth/login/route.ts`) that calls the backend's
  `/auth/login`, sets the token as an `httpOnly` cookie, and have Server Components /
  `middleware.ts` attach it as `Authorization: Bearer` when calling the backend. No
  data-fetching library needed.
- **Client-side + localStorage + a data-fetching library** (SWR/React Query — neither
  is currently a dependency): would require converting the currently-server-rendered
  pages (dashboard, profit-loss) into Client Components. Bigger structural change than
  the current pages assume.

## RBAC model (for UI-level permission rendering)

- One **global** role per user: `admin` | `staff`. Never per-organization.
- `admin` — sees every organization, can manage organizations/users/Autocount
  credentials/audit log.
- `staff` — only `report:view`. Only sees organizations explicitly granted (no access
  to Settings, user management, or audit log at all — those routes 403 for staff).
- `GET /auth/me` returns the current user's `role` — use it to decide what nav
  items/actions to render, but remember the backend also enforces this server-side, so
  UI hiding is just UX polish, not the security boundary.

## ⚠️ Organization ID type mismatch — needs a decision

`config/organizations.ts` currently types `Organization.id` as a **string slug**
(`"acme-inc"`) and every route (`/organizations/[orgId]/...`) is built around that. The
real backend's `organizations.id` is an **auto-increment integer** (`1`, `2`, ...) — see
`organizations.entity.ts` in the backend repo.

Pick one before wiring up organization switching:
- Simplest: switch the frontend to just using the backend's numeric ID directly in
  routes (`/organizations/1/dashboard`). No backend change needed.
- If slug-style URLs matter for readability, the backend would need a `slug` column
  added and slug→id resolution — that's backend work, not just a frontend swap.

## ⚠️ Profit & Loss response shape — small but real mismatch

`lib/profit-loss-mock.ts`'s `ProfitLossResponse` has `netSales`, `grossProfit`,
`netProfit` as **plain numbers**. The real backend
(`ProfitLossStatementDto` in `profit-loss/dto/profit-loss-statement.dto.ts`) returns
those three as **objects**: `{ label, amount, percent }` — matching AutoCount's native
report format. Every line item and section also gains a `percent` field the mock
doesn't have.

`ProfitLossTable`/`ProfitLossItem`/`ProfitLossSection` component(s) will need their
prop types and any `data.netSales` / `data.grossProfit` / `data.netProfit` usages
updated to read `.amount` (and can optionally start displaying `.percent`, which the
mock never had).

## ⚠️ Users page (`app/(protected)/(global)/users/page.tsx`) needs a UI rework, not just a data swap

The current mock UI shows each user's per-organization `{orgId, role}` access grants
with roles like Owner/Admin/Viewer — that model doesn't exist anymore. The real
backend has one global role per user (`admin`/`staff`) plus a flat list of
organizations a `staff` user has been granted access to (no role attached to the
grant). The page's data shape and probably its access-list UI (a role chip per org)
need to change to match — this is more than swapping a mock import for a fetch call.

## Known backend gaps (not blockers, just not built yet)

- **Dashboard** (`app/(protected)/organizations/[orgId]/dashboard/page.tsx`) has no
  backend endpoint at all — it's still 20 placeholder boxes on the frontend and there
  was never a requirements pass on what KPIs it should show. Nothing to integrate yet.
- **Invite-by-email flow**: `users.status` supports `invited`, but there's no email
  sending / invite-token acceptance flow built — `POST /users` creates a user directly
  with a real password today, it doesn't invite them.
- **xlsx export**: the frontend has an unused `xlsx` dependency; nothing on the backend
  supports export yet. Confirm with the user whether/how this is still planned.

## Full API reference

Base URL: `http://localhost:3001` locally (`PORT` env var). All routes except
`POST /auth/login` require `Authorization: Bearer <token>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/login` | public | `{email, password}` → `{accessToken}` |
| GET | `/auth/me` | any | returns JWT payload (`sub`, `email`, `fullName`, `role`) |
| GET | `/users` | admin | |
| POST | `/users` | admin | `{fullName, email, phone?, password, role}` |
| PATCH | `/users/:id` | admin | `{fullName?, phone?, role?, status?}` |
| POST | `/users/:id/organizations` | admin | grant access, `{organizationId}` |
| DELETE | `/users/:id/organizations/:orgId` | admin | revoke access |
| PATCH | `/account` | any | self profile: `{fullName?, phone?}` |
| PATCH | `/account/password` | any | `{currentPassword, newPassword}` |
| GET | `/organizations` | any | admin sees all; staff sees only granted |
| POST | `/organizations` | admin | `{name, registrationNumber?, plan?}` |
| GET | `/organizations/:orgId` | org-scoped | admin always; staff needs grant |
| PATCH | `/organizations/:orgId` | admin | |
| GET | `/organizations/:orgId/settings/database` | admin | password never returned, `hasPassword: true` instead |
| PUT | `/organizations/:orgId/settings/database` | admin | `{host, port, databaseName, username, password}` |
| POST | `/organizations/:orgId/settings/database/test-connection` | admin | tries a live connection, `{ok: true}` or an error |
| GET | `/organizations/:orgId/audit-log` | admin | |
| GET | `/organizations/:orgId/profit-loss?fromDate&toDate` | org-scoped + report:view | dates as `YYYY-MM-DD` |
| GET | `/health?orgId=` | public | app DB status always; Autocount status only if `orgId` passed |

**Error shape for Autocount connection failures** (from `profit-loss`, `test-connection`):
`{ statusCode, reason: 'NOT_CONFIGURED'|'AUTH_FAILED'|'UNREACHABLE'|'UNKNOWN', message }`
with HTTP status 424/502/503 respectively — the P&L page should handle these with a
useful message (e.g. "This organization's Autocount database isn't reachable") rather
than a generic error state.

## Suggested integration order

1. Decide the auth-flow question above, then wire real login (replace the no-op
   `login-form.tsx` submit handler) and route protection (`middleware.ts` doesn't exist
   yet — needs adding).
2. Replace `config/organizations.ts` with a real fetch, resolving the org-ID decision
   above first since it affects every route in `app/(protected)/organizations/[orgId]/`.
3. Wire `lib/profit-loss-mock.ts` usage to the real endpoint, updating
   `ProfitLossTable`'s prop types for the shape mismatch noted above.
4. Settings pages (organization, database, audit-log) — these map to real endpoints
   almost 1:1 already, straightforward swaps.
5. Users/Account pages — Account is a straightforward swap; Users needs the RBAC-model
   rework noted above.
6. Dashboard — blocked on KPI requirements, not an integration task yet.
