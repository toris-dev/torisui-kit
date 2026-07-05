# TorisUI Kit — Agent Guide

pnpm workspace monorepo. The only published package is `packages/ui`
(npm: `@toris-dev/ui`); `apps/docs` is a non-published Vite playground.

## Harness (required gate)

```bash
pnpm verify   # lint → typecheck → test → build. Must pass before any PR.
```

- lint: one root `eslint.config.mjs` (flat config) covers the whole workspace
- test: vitest + Testing Library (jsdom) in `packages/ui`. `globals: true` is
  required for RTL auto-cleanup — do not turn it off
- build: tsup (ESM+CJS+d.ts), then `scripts/build-css.mjs` concatenates
  tokens → base → components into `dist/styles.css`. Do not reorder (cascade dependency)

## Conventions

- Component quality bar: forwardRef, className extension, controlled/uncontrolled,
  dark mode, focus-visible, reduced-motion, tests included — see docs/harness.md
- CSS: `tori-` prefixed BEM-ish classes + `--tori-*` CSS variables only. No CSS-in-JS
- Color tokens are RGB triplets (`124 58 237`) for `rgb(var(--tori-primary) / 0.4)` alpha composition
- All documentation and code comments are in English
- Commits: `feat|fix|style|refactor|docs|test|chore:` prefix
- Versioning/publishing: Changesets. Add a changeset to feature PRs.
  Publishing runs on GitHub Release via publish.yml (npm Trusted Publishing)

## Cautions

- `apps/docs` imports the library from **source via alias** (vite.config.ts +
  tsconfig paths), not from dist. New exports appear in the playground without a rebuild
- `packages/ui/package.json` `files`, `exports`, and `publishConfig.access: public`
  are publish safety rails — do not change casually
- GitHub Actions are **pinned to commit SHAs** (supply-chain hardening).
  When bumping, update the SHA and the trailing version comment together
- The publish workflows gate on the `npm` GitHub environment and assert the
  release tag matches the package version — keep those checks intact
