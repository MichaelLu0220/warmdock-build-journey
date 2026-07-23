# Architecture

WarmDock runs on web, desktop, and mobile against one backend. The shape that makes that survivable is boring on purpose.

## Layered by dependency direction

```
core      Domain types, pure rules, i18n. No I/O, no platform.
api       Backend client + adapters. Declares gateway PORTS (interfaces).
app       Framework-agnostic app layer: stores, orchestrators, injection points.
ui-web    DOM components. Shared by web + desktop only.
---
web       Next.js
desktop   Tauri (thin native bridge: encrypted cache, notifications, offline read)
mobile    Expo / React Native — its own native UI, reuses core + api + app
```

Apps depend on shared packages; shared packages never depend on apps. Logic lives as far down toward `core` as it can. When a rule needs to change, there is one place to change it, and the compiler finds the callers.

The rule that keeps this honest: **if you are about to import an app from a package, the logic is in the wrong layer.**

## Ports and gateways

The `api` package declares interfaces — `TaskGateway`, `SessionGateway`, `UnlockGateway`, `AuthGateway`, `AnalysisGateway`, and so on. Backend adapters implement them. The app layer depends only on the interfaces.

Each host wires its concrete implementations once at startup. Nothing below the app layer reaches for a global client.

This dependency inversion pays for itself in two places:

- **The demo.** `/demo` runs the entire product against in-memory fake gateways. Same components, same stores, same flows — no account, nothing persisted. It is not a mock-up; it is the app with a different backend.
- **Testing.** Orchestrators are testable without a network.

## The backend is authoritative

Every state change goes through a `SECURITY DEFINER` stored procedure. Row-level security guards direct reads. The client cannot write points, cannot grant itself an unlock, cannot settle its own day.

This matters more than usual here, because the product's value *is* its constraints. An app where the client can edit a completed task is not WarmDock with a bug; it is a different product.

Clients get a snapshot on startup and foreground, then stay in sync over realtime subscriptions. Polling was removed early.

### Rules exist in exactly two places, and they must agree

- The **authoritative** version, in SQL.
- A **pure mirror** in `core/rules/`, used only for optimistic UI prediction.

Changing a rule means a new migration, a matching database test, and updating the mirror. The mirror is never allowed to be the source of truth — if the two disagree, the database wins and the UI corrects itself on the next snapshot.

### Migrations are append-only

Numbered, ordered, and never edited once applied to production. A rule change is a new file, not a rewrite of an old one. The one exception is a migration that has not left the developer's machine yet — before it ships, rewriting it beats shipping a patch that exists only to fix something nobody ever ran.

### Database tests

The schema has its own test suite — around 130 assertions across ten files, run against a real database. They cover the state machine (including a fuzz over valid and invalid transitions), row-level isolation between users, settlement arithmetic, and every authoritative procedure's refusal cases.

These are the tests that matter most, because they test the layer that cannot be corrected by a client update.

## The AI call is a server-side proxy

The browser never sees the language-service key. It calls a same-origin route; the server verifies the caller is a signed-in user, injects the real key, and forwards the request.

The proxy also:

- caps the request body and validates its shape before forwarding
- refuses to start at all in production if the key is missing, rather than falling back to a development default
- returns a plain unavailable-status when the upstream cannot be reached, so the client can degrade instead of hanging

## Sharing: snapshots and live reads

Two things can be shared publicly, and they made opposite calls for the same reason — *what does the reader expect to see?*

- **A week in review** is a **frozen snapshot**. It describes one specific week; it should not change after you share it. The public read is a token lookup returning stored JSON — no derivation happens under an unauthenticated identity, so the attack surface is one indexed select.
- **A profile card** is a **live read**. Streak and points keep moving; a frozen card gets stale and wrong.

Both use unguessable random tokens, expose only whitelisted fields, are excluded from search indexing, and can be revoked. Revocation takes effect immediately — the public pages deliberately do not cache.

## Aesthetic as a constraint

The interface is a warm brown pixel-art world: hard shadows, no gradients, stepped animations rather than smooth interpolation, and a book of cards you turn rather than tabs you click.

This is a constraint, not decoration. A pixel typeface is wide and unforgiving, which caps how much text can fit anywhere — and that pressure keeps the copy short. More than once the fix for a layout bug was to delete a word rather than shrink a font.
