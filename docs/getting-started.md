# Getting Started

## Requirements

- Node.js ≥ 20 (CI uses 24)
- pnpm 9.x (pinned via the `packageManager` field: `pnpm@9.14.2`)

## Setup

```bash
git clone https://github.com/toris-dev/torisui-kit.git
cd torisui-kit
pnpm install
```

## Common commands

| Command | Description |
| --- | --- |
| `pnpm verify` | lint + typecheck + test + build — the full gate (required before PRs) |
| `pnpm lint` | ESLint (single root flat config, whole workspace) |
| `pnpm typecheck` | `tsc --noEmit` in every package |
| `pnpm test` | vitest unit/interaction tests |
| `pnpm build` | build all packages (ui: tsup + styles.css bundle) |
| `pnpm --filter torisui-docs dev` | playground dev server (localhost:5173) |
| `pnpm --filter @toris-dev/ui test:watch` | tests in watch mode |
| `pnpm changeset` | record a release note / version bump |
| `pnpm format` | Prettier |

## Playground (apps/docs)

`apps/docs` is a Vite demo app that shows every component variant and state on one page.

- The library is **aliased to source** (not dist) in `vite.config.ts`, so edits
  under `packages/ui/src` hot-reload instantly.
- Real consumers import `@toris-dev/ui` + `@toris-dev/ui/styles.css` (see the README).

## Adding a new component

1. Create `packages/ui/src/components/<name>.tsx` — follow the quality bar in [harness.md](./harness.md)
2. Add `tori-<name>` styles to `packages/ui/src/styles/components.css` (tokens only)
3. Export the component + prop types from `packages/ui/src/index.ts`
4. Write tests in `packages/ui/src/__tests__/<name>.test.tsx`
5. Add a demo section to `apps/docs/src/App.tsx`
6. Run `pnpm verify` → record the change with `pnpm changeset` → open a PR
