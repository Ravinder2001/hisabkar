# Agent rules — hisabkar-server (backend)

Read this before making any change here, regardless of which AI tool/agent
you are. These rules aren't tied to one assistant — follow them the same way
whether you're Claude Code, Cursor, Copilot, or anything else.

## 1. Match what's already here — don't invent new conventions

Before creating a file, find the closest existing example in the same
folder and copy its shape/naming exactly. This repo has one established
pattern per concern; don't introduce a second one.

- **Routes**: `routes/<domain>.routes.js` — one file per domain (`chat`,
  `expense`, `group`, `users`, `support`, `chatbot`...), aggregated in
  `routes.js` / `routes/routes.js`.
- **Controllers**: `controller/<domain>.controller.js` — one per domain,
  matching the route file it backs.
- **Models**: `model/<domain>.model.js` — DB queries for that domain.
- **Middleware**: `middleware/<domain>Validation.js`.
- **Payload validation**: `validations/<domain>/payloadValidation.js` (Joi).
- **Helpers**: `helpers/<name>.js` — small reusable, cross-domain logic.
- **Constants/messages**: `utils/constant/constant.js`,
  `utils/constant/messages.js` — don't inline literal strings that belong
  there.
- **Config**: `configuration/<name>.js` (db, redis, general config).

## 2. Versioning — do this automatically, don't wait to be asked

This app ships **one version number shared by both repos** (this repo and
its sibling `hisabkar`, the frontend, expected to be checked out next to it
on disk). The changelog itself — `src/data/versionHistory.json` — and the
public `/whats-new` page both live in the **frontend** repo, but backend-only
changes bump the shared version too.

**Whenever you complete a change that a user would actually notice or care
about** — a new API capability, a bug fix, a behavior change — bump the
version as part of that same change, automatically:

1. Decide the bump type ([semver](https://semver.org/)):
   - **patch** — bug fix, no new capability (e.g. a cache-invalidation fix,
     a query fix).
   - **minor** — new endpoint/capability, backward compatible.
   - **major** — breaking API change.
2. Bump `version` in **both** `package.json` files to the same new number —
   this one (`hisabkar-server/package.json`) and the sibling frontend repo's
   `hisabkar/package.json` — even if only this repo actually changed. They
   must never drift apart.
3. Add a **new entry at the top** of the `versions` array in the frontend
   repo's `hisabkar/src/data/versionHistory.json`, matching its existing
   shape (`version`, `date`, `type`, `era`, `title`, `changes: [{type, text}]`
   — `type` per change is `"feature"` or `"fix"`, written in plain,
   user-facing terms, not implementation detail). Use the real current date.
   Reuse the current `era` id unless this is genuinely a new chapter for the
   product (see the `eras` array in the same file for the three so far).
4. Update `"currentVersion"` at the top of that same JSON to match.

**One bump per logical change, not per commit.** Fold follow-on tweaks to
work that hasn't shipped yet into the entry you already added instead of
creating another one.

**Don't bump for**: pure refactors with no behavior change, dev-tooling
changes, comment/doc changes, or edits to this file.

If the sibling `hisabkar` frontend repo isn't present on disk next to this
one, still bump this repo's own `package.json` and tell the user the
frontend side needs the matching update — don't skip the bump silently.

## 3. Keep README.md current — do this automatically too

If a change adds a new user-facing capability (not a bug fix, not internal
refactor), update `README.md` in the same change:

- New API capability/feature → add it to the **Features** list.
- New required env var → add it to the `.env` block under **Installation**.
- New major dependency that changes the stack story (e.g. a new external
  service, a new DB, a new queue) → update **Tech Stack**.

Keep additions short and in the same style as existing entries — don't
restructure the file or rewrite unrelated sections. If nothing in the change
is README-worthy (bug fix, refactor, internal-only change), leave it alone.
