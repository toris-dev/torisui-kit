# Engineering Harness

This document defines the **machinery that guarantees quality** in TorisUI Kit.
The principle: tools block mistakes; humans don't have to remember to be careful.

## At a glance

```txt
Local:  pnpm verify  =  lint → typecheck → test → build
PR/CI:  .github/workflows/ci.yml  (same gate + package-content verification)
Release: GitHub Release → publish.yml → gates re-run → npm publish (OIDC)
Safety rails: prepublishOnly, files field, exports restriction, publishConfig.access,
              SHA-pinned actions, environment gate, tag/version assertion
```

## 1. Quality gates

Local and CI run **exactly the same** four-stage gate.

| Stage | Command | Tool | Catches |
| --- | --- | --- | --- |
| Lint | `pnpm lint` | ESLint 9 flat config + typescript-eslint + react-hooks | hook violations, unused vars, type-import consistency |
| Typecheck | `pnpm typecheck` | `tsc --noEmit` (strict, `noUncheckedIndexedAccess`) | type errors, unsafe index access |
| Test | `pnpm test` | vitest + @testing-library/react (jsdom) | behavior/a11y/keyboard regressions |
| Build | `pnpm build` | tsup + build-css.mjs | bundle/declaration failures, missing CSS |

`pnpm verify` runs all of it. **Required before every PR.**

### Testing strategy

- Location: `packages/ui/src/__tests__/*.test.tsx`
- Principle: test the **accessibility contract**, not the implementation —
  `getByRole` and `aria-*` assertions first
  - e.g. Switch asserts `role="switch"` + `aria-checked`; Tabs asserts arrow-key
    navigation; Dialog asserts Escape/overlay/alertdialog semantics
- vitest `globals: true` is **required for Testing Library auto-cleanup** —
  turning it off makes renders leak across tests
- Interactions use `@testing-library/user-event`, not `fireEvent` — with one
  exception: timer-driven components (Tooltip) use fake timers + `fireEvent`,
  because user-event's internal awaits deadlock against fake timers
- Timer behavior (toast auto-dismiss, tooltip delay) is tested with `vi.useFakeTimers()`

## 2. CI (.github/workflows/ci.yml)

Triggers: every PR + pushes to `main`. Order:

```txt
checkout → pnpm/action-setup → setup-node(24, pnpm cache)
→ pnpm install --frozen-lockfile
→ lint → typecheck → test → build
→ npm pack --dry-run --json + required-file assertion
```

Notes:

- **pnpm/action-setup must precede setup-node** for the pnpm store cache to work.
- The pnpm version comes from the `packageManager` field — one source of truth.
- `--frozen-lockfile` blocks lockfile drift in CI.
- The pack step **fails** if any required artifact (`dist/index.js`, `dist/index.cjs`,
  both `.d.ts` flavors, `dist/styles.css`, README, LICENSE) is missing — it is an
  assertion, not a log line.

## 3. Supply-chain & publish hardening

The publish pipeline can mint an npm OIDC token, so it gets extra rails:

- **Actions pinned to commit SHAs** (`actions/checkout@df4cb1c… # v6`) in all
  workflows. A re-pointed tag on a third-party action cannot inject code.
  When bumping, update the SHA and the trailing version comment together.
- **`environment: npm` gate on both publish workflows** (OIDC and token fallback).
  Create the environment in repo Settings → Environments and add required
  reviewers + deployment branch/tag rules — referencing a nonexistent
  environment auto-creates it with no protection.
- **Tag/version assertion**: publish.yml fails if the release tag doesn't equal
  `v<packages/ui/package.json version>` — no accidental version mismatches.
- **Token fallback is manual-only** (`workflow_dispatch`) and refuses to run
  from any ref but `main`.
- **Lifecycle scripts are restricted**: root `package.json` sets
  `pnpm.onlyBuiltDependencies: ["esbuild"]`, so arbitrary transitive
  dependencies can't run install scripts in CI.
- **prepublishOnly**: even a manual `npm publish` re-runs lint/typecheck/test/build.

### Package containment

- `files: ["dist", "README.md", "LICENSE"]` — sources, tests, and configs never ship
- `exports` limits consumers to `.` and `./styles.css`, with per-condition types
  (`index.d.ts` for import, `index.d.cts` for require)
- `publishConfig.access: public` declared for the scoped package
- CI's pack assertion keeps the file list visible in every PR log

## 4. Versioning harness (Changesets)

- Feature/fix PRs include `pnpm changeset` output (semver level + summary)
- `pnpm changeset version` bumps versions and generates CHANGELOGs
- `apps/docs` (torisui-docs) is in `.changeset/config.json` `ignore` — never versioned

## 5. Component quality bar (Definition of Done)

A new component must satisfy all of these to merge:

- [ ] TypeScript prop types exported
- [ ] `forwardRef` support (where sensible)
- [ ] `className` extension, native props pass-through
- [ ] Stateful components support controlled **and** uncontrolled (`useControllableState`)
- [ ] Styles use `--tori-*` tokens only (no hardcoded colors) → dark mode for free
- [ ] focus-visible styling (add to the shared selector list in base.css)
- [ ] Motion uses `--tori-motion-*` tokens → reduced-motion for free
- [ ] Keyboard navigation + correct ARIA roles/attributes
- [ ] Behavior tests in `src/__tests__/` (role-based queries)
- [ ] Demo added to the `apps/docs` playground
- [ ] Exported from `src/index.ts` + `pnpm verify` passes

## 6. Local development rules

- Commit prefixes: `feat / fix / style / refactor / docs / test / chore`
- Branches: `main` (stable) / `feat/*` / `fix/*` / `release/*`
- All documentation and code comments are written in English
- Formatting: Prettier (`pnpm format`). Not a CI gate, but run it before PRs
