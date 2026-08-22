# Agent rules — hisabkar

Read this before making any change here, regardless of which AI tool/agent
you are. These rules aren't tied to one assistant — follow them the same way
whether you're Claude Code, Cursor, Copilot, or anything else.

This is a single repo with two independent apps:

- `client/` — the React frontend
- `server/` — the Express backend

Each keeps its own `package.json`, dependencies, and lint/format setup. Only
git hooks and the version number are shared at the repo root.

## 1. Match what's already here — don't invent new conventions

Before creating a file or folder, find the closest existing example in the
same app and copy its shape. Do not introduce a new pattern because it seems
cleaner — each app has one established way to do most things; use it.

### `client/` (frontend)

- **Pages** live at `client/src/pages/<PageName>/<PageName>.tsx`, with
  page-specific styles in a sibling `style.module.css` in the same folder
  (see `src/pages/WhatsNew/`, `src/pages/SignIn/`). Folder name and component
  file name match, PascalCase.
- **Components** live at
  `client/src/components/<ComponentName>/<ComponentName>.tsx`
  (+ `style.module.css`). Small reusable primitives go under
  `client/src/components/Atoms/<AtomName>/`.
- **Routes**: add the path to `PROJECT_ROUTES` in
  `client/src/utils/constant/Constant.ts`, then wire the `<Route>` in
  `client/src/routes/ProjectRoutes.tsx`, wrapped in `PrivateRoute` (requires
  login) or `PublicRoute` (add `allowedRoutes={[...]}` if it should also be
  viewable while logged in, like `/support` and `/whats-new` — omit it if it
  should bounce a logged-in user back home, like `/legal/:pageType`).
- **API endpoint paths** go in `API_ROUTES` in the same `Constant.ts` — never
  inline a URL string in a component.
- **Redux slices**: `client/src/store/features/<name>Slice.ts`.
- **Helpers**: `client/src/utils/helpers/<name>Helper.ts`.
- **Static/reference data** (JSON consumed by the UI):
  `client/src/data/<name>.json`.

### `server/` (backend)

- **Routes**: `server/routes/<domain>.routes.js` — one file per domain
  (`chat`, `expense`, `group`, `users`, `support`, `chatbot`...), aggregated
  in `server/routes.js` / `server/routes/routes.js`.
- **Controllers**: `server/controller/<domain>.controller.js` — one per
  domain, matching the route file it backs.
- **Models**: `server/model/<domain>.model.js` — DB queries for that domain.
- **Middleware**: `server/middleware/<domain>Validation.js`.
- **Payload validation**: `server/validations/<domain>/payloadValidation.js`
  (Joi).
- **Helpers**: `server/helpers/<name>.js` — small reusable, cross-domain
  logic.
- **Constants/messages**: `server/utils/constant/constant.js`,
  `server/utils/constant/messages.js` — don't inline literal strings that
  belong there.
- **Config**: `server/configuration/<name>.js` (db, redis, general config).

## 2. Styling — dark/gold theme is the standing default (client only)

Read `client/REDESIGN_PLAN.md` before touching any UI code. In short:

- Use the `--hk-*` custom properties defined in `client/src/index.css` for
  color, border, surface, and spacing decisions on any redesigned/new page.
  Don't invent new hex values or reuse the legacy Tailwind gray/white palette
  that older pages (e.g. `Legals`) still use — that's pre-redesign, not the
  target.
- Reuse the shared atom classes already defined in `client/src/index.css`
  (`.hk-card`, `.hk-pill*`, `.hk-btn-primary`, `.hk-avatar*`, `.hk-money`,
  etc.) instead of re-implementing the same look in a new CSS module.
- Don't stack a CSS-module class on a shadcn primitive (`Button`, `Input`,
  ...) to override its size/spacing — see the "Gotchas" section in
  `client/REDESIGN_PLAN.md` for why that silently breaks.

## 3. Versioning — do this automatically, don't wait to be asked

`client/` and `server/` ship as one product with **one version number**,
tracked in the root `package.json` (`version` field) — not in
`client/package.json` or `server/package.json`, which no longer carry a
version at all. The changelog itself is `client/src/data/versionHistory.json`,
rendered publicly at `/whats-new` (linked from the sign-in page's version
pill).

**Whenever you complete a change that a user would actually notice or care
about** — a new feature, a new API capability, a bug fix, a UI change — bump
the version as part of that same change, automatically, regardless of
whether the change was in `client/`, `server/`, or both:

1. Decide the bump type ([semver](https://semver.org/)):
   - **patch** — bug fix, small styling/UX tweak, no new capability.
   - **minor** — new feature/endpoint, backward compatible.
   - **major** — breaking change (removes/changes existing behavior in a way
     that could break users or integrations).
2. Bump `version` in the **root** `package.json` to the new number.
3. Add a **new entry at the top** of the `versions` array in
   `client/src/data/versionHistory.json`, matching the existing shape
   exactly:
   ```json
   {
     "version": "3.5.0",
     "date": "YYYY-MM-DD",
     "type": "minor",
     "era": 3,
     "title": "Short title for this release",
     "changes": [
       { "type": "feature", "text": "What was added, in user-facing terms" },
       { "type": "fix", "text": "What was fixed, in user-facing terms" }
     ]
   }
   ```
   Use the real current date. Reuse the current `era` id unless this change
   is genuinely a new major chapter for the product (only three eras exist
   so far — see the `eras` array in the same file); if it is, add a new era
   entry too.
4. Update the top-level `"currentVersion"` field in the same JSON to match.

**One bump per logical change, not per commit.** If you're mid-way through a
multi-step task in the same session/PR that hasn't shipped yet, fold further
tweaks into the entry you already added instead of creating another one.

**Don't bump for**: pure refactors with no user-visible effect, doc/comment
changes, dev-tooling changes, or edits to this file.

## 4. Keep README.md current — do this automatically too

Each app has its own `README.md` (`client/README.md`, `server/README.md`).
If a change adds a new user-facing feature, screen, endpoint, or flow (not a
bug fix, not internal refactor), update the relevant app's `README.md` in
the same change:

- New feature/capability → add it to the **Features** list.
- New screen/page (client) → add or update the relevant entry under
  **Screens Overview**.
- New env var required to run the app → add it to the `.env` block under
  **Installation**.
- New major dependency that changes the stack story (e.g. a new state
  library, a new DB, a new queue) → update **Tech Stack**.

Keep additions short and in the same style as existing entries — don't
restructure the file or rewrite unrelated sections. If nothing in the change
is README-worthy, leave it alone.

## 5. Git hooks

There is a single `.husky/pre-commit` hook at the repo root — it runs
`client/`'s lint-staged/lint only when `client/` has staged changes, and
`server/`'s lint+format only when `server/` has staged changes. Don't add
per-app `.husky` folders back; edit the root hook instead if the check logic
needs to change.

## 6. Before finishing any change

If you touched `client/`, run `npx tsc --noEmit` inside `client/` to
type-check (the full `npm run build` currently fails for an unrelated,
pre-existing ESLint config mismatch — see `client/REDESIGN_PLAN.md` → Known
issues — so don't use it to validate your work).
